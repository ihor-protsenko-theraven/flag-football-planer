import {inject, Injectable} from '@angular/core';
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
import {Observable} from 'rxjs';
import {FirestoreDrill} from '../../models/drill.model';

@Injectable({
  providedIn: 'root'
})
export class DrillAdminService {
  private firestore = inject(Firestore);

  /**
   * Listen to real-time updates of all drills
   */
  getDrillsStream(): Observable<FirestoreDrill[]> {
    return new Observable<FirestoreDrill[]>(subscriber => {
      const col = collection(this.firestore, 'drills');
      const q = query(col, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as FirestoreDrill));
        subscriber.next(data);
      }, (error) => {
        subscriber.error(error);
      });

      return () => unsubscribe();
    });
  }

  /**
   * Add a new drill to Firestore
   */
  async addDrill(drill: Omit<FirestoreDrill, 'id'>): Promise<string> {
    const col = collection(this.firestore, 'drills');
    const docRef = await addDoc(col, {
      ...drill,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }

  /**
   * Update an existing drill
   */
  async updateDrill(id: string, drill: Partial<FirestoreDrill>): Promise<void> {
    const drillRef = doc(this.firestore, `drills/${id}`);
    return updateDoc(drillRef, {
      ...drill,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Delete a drill
   */
  async deleteDrill(id: string): Promise<void> {
    const drillRef = doc(this.firestore, `drills/${id}`);
    return deleteDoc(drillRef);
  }

  getDrillById(id: string): Promise<FirestoreDrill | undefined> {
    return new Promise((resolve, reject) => {
      // 1. Створюємо посилання так само, як ти робив для колекції
      const docRef = doc(this.firestore, 'drills', id);

      console.log(`📡 Fetching via Snapshot strategy: ${id}`);

      // 2. Відкриваємо підписку (точно так, як у getDrillsStream)
      const unsubscribe = onSnapshot(docRef,
        (docSnap) => {
          // Як тільки прийшли дані:
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('✅ Data received:', data);

            resolve({
              id: docSnap.id,
              ...data
            } as FirestoreDrill);
          } else {
            console.warn('⚠️ Document does not exist');
            resolve(undefined);
          }

          // 3. ВАЖЛИВО: Одразу відписуємось, щоб це працювало як "одноразовий запит"
          unsubscribe();
        },
        (error) => {
          console.error('❌ Snapshot error:', error);
          reject(error);
          // У разі помилки теж варто відписатись, хоча onSnapshot зазвичай сам закривається при фатальній помилці
          unsubscribe();
        }
      );
    });
  }
}
