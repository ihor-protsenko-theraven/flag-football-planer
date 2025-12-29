import { Pipe, PipeTransform } from '@angular/core';
import { Drill, DrillTranslation, FirestoreDrill } from '../../models/drill.model';
import { BaseLocalizedPipe } from './base-localized.pipe';

@Pipe({
  name: 'localizedDrill',
  standalone: true,
  pure: false
})
export class LocalizedDrillPipe extends BaseLocalizedPipe<FirestoreDrill, DrillTranslation | Drill> implements PipeTransform {
  getDefault(): DrillTranslation {
    return {
      name: 'Unknown Drill',
      description: '',
      instructions: [],
      coachingTips: [],
      equipment: []
    };
  }
}
