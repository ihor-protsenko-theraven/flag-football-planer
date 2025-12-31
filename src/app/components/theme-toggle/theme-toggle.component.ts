import {Component, inject} from '@angular/core';
import {Theme, ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="cycleTheme()"
      class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50"
      [title]="'Current theme: ' + theme() + '. Click to change.'"
    >
      @switch (theme()) {
        @case ('light') {
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M6.364 6.364l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
        }
        @case ('dark') {
          <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        }
        @case ('system') {
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        }
      }
    </button>
  `
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  theme = this.themeService.theme;

  cycleTheme(): void {
    const nextMap: Record<Theme, Theme> = {
      'light': 'dark',
      'dark': 'system',
      'system': 'light'
    };
    this.themeService.setTheme(nextMap[this.theme()]);
  }
}
