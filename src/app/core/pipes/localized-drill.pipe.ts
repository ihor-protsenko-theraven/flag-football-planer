import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Drill, DrillTranslation, FirestoreDrill } from '../../models/drill.model';

/**
 * LocalizedDrillPipe - Centralized DRY logic for accessing drill translations
 * 
 * This pipe takes a FirestoreDrill object and returns the DrillTranslation
 * for the current active language with proper fallback logic:
 * 1. Try current language (uk/en)
 * 2. Fallback to English ('en')
 * 3. Fallback to safe defaults
 * 
 * Usage in templates:
 * {{ (drill | localizedDrill)?.name }}
 * {{ (drill | localizedDrill)?.description }}
 * 
 * @example
 * <h1>{{ (drill | localizedDrill)?.name }}</h1>
 * <p>{{ (drill | localizedDrill)?.description }}</p>
 * 
 * @for (step of (drill | localizedDrill)?.instructions; track $index) {
 *   <li>{{ step }}</li>
 * }
 */
@Pipe({
  name: 'localizedDrill',
  standalone: true,
  pure: false // Impure to react to language changes from TranslateService
})
export class LocalizedDrillPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(drill: Drill | FirestoreDrill | null | undefined): DrillTranslation | Drill | null {
    if (!drill) {
      return null;
    }

    // Type guard: if drill has 'translations' property, it's FirestoreDrill
    if ('translations' in drill && drill.translations) {
      const firestoreDrill = drill as FirestoreDrill;
      const currentLang = this.translate.currentLang || 'en';
      const safeLang = (currentLang === 'uk' || currentLang === 'en') ? currentLang : 'en';

      // Fallback chain: current lang → 'en' → safe defaults
      const translation = firestoreDrill.translations[safeLang] || firestoreDrill.translations['en'];

      if (translation) {
        return translation;
      }

      // Ultimate fallback if no translations exist
      return {
        name: 'Unknown Drill',
        description: '',
        instructions: [],
        coachingTips: [],
        equipment: []
      };
    }

    // If it's already a flattened Drill, return as-is
    return drill as Drill;
  }
}
