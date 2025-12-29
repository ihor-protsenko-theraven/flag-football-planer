import { Pipe, PipeTransform } from '@angular/core';
import { Play, PlayTranslation, FirestorePlays } from '../../models/plays.model';
import { BaseLocalizedPipe } from './base-localized.pipe';

@Pipe({
    name: 'localizedPlay',
    standalone: true,
    pure: false
})
export class LocalizedPlayPipe extends BaseLocalizedPipe<FirestorePlays, PlayTranslation | Play> implements PipeTransform {
    getDefault(): PlayTranslation {
        return {
            name: 'Unknown Play',
            description: '',
            keyPoints: []
        };
    }
}
