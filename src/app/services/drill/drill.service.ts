import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot
} from '@angular/fire/firestore';
import { Drill, DrillCategory, DrillLevel, FirestoreDrill } from '../../models/drill.model';

@Injectable({
  providedIn: 'root'
})
export class DrillService {
  private firestore = inject(Firestore);
  private translate = inject(TranslateService);

  private rawDrills$ = new Observable<FirestoreDrill[]>(subscriber => {
    const drillsCollection = collection(this.firestore, 'drills');
    const drillsQuery = query(drillsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(drillsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
      const drills = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as FirestoreDrill));
      subscriber.next(drills);
    }, (error) => {
      subscriber.error(error);
    });

    return () => unsubscribe();
  });

  private rawDrills = toSignal(this.rawDrills$, { initialValue: [] });

  private currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map(event => event.lang),
      startWith(this.translate.currentLang || 'en')
    ),
    { initialValue: 'en' }
  );


  public drills = computed(() => {
    const lang = this.currentLang();
    const drills = this.rawDrills();
    return drills.map(d => this.flattenDrill(d, lang));
  });


  private flattenDrill(drill: FirestoreDrill, lang: string): Drill {
    const safeLang = (lang === 'uk' || lang === 'en') ? lang : 'en';
    const translation = drill.translations?.[safeLang] || drill.translations?.['en'];

    return {
      id: drill.id,
      duration: drill.duration,
      category: drill.category,
      level: drill.level,
      imageUrl: drill.imageUrl,
      videoUrl: drill.videoUrl,
      equipment: translation?.equipment || [], // Get equipment from translation
      createdAt: drill.createdAt,
      updatedAt: drill.updatedAt,
      name: translation?.name || 'Unknown Drill',
      description: translation?.description || '',
      instructions: translation?.instructions || [],
      coachingTips: translation?.coachingTips || []
    };
  }

  getDrills(): Observable<Drill[]> {
    return combineLatest([
      this.rawDrills$,
      this.translate.onLangChange.pipe(startWith({ lang: this.translate.currentLang || 'en' }))
    ]).pipe(
      map(([drills, langEvent]) => {
        const lang = langEvent.lang || 'en';
        return drills.map(d => this.flattenDrill(d, lang));
      })
    );
  }

  getDrillById(id: string): Observable<FirestoreDrill | undefined> {
    return new Observable<FirestoreDrill | undefined>(subscriber => {

      const drillRef = doc(this.firestore, 'drills', id);

      const unsubscribe = onSnapshot(drillRef, (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as FirestoreDrill;
          subscriber.next(data); // Return raw FirestoreDrill, not flattened
        } else {
          subscriber.next(undefined); // Document not found
        }
      }, (error) => {
        console.error("Error fetching drill:", error);
        subscriber.error(error);
      });

      return () => unsubscribe();
    });
  }

  filterAndSearchDrills(
    searchQuery?: string,
    category?: DrillCategory,
    level?: DrillLevel
  ): Drill[] {
    const drills = this.drills();
    let filtered = [...drills];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(drill =>
        drill.name.toLowerCase().includes(lowerQuery) ||
        drill.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (category) {
      filtered = filtered.filter(drill => drill.category === category);
    }

    if (level) {
      filtered = filtered.filter(drill => drill.level === level);
    }

    return filtered;
  }
}
