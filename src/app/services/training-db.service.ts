import {inject, Injectable} from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  setDoc
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {TrainingPlan} from '../models/training-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainingDbService {
  private firestore: Firestore = inject(Firestore);
  private collectionName = 'training-plans';

  getAllPlans(): Observable<TrainingPlan[]> {
    const plansCollection = collection(this.firestore, this.collectionName);
    const plansQuery = query(plansCollection, orderBy('createdAt', 'desc'));

    return new Observable<TrainingPlan[]>(subscriber => {
      const unsubscribe = onSnapshot(plansQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const plans = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as TrainingPlan));
        subscriber.next(plans);
      }, (error) => {
        subscriber.error(error);
      });

      return () => unsubscribe();
    });
  }

  saveNewPlan(plan: Omit<TrainingPlan, 'id'>): Promise<void> {
    const plansCollection = collection(this.firestore, this.collectionName);

    // Генеруємо ID для нового документа
    const newDocRef = doc(plansCollection);

    // Зберігаємо ID всередину об'єкта (якщо це потрібно для твоєї логіки)
    const planWithId = {...plan, id: newDocRef.id};

    // Використовуємо setDoc для запису по конкретному посиланню
    return setDoc(newDocRef, planWithId);
  }

  deletePlan(planId: string): Promise<void> {
    const planDocRef = doc(this.firestore, `${this.collectionName}/${planId}`);
    return deleteDoc(planDocRef);
  }
}
