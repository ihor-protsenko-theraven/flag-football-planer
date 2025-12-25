import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrillCategory, DrillLevel } from '../models/drill.model';
import {CATEGORY_UI_CONFIG, LEVEL_UI_CONFIG} from '../models/ui-style.model';

@Injectable({
    providedIn: 'root'
})
export class DrillUiService {
    private readonly sanitizer = inject(DomSanitizer);

    getCategoryStyle(category: DrillCategory | null | undefined): string {
        if (!category) return 'bg-gray-100 text-gray-700 border-gray-200';
        return CATEGORY_UI_CONFIG[category]?.style || 'bg-gray-100 text-gray-700 border-gray-200';
    }

    getCategoryIcon(category: DrillCategory | null | undefined): SafeHtml {
        const icon = category ? CATEGORY_UI_CONFIG[category]?.icon : null;
        const path = icon || '<path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        return this.sanitizer.bypassSecurityTrustHtml(`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">${path}</svg>`);
    }

    getLevelStyle(level: DrillLevel | null | undefined): string {
        if (!level) return 'bg-gray-100 text-gray-700 border-gray-200';
        return LEVEL_UI_CONFIG[level]?.style || 'bg-gray-100 text-gray-700 border-gray-200';
    }

    getLevelIcon(level: DrillLevel | null | undefined): SafeHtml {
        const icon = level ? LEVEL_UI_CONFIG[level]?.icon : null;
        const path = icon || '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        return this.sanitizer.bypassSecurityTrustHtml(`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">${path}</svg>`);
    }
}
