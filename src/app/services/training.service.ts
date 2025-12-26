import {inject, Injectable} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, from, map, Observable, of} from 'rxjs';
import {TrainingDbService} from './training-db.service';
import {TrainingPlan} from '../models/training-plan.interface';
import {Training, TrainingDrill} from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private readonly trainingDb = inject(TrainingDbService);

  /**
   * Observable of all training plans from Firestore, mapped to the app's Training model.
   */
  public readonly trainings$ = this.trainingDb.getAllPlans().pipe(
    map(plans => plans.map(plan => ({
      ...plan,
      createdAt: new Date(plan.createdAt)
    } as Training)))
  );

  /**
   * Signal representing the current list of training plans.
   */
  public readonly trainings = toSignal(this.trainings$, {initialValue: [] as Training[]});

  constructor() {
  }

  getTrainings(): Observable<Training[]> {
    return this.trainings$;
  }

  getTrainingById(id: string): Observable<Training | undefined> {
    return this.trainings$.pipe(
      map(trainings => trainings.find(t => t.id === id))
    );
  }

  createTraining(training: Omit<Training, 'id' | 'createdAt'>): Observable<void> {
    const newPlan: Omit<TrainingPlan, 'id'> = {
      ...training,
      createdBy: training.createdBy || 'coach_default',
      createdAt: new Date().toISOString()
    };

    return from(this.trainingDb.saveNewPlan(newPlan)).pipe(
      map(() => void 0)
    );
  }

  updateTraining(id: string, updates: Partial<Training>): Observable<Training | null> {
    // Implementation for update if needed
    return of(null);
  }

  deleteTraining(id: string): Observable<boolean> {
    return from(this.trainingDb.deletePlan(id)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private calculateTotalDuration(drills: TrainingDrill[]): number {
    return drills.reduce((total, drill) => total + drill.duration, 0);
  }
}
