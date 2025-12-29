import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ThemeToggleComponent],
  template: `
    <nav
      class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300 safe-pt">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between min-h-[4rem] py-2">
          <!-- Logo -->
          <div class="flex items-center space-x-3 group cursor-pointer" routerLink="/">
            <div class="relative w-10 h-10 flex items-center justify-center">
              <div
                class="absolute inset-0 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-green-500/30"></div>
              <div
                class="absolute inset-0 bg-white rounded-xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-20"></div>
              <span
                class="relative text-white text-xl transform group-hover:scale-110 transition-transform duration-300">🏈</span>
            </div>
            <div>
              <h1
                class="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-none">{{ 'NAV.TITLE' | translate }}</h1>
              <p
                class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">{{ 'NAV.PRO_EDITION' | translate }}</p>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <a
              routerLink="/catalog"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm ring-1 ring-green-500/20"
              [routerLinkActiveOptions]="{exact: false}"
              class="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              {{ 'NAV.DRILL_CATALOG' | translate }}
            </a>
            <a
              routerLink="/plays"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm ring-1 ring-green-500/20"
              [routerLinkActiveOptions]="{exact: false}"
              class="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              {{ 'NAV.PLAYS' | translate }}
            </a>
            <a
              routerLink="/builder"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm ring-1 ring-green-500/20"
              [routerLinkActiveOptions]="{exact: false}"
              class="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              {{ 'NAV.TRAINING_BUILDER' | translate }}
            </a>
            <a
              routerLink="/trainings"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-sm ring-1 ring-green-500/20"
              [routerLinkActiveOptions]="{exact: false}"
              class="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              {{ 'NAV.MY_TRAININGS' | translate }}
            </a>
          </div>

          <!-- Language Switcher -->
          <div class="hidden md:flex items-center space-x-2 ml-4">
            <button
              (click)="switchLanguage('uk')"
              [class]="getLangButtonClass('uk')"
            >
              UK
            </button>
            <span class="text-slate-300 dark:text-slate-700">|</span>
            <button
              (click)="switchLanguage('en')"
              [class]="getLangButtonClass('en')"
            >
              EN
            </button>
          </div>

          <!-- Theme Toggle -->
          <div class="hidden md:flex items-center ml-4">
            <app-theme-toggle></app-theme-toggle>
          </div>

          <!-- Mobile Menu Button -->
          <button
            (click)="toggleMobileMenu()"
            class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            @if (!mobileMenuOpen()) {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            } @else {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            }
          </button>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div
            class="md:hidden py-4 space-y-2 border-t border-slate-100 dark:border-slate-800 animate-slide-down safe-pb">
            <a
              routerLink="/catalog"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
              (click)="closeMobileMenu()"
              class="block px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {{ 'NAV.DRILL_CATALOG' | translate }}
            </a>
            <a
              routerLink="/plays"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
              (click)="closeMobileMenu()"
              class="block px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {{ 'NAV.PLAYS' | translate }}
            </a>
            <a
              routerLink="/builder"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
              (click)="closeMobileMenu()"
              class="block px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {{ 'NAV.TRAINING_BUILDER' | translate }}
            </a>
            <a
              routerLink="/trainings"
              routerLinkActive="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
              (click)="closeMobileMenu()"
              class="block px-4 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {{ 'NAV.MY_TRAININGS' | translate }}
            </a>

            <!-- Mobile Language Switcher -->
            <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-4">
              <button
                (click)="switchLanguage('uk')"
                [class]="getLangButtonClass('uk')"
              >
                Українська
              </button>

              <button
                (click)="switchLanguage('en')"
                [class]="getLangButtonClass('en')"
              >
                English
              </button>

            </div>

            <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <p
                class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{{ 'NAV.THEME' | translate }}</p>
              <app-theme-toggle></app-theme-toggle>
            </div>
          </div>
        }
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  private readonly translate = inject(TranslateService);

  mobileMenuOpen = signal(false);
  currentLang = signal(
    this.translate.currentLang || this.translate.defaultLang || 'uk'
  );

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  getLangButtonClass(lang: string): string {
    const isActive = this.currentLang() === lang;
    const baseClass = 'px-3 py-1.5 rounded-lg text-sm transition-all';

    if (isActive) {
      return `${baseClass} font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/30`;
    }
    return `${baseClass} font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800`;
  }
}
