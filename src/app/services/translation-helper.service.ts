import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DrillCategory, DrillLevel, DRILL_CATEGORIES, DRILL_LEVELS } from '../models/drill.model';

@Injectable({
    providedIn: 'root'
})
export class TranslationHelperService {
    constructor(private translate: TranslateService) { }

    getCategoryLabel(category: DrillCategory): string {
        const cat = DRILL_CATEGORIES.find(c => c.value === category);
        return cat ? this.translate.instant(cat.translationKey) : category;
    }

    getLevelLabel(level: DrillLevel): string {
        const lvl = DRILL_LEVELS.find(l => l.value === level);
        return lvl ? this.translate.instant(lvl.translationKey) : level;
    }

    getCategoriesForSelect(): { value: DrillCategory; label: string }[] {
        return DRILL_CATEGORIES.map(cat => ({
            value: cat.value,
            label: this.translate.instant(cat.translationKey)
        }));
    }

    getLevelsForSelect(): { value: DrillLevel; label: string }[] {
        return DRILL_LEVELS.map(lvl => ({
            value: lvl.value,
            label: this.translate.instant(lvl.translationKey)
        }));
    }
}
