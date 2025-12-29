import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc
} from '@angular/fire/firestore';
import { FirestorePlays, Play, PlayCategory, PlayComplexity } from '../../models/plays.model';

@Injectable({
  providedIn: 'root'
})
export class PlaysService {
  private firestore = inject(Firestore);
  private translate = inject(TranslateService);
  private collectionName = 'plays';

  private rawPlays$ = new Observable<FirestorePlays[]>(subscriber => {
    const col = collection(this.firestore, this.collectionName);
    const q = query(col, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as FirestorePlays));
      subscriber.next(data);
    }, (error) => {
      subscriber.error(error);
    });

    return () => unsubscribe();
  });

  private rawPlays = toSignal(this.rawPlays$, { initialValue: [] });

  private currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map(event => event.lang),
      startWith(this.translate.currentLang || 'en')
    ),
    { initialValue: 'en' }
  );

  public plays = computed(() => {
    const lang = this.currentLang();
    const items = this.rawPlays();
    return items.map(item => this.flattenPlay(item, lang));
  });

  private flattenPlay(item: FirestorePlays, lang: string): Play {
    const safeLang = (lang === 'uk' || lang === 'en') ? lang : 'en';
    const translation = item.translations?.[safeLang] || item.translations?.['en'] || {
      name: 'No Name',
      description: '',
      keyPoints: []
    };

    return {
      id: item.id,
      category: item.category,
      complexity: item.complexity,
      imageUrl: item.imageUrl,
      personnel: item.personnel,
      formation: item.formation,
      relatedDrillIds: item.relatedDrillIds,
      name: translation.name,
      description: translation.description,
      keyPoints: translation.keyPoints,
      videoUrl: item.videoUrl
    };
  }

  getCombinationsStream(): Observable<Play[]> {
    return combineLatest([
      this.rawPlays$,
      this.translate.onLangChange.pipe(startWith({ lang: this.translate.currentLang || 'en' }))
    ]).pipe(
      map(([items, langEvent]) => {
        const lang = langEvent.lang || 'en';
        return items.map(item => this.flattenPlay(item, lang));
      })
    );
  }

  getCombinationById(id: string): Observable<FirestorePlays | undefined> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return new Observable<FirestorePlays | undefined>(subscriber => {
      const unsubscribe = onSnapshot(docRef, (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as FirestorePlays;
          subscriber.next(data);
        } else {
          subscriber.next(undefined);
        }
      }, (error) => {
        subscriber.error(error);
      });
      return () => unsubscribe();
    });
  }

  getRawCombinationsStream(): Observable<FirestorePlays[]> {
    return this.rawPlays$;
  }

  getRawPlayById(id: string): Observable<FirestorePlays | undefined> {
    return this.getCombinationById(id);
  }

  async addPlay(play: Omit<FirestorePlays, 'id'>): Promise<string> {
    const col = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(col, {
      ...play,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async deletePlay(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(docRef);
  }

  async updatePlay(id: string, data: Partial<FirestorePlays>): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(docRef, { ...data });
  }

  filterPlays(plays: Play[], term?: string, category?: PlayCategory, complexity?: PlayComplexity, personnel?: string): Play[] {
    const query = term?.toLowerCase().trim();

    return plays.filter(c => {
      const matchSearch = !query || c.name.toLowerCase().includes(query) || (c.description && c.description.toLowerCase().includes(query));
      const matchCategory = !category || c.category === category;
      const matchComplexity = !complexity || c.complexity === complexity;
      const matchPersonnel = !personnel || c.personnel === personnel;

      return matchSearch && matchCategory && matchComplexity && matchPersonnel;
    });
  }

  filterAndSearchPlays(
    searchQuery?: string,
    category?: PlayCategory | 'all',
    complexity?: PlayComplexity | 'all'
  ): Play[] {
    const items = this.plays();
    let filtered = [...items];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(play =>
        play.name.toLowerCase().includes(lowerQuery) ||
        (play.description && play.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(play => play.category === category);
    }

    if (complexity && complexity !== 'all') {
      filtered = filtered.filter(play => play.complexity === complexity);
    }

    return filtered;
  }
}


