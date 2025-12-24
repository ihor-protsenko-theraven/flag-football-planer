import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrillCategory, DrillLevel } from '../models/drill.model';

export interface UiStyleConfig {
    style: string;
    icon: string;
}

export const CATEGORY_UI_CONFIG: Record<DrillCategory, UiStyleConfig> = {
    passing: {
        style: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: '<path d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.829 2.829a2.5 2.5 0 01-3.535 0L2.828 2.828a2.5 2.5 0 010-3.535l2.829-2.829a2.5 2.5 0 013.535 0L12 12m0 0l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    defense: {
        style: 'bg-red-50 text-red-700 border-red-200',
        icon: '<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    offense: {
        style: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: '<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    conditioning: {
        style: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: '<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7.636V4m0 16.364V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    warmup: {
        style: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: '<path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    flag_pulling: {
        style: 'bg-pink-50 text-pink-700 border-pink-200',
        icon: '<path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    }
};

export const LEVEL_UI_CONFIG: Record<DrillLevel, UiStyleConfig> = {
    beginner: {
        style: 'bg-green-50 text-green-700 border-green-200',
        icon: '<path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    intermediate: {
        style: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: '<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    advanced: {
        style: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: '<path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    }
};

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
