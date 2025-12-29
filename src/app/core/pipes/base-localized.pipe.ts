import { inject, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export abstract class BaseLocalizedPipe<T extends { translations: Record<string, any> }, R> implements PipeTransform {
    protected translate = inject(TranslateService);

    abstract getDefault(): R;

    transform(item: T | R | null | undefined): R | null {
        if (!item) return null;

        // Type guard: check if it has translations (Firestore model)
        if (typeof item === 'object' && 'translations' in item && item.translations) {
            const currentLang = this.translate.currentLang || 'en';
            const safeLang = (currentLang === 'uk' || currentLang === 'en') ? currentLang : 'en';

            const translation = item.translations[safeLang] || item.translations['en'];
            return (translation as R) || this.getDefault();
        }

        // It's already flattened
        return item as R;
    }
}
