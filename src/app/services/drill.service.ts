// import { Injectable, signal, computed, inject } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { Observable, combineLatest, of } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';
// import { TranslateService } from '@ngx-translate/core';
// import {
//   Firestore,
//   collection,
//   doc,
//   docData,
//   query,
//   orderBy,
//   onSnapshot,
//   QuerySnapshot,
//   DocumentData
// } from '@angular/fire/firestore';
// import { Drill, DrillCategory, DrillLevel, FirestoreDrill } from '../models/drill.model';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class DrillService {
//   private firestore = inject(Firestore);
//   private translate = inject(TranslateService);
//
//   // --- 1. RAW DATA STREAM (Pattern from TrainingDbService) ---
//   // Цей Observable слухає базу через onSnapshot. Це надійно.
//   private rawDrills$ = new Observable<FirestoreDrill[]>(subscriber => {
//     const drillsCollection = collection(this.firestore, 'drills');
//     // Сортуємо, наприклад, по ID, щоб порядок був стабільним
//     const drillsQuery = query(drillsCollection, orderBy('id'));
//
//     const unsubscribe = onSnapshot(drillsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
//       const drills = snapshot.docs.map(doc => ({
//         ...doc.data(),
//         id: doc.id
//       } as FirestoreDrill));
//       subscriber.next(drills);
//     }, (error) => {
//       subscriber.error(error);
//     });
//
//     return () => unsubscribe();
//   });
//
//   // Перетворюємо потік з бази в Сигнал для зручної обробки
//   private rawDrills = toSignal(this.rawDrills$, { initialValue: [] });
//
//
//   // --- 2. LANGUAGE STREAM ---
//   // Сигнал поточної мови
//   private currentLang = toSignal(
//     this.translate.onLangChange.pipe(
//       map(event => event.lang),
//       startWith(this.translate.currentLang || 'en')
//     ),
//     { initialValue: 'en' }
//   );
//
//
//   // --- 3. MAIN COMPUTED SIGNAL ---
//   // Магія тут: коли оновлюється БАЗА або МОВА, цей сигнал перераховується.
//   // Він містить вже "пласкі" (перекладені) дріли.
//   public drills = computed(() => {
//     const lang = this.currentLang();
//     const drills = this.rawDrills();
//
//     return drills.map(d => this.flattenDrill(d, lang));
//   });
//
//
//   // --- HELPER: Flatten translation ---
//   private flattenDrill(drill: FirestoreDrill, lang: string): Drill {
//     const safeLang = (lang === 'uk' || lang === 'en') ? lang : 'en';
//     const translation = drill.translations?.[safeLang] || drill.translations?.['en'];
//
//     return {
//       id: drill.id,
//       duration: drill.duration,
//       category: drill.category,
//       level: drill.level,
//       imageUrl: drill.imageUrl,
//       videoUrl: drill.videoUrl,
//       equipment: drill.equipment,
//       createdAt: drill.createdAt,
//       updatedAt: drill.updatedAt,
//       name: translation?.name || 'Unknown Drill',
//       description: translation?.description || '',
//       instructions: translation?.instructions || [],
//       coachingTips: translation?.coachingTips || []
//     };
//   }
//
//
//   // --- PUBLIC API ---
//
//   // Повертає Observable перекладених дрілів (для компонентів, що юзають async pipe)
//   getDrills(): Observable<Drill[]> {
//     return combineLatest([
//       this.rawDrills$,
//       this.translate.onLangChange.pipe(startWith({ lang: this.translate.currentLang || 'en' }))
//     ]).pipe(
//       map(([drills, langEvent]) => {
//         const lang = langEvent.lang || 'en';
//         return drills.map(d => this.flattenDrill(d, lang));
//       })
//     );
//   }
//
//   getDrillById(id: string): Observable<Drill | undefined> {
//     const drillRef = doc(this.firestore, `drills/${id}`);
//     return (docData(drillRef, { idField: 'id' }) as Observable<FirestoreDrill>).pipe(
//       map(d => d ? this.flattenDrill(d, this.translate.currentLang || 'en') : undefined)
//     );
//   }
//
//   // --- FILTERING (Synchronous) ---
//   // Повертає звичайний масив Drill[], що фіксить помилки в шаблонах (length, @for)
//   filterAndSearchDrills(
//     searchQuery?: string,
//     category?: DrillCategory,
//     level?: DrillLevel
//   ): Drill[] {
//     const drills = this.drills(); // Беремо значення з computed сигналу
//     let filtered = [...drills];
//
//     if (searchQuery) {
//       const lowerQuery = searchQuery.toLowerCase();
//       filtered = filtered.filter(drill =>
//         drill.name.toLowerCase().includes(lowerQuery) ||
//         drill.description.toLowerCase().includes(lowerQuery)
//       );
//     }
//
//     if (category) {
//       filtered = filtered.filter(drill => drill.category === category);
//     }
//
//     if (level) {
//       filtered = filtered.filter(drill => drill.level === level);
//     }
//
//     return filtered;
//   }
// }


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
import { Drill, DrillCategory, DrillLevel, FirestoreDrill } from '../models/drill.model';

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
