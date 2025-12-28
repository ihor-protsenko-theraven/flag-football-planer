import { computed, Injectable, signal } from '@angular/core';
import { Drill } from '../models/drill.model';
import { BuilderDrill } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingBuilderService {
  private _trainingDrills = signal<BuilderDrill[]>([]);
  public trainingDrills = computed(() => this._trainingDrills());

  // Automatically calculates total duration from all drill instances
  public totalDuration = computed(() =>
    this._trainingDrills().reduce((sum, drill) => sum + drill.duration, 0)
  );

  /**
   * Adds a drill to the training as a new instance.
   * The same drill can be added multiple times with different durations.
   */
  addDrill(drill: Drill): boolean {
    const currentDrills = this._trainingDrills();

    const newBuilderDrill: BuilderDrill = {
      instanceId: this.generateInstanceId(),  // Unique ID for this instance
      drillId: drill.id,
      duration: drill.duration,  // Start with catalog default, can be modified
      order: currentDrills.length,
      drill: drill  // Keep reference for UI display
    };

    this._trainingDrills.update(drills => [...drills, newBuilderDrill]);

    return true;
  }

  /**
   * Updates the duration of a specific drill instance.
   * This triggers automatic recalculation of totalDuration via computed signal.
   */
  updateDrillDuration(index: number, newDuration: number): void {
    this._trainingDrills.update(drills => {
      const updated = [...drills];
      if (updated[index]) {
        updated[index] = { ...updated[index], duration: newDuration };
      }
      return updated;
    });
  }

  removeDrill(index: number): void {
    this._trainingDrills.update(drills => {
      const newDrills = drills.filter((_, i) => i !== index);
      return newDrills.map((drill, idx) => ({ ...drill, order: idx }));
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

      return newDrills.map((drill, index) => ({ ...drill, order: index }));
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

  /**
   * Generates a unique instance ID for drill instances.
   * Format: timestamp + random string
   */
  private generateInstanceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
