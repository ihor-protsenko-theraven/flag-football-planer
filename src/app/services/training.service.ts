import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Training, TrainingDrill } from '../models/training.model';
import mockTrainings from '../../assets/data/mock-trainings.json';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private trainings: Training[] = mockTrainings.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt)
    })) as Training[];

    private trainingsSubject = new BehaviorSubject<Training[]>(this.trainings);
    public trainings$ = this.trainingsSubject.asObservable();

    constructor() { }

    getTrainings(): Observable<Training[]> {
        return of(this.trainings);
    }

    getTrainingById(id: string): Observable<Training | undefined> {
        const training = this.trainings.find(t => t.id === id);
        return of(training);
    }

    createTraining(training: Omit<Training, 'id' | 'createdAt'>): Observable<Training> {
        const newTraining: Training = {
            ...training,
            id: `training_${Date.now()}`,
            createdAt: new Date(),
            totalDuration: this.calculateTotalDuration(training.drills)
        };

        this.trainings.push(newTraining);
        this.trainingsSubject.next(this.trainings);

        return of(newTraining);
    }

    updateTraining(id: string, updates: Partial<Training>): Observable<Training | null> {
        const index = this.trainings.findIndex(t => t.id === id);

        if (index === -1) {
            return of(null);
        }

        const updatedTraining: Training = {
            ...this.trainings[index],
            ...updates,
            totalDuration: updates.drills
                ? this.calculateTotalDuration(updates.drills)
                : this.trainings[index].totalDuration
        };

        this.trainings[index] = updatedTraining;
        this.trainingsSubject.next(this.trainings);

        return of(updatedTraining);
    }

    deleteTraining(id: string): Observable<boolean> {
        const index = this.trainings.findIndex(t => t.id === id);

        if (index === -1) {
            return of(false);
        }

        this.trainings.splice(index, 1);
        this.trainingsSubject.next(this.trainings);

        return of(true);
    }

    private calculateTotalDuration(drills: TrainingDrill[]): number {
        return drills.reduce((total, drill) => total + drill.duration, 0);
    }
}
