import {computed, Injectable, signal} from '@angular/core';
import {Drill} from '../models/drill.model';
import {BuilderDrill} from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingBuilderService {
  private _trainingDrills = signal<BuilderDrill[]>([]);
  public trainingDrills = computed(() => this._trainingDrills());
  public totalDuration = computed(() =>
    this._trainingDrills().reduce((sum, drill) => sum + drill.duration, 0)
  );


  addDrill(drill: Drill): boolean {
    const currentDrills = this._trainingDrills();
    const isDuplicate = currentDrills.some(builderDrill => builderDrill.drillId === drill.id);

    if (isDuplicate) {
      return false;
    }

    const newBuilderDrill: BuilderDrill = {
      drillId: drill.id,
      duration: drill.duration,
      order: currentDrills.length,
      drill: drill
    };

    this._trainingDrills.update(drills => [...drills, newBuilderDrill]);

    return true;
  }

  removeDrill(index: number): void {
    this._trainingDrills.update(drills => {
      const newDrills = drills.filter((_, i) => i !== index);
      return newDrills.map((drill, idx) => ({...drill, order: idx}));
    });
  }

  clearAllDrills(): void {
    this._trainingDrills.set([]);
  }

  reorderDrills(previousIndex: number, currentIndex: number): void {
    this._trainingDrills.update(drills => {
      const newDrills = [...drills];
      const [movedDrill] = newDrills.splice(previousIndex, 1);
      newDrills.splice(currentIndex, 0, movedDrill);

      return newDrills.map((drill, index) => ({...drill, order: index}));
    });
  }

  isDrillInTraining(drillId: string): boolean {
    return this._trainingDrills().some(drill => drill.drillId === drillId);
  }

  getTrainingDrills(): BuilderDrill[] {
    return this._trainingDrills();
  }

  setTrainingDrills(drills: BuilderDrill[]): void {
    this._trainingDrills.set(drills);
  }
}
