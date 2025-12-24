import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SafeHtml} from '@angular/platform-browser';

import {DrillService} from '../../services/drill.service';
import {DrillUiService} from '../../services/drill-ui.service';
import {Drill, DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, DrillLevel} from '../../models/drill.model';
import {DrillCardComponent} from '../../components/drill-card/drill-card.component';
import {SkeletonCardComponent} from '../../components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-drill-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DrillCardComponent, SkeletonCardComponent, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              {{ 'CATALOG.TITLE' | translate }}
            </h1>
            <p class="text-gray-600 text-lg">
              {{ 'CATALOG.SUBTITLE' | translate }}
            </p>
          </div>

          <button
            (click)="toggleFilters()"
            class="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-xl shadow-sm active:scale-95 transition-all"
          >
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            {{ 'CATALOG.FILTERS' | translate }}

            @if (activeFiltersCount() > 0) {
              <span class="ml-2 bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {{ activeFiltersCount() }}
              </span>
            }

            <svg class="w-5 h-5 ml-auto transition-transform duration-200 text-gray-400"
                 [class.rotate-180]="isFiltersOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <div
          class="md:block bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden transition-all duration-300 ease-in-out mb-8"
          [class.hidden]="!isFiltersOpen()"
          [class.block]="isFiltersOpen()"
        >
          <div class="p-4 md:p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div class="relative group">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {{ 'CATALOG.SEARCH_LABEL' | translate }}
                </label>
                <div class="relative">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="onFilterChange()"
                    [placeholder]="'CATALOG.SEARCH_PLACEHOLDER' | translate"
                    class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  @if (searchQuery()) {
                    <button (click)="clearSearch()"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 p-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  }
                </div>
              </div>

              <div class="hidden md:block">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {{ 'CATALOG.CATEGORY_LABEL' | translate }}
                </label>
                <div class="relative">
                  <select
                    [(ngModel)]="selectedCategory"
                    (ngModelChange)="onFilterChange()"
                    class="w-full py-3 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer">
                    <option [ngValue]="null" class="text-gray-500">{{ 'CATALOG.ALL_CATEGORIES' | translate }}</option>
                    @for (cat of categories; track cat.value) {
                      <option [value]="cat.value">{{ cat.translationKey | translate }}</option>
                    }
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="md:hidden">
                <button (click)="toggleAccordion('category')"
                        class="w-full flex items-center justify-between py-2 focus:outline-none group">
                  <div class="text-left">
                    <p
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{{ 'CATALOG.CATEGORY_LABEL' | translate }}</p>
                    <p class="font-semibold text-gray-900 text-lg">
                      {{ selectedCategory() ? getCategoryLabel(selectedCategory()) : ('CATALOG.ALL_CATEGORIES' | translate) }}
                    </p>
                  </div>
                  <div class="p-2 rounded-full bg-white group-active:bg-green-100 transition-colors">
                    <svg class="w-5 h-5 text-gray-400 transition-transform"
                         [class.rotate-180]="activeAccordion() === 'category'" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>

                @if (activeAccordion() === 'category') {
                  <div class="pt-3 pb-4 grid grid-cols-2 gap-3 animate-fade-in">
                    <button (click)="selectCategoryMobile(null)"
                            class="p-3 rounded-xl text-sm font-medium border text-center transition-all bg-white"
                            [class]="!selectedCategory() ? 'ring-2 ring-green-500 border-transparent text-green-700' : 'border-gray-200 text-gray-600'">
                      {{ 'CATALOG.ALL_CATEGORIES' | translate }}
                    </button>
                    @for (cat of categories; track cat.value) {
                      <button (click)="selectCategoryMobile(cat.value)"
                              class="p-3 rounded-xl text-sm font-medium border text-center transition-all bg-white flex flex-col items-center gap-1"
                              [class]="selectedCategory() === cat.value ? 'ring-2 ring-green-500 border-transparent text-green-700' : 'border-gray-200 text-gray-600'">
                        <span class="w-4 h-4" [innerHTML]="getCategoryIcon(cat.value)"></span>
                        {{ cat.translationKey | translate }}
                      </button>
                    }
                  </div>
                }
                <div class="h-px bg-green-200 w-full mt-2"></div>
              </div>

              <div class="hidden md:block">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {{ 'CATALOG.LEVEL_LABEL' | translate }}
                </label>
                <div class="relative">
                  <select
                    [(ngModel)]="selectedLevel"
                    (ngModelChange)="onFilterChange()"
                    class="w-full py-3 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer">
                    <option [ngValue]="null" class="text-gray-500">{{ 'CATALOG.ALL_LEVELS' | translate }}</option>
                    @for (level of levels; track level.value) {
                      <option [value]="level.value">{{ level.translationKey | translate }}</option>
                    }
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="md:hidden">
                <button (click)="toggleAccordion('level')"
                        class="w-full flex items-center justify-between py-2 focus:outline-none group mt-2">
                  <div class="text-left">
                    <p
                      class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{{ 'CATALOG.LEVEL_LABEL' | translate }}</p>
                    <p class="font-semibold text-gray-900 text-lg">
                      {{ selectedLevel() ? getLevelLabel(selectedLevel()) : ('CATALOG.ALL_LEVELS' | translate) }}
                    </p>
                  </div>
                  <div class="p-2 rounded-full bg-white group-active:bg-green-100 transition-colors">
                    <svg class="w-5 h-5 text-gray-400 transition-transform"
                         [class.rotate-180]="activeAccordion() === 'level'" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>

                @if (activeAccordion() === 'level') {
                  <div class="pt-3 pb-2 flex flex-col gap-2 animate-fade-in">
                    <button (click)="selectLevelMobile(null)"
                            class="w-full p-3 rounded-xl text-sm font-medium border text-left flex justify-between items-center transition-all bg-white"
                            [class]="!selectedLevel() ? 'ring-2 ring-green-500 border-transparent text-green-700' : 'border-gray-200 text-gray-600'">
                      {{ 'CATALOG.ALL_LEVELS' | translate }}
                      @if (!selectedLevel()) {
                        <span>✓</span>
                      }
                    </button>
                    @for (level of levels; track level.value) {
                      <button (click)="selectLevelMobile(level.value)"
                              class="w-full p-3 rounded-xl text-sm font-medium border text-left flex justify-between items-center transition-all bg-white"
                              [class]="selectedLevel() === level.value ? 'ring-2 ring-green-500 border-transparent text-green-700' : 'border-gray-200 text-gray-600'">
                        <span class="flex items-center gap-2">
                           <span class="w-4 h-4" [innerHTML]="getLevelIcon(level.value)"></span>
                          {{ level.translationKey | translate }}
                        </span>
                        @if (selectedLevel() === level.value) {
                          <span>✓</span>
                        }
                      </button>
                    }
                  </div>
                }
              </div>

            </div>

            @if (hasActiveFilters()) {
              <div class="mt-6 pt-6 border-t border-green-200 flex flex-wrap items-center gap-3 animate-fade-in">
                 <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 hidden md:inline">
                    {{ 'CATALOG.ACTIVE_FILTERS' | translate }}:
                 </span>

                @if (searchQuery()) {
                  <div
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-green-700 border border-green-200 shadow-sm">
                    <svg class="w-3.5 h-3.5 mr-2 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    "{{ searchQuery() }}"
                    <button (click)="clearSearch()"
                            class="ml-2 text-green-600 hover:text-green-800 hover:bg-white  rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                }

                @if (selectedCategory()) {
                  <div
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors shadow-sm bg-white"
                    [ngClass]="getCategoryColorClass(selectedCategory())">
                    <span class="mr-2 w-4 h-4 flex items-center"
                          [innerHTML]="getCategoryIcon(selectedCategory())"></span>
                    {{ getCategoryLabel(selectedCategory()) }}
                    <button (click)="clearCategory()"
                            class="ml-2 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                }

                @if (selectedLevel()) {
                  <div
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-colors shadow-sm bg-white"
                    [ngClass]="getLevelColorClass(selectedLevel())">
                    <span class="mr-2 w-4 h-4 flex items-center" [innerHTML]="getLevelIcon(selectedLevel())"></span>
                    {{ getLevelLabel(selectedLevel()) }}
                    <button (click)="clearLevel()"
                            class="ml-2 opacity-60 hover:opacity-100 hover:bg-black/5 rounded-full p-0.5 transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                }

                <button (click)="clearAllFilters()"
                        class="ml-auto text-xs font-bold text-gray-500 hover:text-red-600 uppercase tracking-wider transition-colors flex items-center gap-1 group">
                  <svg class="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  {{ 'CATALOG.CLEAR_ALL' | translate }}
                </button>
              </div>
            }
          </div>
        </div>

        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            {{ 'CATALOG.RESULTS_TITLE' | translate }}
            @if (!isLoading()) {
              <span
                class="ml-1 px-3 py-0.5 rounded-full bg-white-100 text-green-700 text-sm font-bold border border-green-200">
                {{ filteredDrills().length }}
              </span>
            }
          </h2>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            @for (item of [1, 2, 3, 4, 5, 6]; track item) {
              <app-skeleton-card/>
            }
          </div>
        } @else {
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
                      class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-sm transition-colors shadow-lg shadow-green-200">
                {{ 'CATALOG.CLEAR_FILTERS_BTN' | translate }}
              </button>
            </div>
          }
        }

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class DrillCatalogComponent implements OnInit {
  private readonly drillService = inject(DrillService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly drillUi = inject(DrillUiService);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  drills = signal<Drill[]>([]);
  filteredDrills = signal<Drill[]>([]);
  isLoading = signal(true);

  searchQuery = signal<string>('');
  selectedCategory = signal<DrillCategory | null>(null);
  selectedLevel = signal<DrillLevel | null>(null);

  isFiltersOpen = signal(false);
  activeAccordion = signal<string | null>(null);

  hasActiveFilters = computed(() => {
    return !!(this.searchQuery().trim() || this.selectedCategory() || this.selectedLevel());
  });

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.searchQuery().trim()) count++;
    if (this.selectedCategory()) count++;
    if (this.selectedLevel()) count++;
    return count;
  });

  ngOnInit(): void {
    this.loadDrills();
  }

  private loadDrills(): void {
    this.isLoading.set(true);
    this.drillService.getDrills().subscribe(drills => {
      this.drills.set(drills);
      this.applyFilters();
      this.isLoading.set(false);
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

  toggleFilters(): void {
    this.isFiltersOpen.update(v => !v);
  }

  toggleAccordion(section: string): void {
    this.activeAccordion.update(curr => curr === section ? null : section);
  }

  selectCategoryMobile(value: DrillCategory | null): void {
    this.selectedCategory.set(value);
    this.onFilterChange();
  }

  selectLevelMobile(value: DrillLevel | null): void {
    this.selectedLevel.set(value);
    this.onFilterChange();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.onFilterChange();
  }

  clearCategory(): void {
    this.selectedCategory.set(null);
    this.onFilterChange();
  }

  clearLevel(): void {
    this.selectedLevel.set(null);
    this.onFilterChange();
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedLevel.set(null);
    this.onFilterChange();
  }

  onDrillClick(drill: Drill): void {
    this.router.navigate(['/catalog', drill.id]);
  }

  getCategoryLabel(val: DrillCategory | null): string {
    if (!val) return '';
    const c = this.categories.find(x => x.value === val);
    return c ? this.translate.instant(c.translationKey) : val;
  }

  getLevelLabel(val: DrillLevel | null): string {
    if (!val) return '';
    const l = this.levels.find(x => x.value === val);
    return l ? this.translate.instant(l.translationKey) : val;
  }

  // --- STYLING HELPERS ---
  getCategoryColorClass(category: DrillCategory | null): string {
    return this.drillUi.getCategoryStyle(category);
  }

  getLevelColorClass(level: DrillLevel | null): string {
    return this.drillUi.getLevelStyle(level);
  }

  getCategoryIcon(category: DrillCategory | null): SafeHtml {
    return this.drillUi.getCategoryIcon(category);
  }

  getLevelIcon(level: DrillLevel | null): SafeHtml {
    return this.drillUi.getLevelIcon(level);
  }
}
