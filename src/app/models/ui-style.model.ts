import { DrillCategory, DrillLevel } from './drill.model';

export interface UiStyleConfig {
  style: string;
  icon: string;
}


export const CATEGORY_UI_CONFIG: Record<DrillCategory, UiStyleConfig> = {
  passing: {
    style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: '<ellipse cx="12" cy="12" rx="9" ry="5" stroke="currentColor" stroke-width="2" fill="none"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>'
  },
  defense: {
    style: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: '<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  offense: {
    style: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    icon: '<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  conditioning: {
    style: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
    icon: '<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7.636V4m0 16.364V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  warmup: {
    style: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    icon: '<path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  flag_pulling: {
    style: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
    icon: '<path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  }
};

export const LEVEL_UI_CONFIG: Record<DrillLevel, UiStyleConfig> = {
  beginner: {
    style: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    icon: `<path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5-6.5-4.5-6.5 4.5 2.5-7.5-6-4.5h7.5L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
  },
  intermediate: {
    style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: '<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  advanced: {
    style: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    icon: '<path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  }
};
