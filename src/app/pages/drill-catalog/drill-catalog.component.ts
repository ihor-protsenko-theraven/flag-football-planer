import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {DrillService} from '../../services/drill.service';
import {Drill, DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, DrillLevel} from '../../models/drill.model';
import {DrillCardComponent} from '../../components/drill-card/drill-card.component';

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
              <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                  <button
                    (click)="clearSearch()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title="Clear search">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                    <option [value]="cat.value">
                      {{ cat.translationKey | translate }}
                    </option>
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                    <option [value]="level.value">
                      {{ level.translationKey | translate }}
                    </option>
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

              <span class="text-sm font-medium text-gray-500 mr-2">
                {{ 'CATALOG.ACTIVE_FILTERS' | translate }}:
              </span>

              @if (searchQuery()) {
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <span class="mr-1.5">🔍</span>
                  {{ searchQuery() }}
                  <button (click)="clearSearch()" class="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"
                                                                                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                       clip-rule="evenodd"></path></svg>
                  </button>
                </span>
              }

              @if (selectedCategory()) {
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                  <span class="mr-1.5">📂</span>
                  {{ getCategoryLabel() }}
                  <button (click)="clearCategory()" class="ml-2 text-green-400 hover:text-green-600 focus:outline-none">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"
                                                                                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                       clip-rule="evenodd"></path></svg>
                  </button>
                </span>
              }

              @if (selectedLevel()) {
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  <span class="mr-1.5">⭐</span>
                  {{ getLevelLabel() }}
                  <button (click)="clearLevel()" class="ml-2 text-purple-400 hover:text-purple-600 focus:outline-none">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd"
                                                                                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                       clip-rule="evenodd"></path></svg>
                  </button>
                </span>
              }

              <button
                (click)="clearAllFilters()"
                class="ml-auto text-sm text-gray-500 hover:text-red-600 font-medium transition-colors hover:underline">
                {{ 'CATALOG.CLEAR_ALL' | translate }}
              </button>
            </div>
          }
        </div>

        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ 'CATALOG.RESULTS_TITLE' | translate }}
            <span
              class="ml-2 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-normal border border-gray-200">
              {{ filteredDrills().length }}
            </span>
          </h2>
        </div>

        @if (filteredDrills().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            @for (drill of filteredDrills(); track drill.id) {
              <app-drill-card
                [drill]="drill"
                (cardClick)="onDrillClick($event)"
              />
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
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ 'CATALOG.NO_RESULTS_TITLE' | translate }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ 'CATALOG.NO_RESULTS_DESC' | translate }}
            </p>
            <button
              (click)="clearAllFilters()"
              class="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm">
              {{ 'CATALOG.CLEAR_FILTERS_BTN' | translate }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Якщо Tailwind не підключений, ця анімація спрацює */
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
      // Ініціалізація фільтрів після завантаження
      this.applyFilters();
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchQuery().trim() || undefined;
    const cat = this.selectedCategory() || undefined; // перетворюємо null в undefined для сервісу
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
}
