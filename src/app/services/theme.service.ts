import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'ffp-theme';

    // Theme state signal
    theme = signal<Theme>(this.getStoredTheme());

    constructor() {
        // Effect to apply theme changes to DOM and localStorage
        effect(() => {
            const currentTheme = this.theme();
            this.applyTheme(currentTheme);
            localStorage.setItem(this.STORAGE_KEY, currentTheme);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.theme() === 'system') {
                this.applyTheme('system');
            }
        });
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme);
    }

    private getStoredTheme(): Theme {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return (stored as Theme) || 'system';
    }

    private applyTheme(theme: Theme): void {
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}
