import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestorePlays, Play, PlayCategory, PlayComplexity } from '../../models/plays.model'; // Перевір шлях до моделі
import { TranslateService } from '@ngx-translate/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlaysService {
  private firestore = inject(Firestore);
  private translate = inject(TranslateService);
  private collectionName = 'plays';

  getCombinationsStream(): Observable<Play[]> {
    const col = collection(this.firestore, this.collectionName);
    const q = query(col, orderBy('createdAt', 'desc'));

    return new Observable<Play[]>(subscriber => {
      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const rawData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as FirestorePlays));

        const flattenedData = this.flattenCombinations(rawData);
        subscriber.next(flattenedData);
      }, (error) => {
        subscriber.error(error);
      });

      return () => unsubscribe();
    });
  }

  getCombinationById(id: string): Observable<Play | undefined> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return new Observable<Play | undefined>(subscriber => {
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as FirestorePlays;
          const flattened = this.flattenCombinations([data]);
          subscriber.next(flattened[0]);
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
    const col = collection(this.firestore, this.collectionName);
    const q = query(col, orderBy('createdAt', 'desc'));

    return new Observable<FirestorePlays[]>(subscriber => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as FirestorePlays));
        subscriber.next(data);
      }, (error) => subscriber.error(error));
      return () => unsubscribe();
    });
  }

  getRawPlayById(id: string): Observable<FirestorePlays | undefined> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return new Observable<FirestorePlays | undefined>(subscriber => {
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          subscriber.next({ id: docSnap.id, ...docSnap.data() } as FirestorePlays);
        } else {
          subscriber.next(undefined);
        }
      }, (error) => {
        subscriber.error(error);
      });
      return () => unsubscribe();
    });
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

  private flattenCombinations(items: FirestorePlays[]): Play[] {
    const lang = this.translate.currentLang === 'uk' ? 'uk' : 'en';
    return items.map(item => {

      const t = item.translations?.[lang] || item.translations?.['en'] || {
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
        name: t.name,
        description: t.description,
        keyPoints: t.keyPoints,
        videoUrl: item.videoUrl
      };
    });
  }
}

