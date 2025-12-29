import { inject, Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { FirestoreDrill } from '../../models/drill.model';

@Injectable({
  providedIn: 'root'
})
export class DrillAdminService {
  private readonly firestore = inject(Firestore);

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

  async addDrill(drill: Omit<FirestoreDrill, 'id'>): Promise<string> {
    const col = collection(this.firestore, 'drills');
    const docRef = await addDoc(col, {
      ...drill,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async updateDrill(id: string, drill: Partial<FirestoreDrill>): Promise<void> {
    const drillRef = doc(this.firestore, `drills/${id}`);
    return updateDoc(drillRef, {
      ...drill,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteDrill(id: string): Promise<void> {
    const drillRef = doc(this.firestore, `drills/${id}`);
    return deleteDoc(drillRef);
  }

  getDrillById(id: string): Observable<FirestoreDrill | undefined> {
    const drillRef = doc(this.firestore, `drills/${id}`);
    return new Observable<FirestoreDrill | undefined>(subscriber => {
      const unsubscribe = onSnapshot(drillRef, (docSnap) => {
        if (docSnap.exists()) {
          subscriber.next({ id: docSnap.id, ...docSnap.data() } as FirestoreDrill);
        } else {
          subscriber.next(undefined);
        }
      }, (error) => {
        subscriber.error(error);
      });
      return () => unsubscribe();
    });
  }

}
