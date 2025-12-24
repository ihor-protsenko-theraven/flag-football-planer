import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {DrillService} from '../../services/drill.service';
import {Drill, DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, DrillLevel} from '../../models/drill.model';
import {DrillCardComponent} from '../../components/drill-card/drill-card.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-drill-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DrillCardComponent, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            {{ 'CATALOG.TITLE' | translate }}
          </h1>
          <p class="text-gray-600 text-lg">
            {{ 'CATALOG.SUBTITLE' | translate }}
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div class="relative group">
              <label class="block text-sm font-bold text-gray-700 mb-2">
                {{ 'CATALOG.SEARCH_LABEL' | translate }}
              </label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onFilterChange()"
                  [placeholder]="'CATALOG.SEARCH_PLACEHOLDER' | translate"
                  class="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
                @if (searchQuery()) {
                  <button (click)="clearSearch()"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                {{ 'CATALOG.CATEGORY_LABEL' | translate }}
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="selectedCategory"
                  (ngModelChange)="onFilterChange()"
                  class="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none transition-all outline-none"
                >
                  <option [ngValue]="null">{{ 'CATALOG.ALL_CATEGORIES' | translate }}</option>
                  @for (cat of categories; track cat.value) {
                    <option [value]="cat.value">{{ cat.translationKey | translate }}</option>
                  }
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                {{ 'CATALOG.LEVEL_LABEL' | translate }}
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="selectedLevel"
                  (ngModelChange)="onFilterChange()"
                  class="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer appearance-none transition-all outline-none"
                >
                  <option [ngValue]="null">{{ 'CATALOG.ALL_LEVELS' | translate }}</option>
                  @for (level of levels; track level.value) {
                    <option [value]="level.value">{{ level.translationKey | translate }}</option>
                  }
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          @if (hasActiveFilters()) {
            <div class="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 animate-fade-in">

              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
                {{ 'CATALOG.ACTIVE_FILTERS' | translate }}
              </span>

              @if (searchQuery()) {
                <div
                  class="group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 transition-all hover:bg-slate-200">
                  <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  "{{ searchQuery() }}"
                  <button (click)="clearSearch()"
                          class="ml-2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-300 transition-colors">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              }

              @if (selectedCategory()) {
                <div
                  class="group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                  [ngClass]="getCategoryColorClass(selectedCategory())">

                  <span class="mr-2 flex items-center" [innerHTML]="getCategoryIcon(selectedCategory())"></span>

                  {{ getCategoryLabel() }}

                  <button (click)="clearCategory()"
                          class="ml-2 p-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-black/10 transition-all">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              }

              @if (selectedLevel()) {
                <div
                  class="group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                  [ngClass]="getLevelColorClass(selectedLevel())">

                  <span class="mr-2 flex items-center" [innerHTML]="getLevelIcon(selectedLevel())"></span>

                  {{ getLevelLabel() }}

                  <button (click)="clearLevel()"
                          class="ml-2 p-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-black/10 transition-all">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              }

              <button
                (click)="clearAllFilters()"
                class="ml-auto text-sm text-gray-500 hover:text-red-600 font-medium transition-colors hover:underline flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                {{ 'CATALOG.CLEAR_ALL' | translate }}
              </button>
            </div>
          }
        </div>

        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            {{ 'CATALOG.RESULTS_TITLE' | translate }}
            <span
              class="ml-1 px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold border border-blue-200">
              {{ filteredDrills().length }}
            </span>
          </h2>
        </div>

        @if (filteredDrills().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            @for (drill of filteredDrills(); track drill.id) {
              <app-drill-card [drill]="drill" (cardClick)="onDrillClick($event)"/>
            }
          </div>
        } @else {
          <div class="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ 'CATALOG.NO_RESULTS_TITLE' | translate }}</h3>
            <p class="text-gray-500 mb-6">{{ 'CATALOG.NO_RESULTS_DESC' | translate }}</p>
            <button (click)="clearAllFilters()"
                    class="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm">
              {{ 'CATALOG.CLEAR_FILTERS_BTN' | translate }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class DrillCatalogComponent implements OnInit {
  private readonly drillService = inject(DrillService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly sanitizer = inject(DomSanitizer); // Для безпечного рендеру SVG

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  drills = signal<Drill[]>([]);
  filteredDrills = signal<Drill[]>([]);

  searchQuery = signal<string>('');
  selectedCategory = signal<DrillCategory | null>(null);
  selectedLevel = signal<DrillLevel | null>(null);

  hasActiveFilters = computed(() => {
    return !!(this.searchQuery().trim() || this.selectedCategory() || this.selectedLevel());
  });

  ngOnInit(): void {
    this.loadDrills();
  }

  private loadDrills(): void {
    this.drillService.getDrills().subscribe(drills => {
      this.drills.set(drills);
      this.applyFilters();
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchQuery().trim() || undefined;
    const cat = this.selectedCategory() || undefined;
    const lvl = this.selectedLevel() || undefined;

    this.drillService.filterAndSearchDrills(term, cat, lvl).subscribe(filtered => {
      this.filteredDrills.set(filtered);
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.applyFilters();
  }

  clearCategory(): void {
    this.selectedCategory.set(null);
    this.applyFilters();
  }

  clearLevel(): void {
    this.selectedLevel.set(null);
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedLevel.set(null);
    this.applyFilters();
  }

  getCategoryLabel(): string {
    const catValue = this.selectedCategory();
    if (!catValue) return '';
    const category = this.categories.find(c => c.value === catValue);
    return category ? this.translate.instant(category.translationKey) : catValue;
  }

  getLevelLabel(): string {
    const lvlValue = this.selectedLevel();
    if (!lvlValue) return '';
    const level = this.levels.find(l => l.value === lvlValue);
    return level ? this.translate.instant(level.translationKey) : lvlValue;
  }

  onDrillClick(drill: Drill): void {
    this.router.navigate(['/catalog', drill.id]);
  }

  getCategoryColorClass(category: DrillCategory | null): string {
    switch (category) {
      case 'passing':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'defense':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      case 'offense':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'conditioning':
        return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100';
      case 'warmup':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      case 'flag_pulling':
        return 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  getCategoryIcon(category: DrillCategory | null): SafeHtml {
    let path = '';
    switch (category) {
      case 'passing': // Football shape
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.829 2.829a2.5 2.5 0 01-3.535 0L2.828 2.828a2.5 2.5 0 010-3.535l2.829-2.829a2.5 2.5 0 013.535 0L12 12m0 0l7 7" /> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /> <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M8 12h8"/><path d="M12 8v8"/>`;
        break;
      case 'defense': // Shield
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`;
        break;
      case 'offense': // Lightning
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`;
        break;
      case 'conditioning': // Heart/Pulse
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.636V4m0 16.364V20" />`;
        break;
      case 'warmup': // Flame
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />`;
        break;
      case 'flag_pulling': // Hand
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />`;
        break;
      default:
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">${path}</svg>`);
  }

  getLevelColorClass(level: DrillLevel | null): string {
    switch (level) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getLevelIcon(level: DrillLevel | null): SafeHtml {
    let path = '';
    switch (level) {
      case 'beginner': // Seed/Sprout
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />`; // Simple arrow/sprout
        break;
      case 'intermediate': // Chart Up
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />`;
        break;
      case 'advanced': // Trophy/Crown
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`; // Checked circle for now, or Star
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />`; // Star
        break;
      default:
        path = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(`<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">${path}</svg>`);
  }
}
