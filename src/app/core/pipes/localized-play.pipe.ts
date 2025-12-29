import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Play, PlayTranslation, FirestorePlays } from '../../models/plays.model';

/**
 * LocalizedPlayPipe - Centralized DRY logic for accessing play translations
 * 
 * This pipe takes a FirestorePlays object and returns the PlayTranslation
 * for the current active language with proper fallback logic:
 * 1. Try current language (uk/en)
 * 2. Fallback to English ('en')
 * 3. Fallback to safe defaults
 * 
 * Usage in templates:
 * {{ (play | localizedPlay)?.name }}
 * {{ (play | localizedPlay)?.description }}
 */
@Pipe({
    name: 'localizedPlay',
    standalone: true,
    pure: false // Impure to react to language changes from TranslateService
})
export class LocalizedPlayPipe implements PipeTransform {
    private readonly translate = inject(TranslateService);

    transform(play: Play | FirestorePlays | null | undefined): PlayTranslation | Play | null {
        if (!play) {
            return null;
        }

        // Type guard: if play has 'translations' property, it's FirestorePlays
        if ('translations' in play && play.translations) {
            const firestorePlay = play as FirestorePlays;
            const currentLang = this.translate.currentLang || 'en';
            const safeLang = (currentLang === 'uk' || currentLang === 'en') ? currentLang : 'en';

            // Fallback chain: current lang → 'en' → safe defaults
            const translation = firestorePlay.translations[safeLang] || firestorePlay.translations['en'];

            if (translation) {
                return translation;
            }

            // Ultimate fallback if no translations exist
            return {
                name: 'Unknown Play',
                description: '',
                keyPoints: []
            };
        }

        // If it's already a flattened Play, return as-is
        return play as Play;
    }
}
