import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DrillService } from '../../services/drill.service';
import { Drill, DrillCategory, DrillLevel, DRILL_CATEGORIES, DRILL_LEVELS } from '../../models/drill.model';
import { DrillCardComponent } from '../../components/drill-card/drill-card.component';

@Component({
  selector: 'app-drill-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DrillCardComponent, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">{{ 'CATALOG.TITLE' | translate }}</h1>
          <p class="text-gray-600">{{ 'CATALOG.SUBTITLE' | translate }}</p>
        </div>

        <!-- Filters -->
        <div class="card mb-8 p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'CATALOG.SEARCH_LABEL' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onFilterChange()"
                placeholder="{{ 'CATALOG.SEARCH_PLACEHOLDER' | translate }}"
                class="input-field"
              />
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'CATALOG.CATEGORY_LABEL' | translate }}</label>
              <select
                [(ngModel)]="selectedCategory"
                (ngModelChange)="onFilterChange()"
                class="input-field"
              >
                <option [value]="undefined">{{ 'CATALOG.ALL_CATEGORIES' | translate }}</option>
                @for (cat of categories; track cat.value) {
                  <option [value]="cat.value">
                    {{ cat.translationKey | translate }}
                  </option>
                }
              </select>
            </div>

            <!-- Level Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ 'CATALOG.LEVEL_LABEL' | translate }}</label>
              <select
                [(ngModel)]="selectedLevel"
                (ngModelChange)="onFilterChange()"
                class="input-field"
              >
                <option [value]="undefined">{{ 'CATALOG.ALL_LEVELS' | translate }}</option>
                @for (level of levels; track level.value) {
                  <option [value]="level.value">
                    {{ level.translationKey | translate }}
                  </option>
                }
              </select>
            </div>
          </div>

          <!-- Active Filters Summary -->
          @if (hasActiveFilters()) {
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600">{{ 'CATALOG.ACTIVE_FILTERS' | translate }}</span>
                @if (searchQuery) {
                  <button
                    (click)="clearSearch()"
                    class="badge bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer"
                  >
                    Search: "{{ searchQuery }}" ✕
                  </button>
                }
                @if (selectedCategory) {
                  <button
                    (click)="clearCategory()"
                    class="badge bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer"
                  >
                    Category: {{ getCategoryLabel() }} ✕
                  </button>
                }
                @if (selectedLevel) {
                  <button
                    (click)="clearLevel()"
                    class="badge bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer"
                  >
                    Level: {{ getLevelLabel() }} ✕
                  </button>
                }
                <button
                  (click)="clearAllFilters()"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
                >
                  {{ 'CATALOG.CLEAR_ALL' | translate }}
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Results Count -->
        <div class="mb-6">
          <p class="text-gray-600">
            {{ 'CATALOG.SHOWING_RESULTS' | translate:{count: filteredDrills().length} }}
          </p>
        </div>

        <!-- Drills Grid -->
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
          <!-- Empty State -->
          <div class="text-center py-16 animate-fade-in">
            <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ 'CATALOG.NO_RESULTS_TITLE' | translate }}</h3>
            <p class="text-gray-600 mb-6">{{ 'CATALOG.NO_RESULTS_DESC' | translate }}</p>
            <button (click)="clearAllFilters()" class="btn-primary">
              {{ 'CATALOG.CLEAR_FILTERS_BTN' | translate }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class DrillCatalogComponent implements OnInit {
  private readonly drillService = inject(DrillService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  drills = signal<Drill[]>([]);
  filteredDrills = signal<Drill[]>([]);

  searchQuery = '';
  selectedCategory: DrillCategory | undefined;
  selectedLevel: DrillLevel | undefined;

  hasActiveFilters = computed(() =>
    !!(this.searchQuery || this.selectedCategory || this.selectedLevel)
  );

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
    this.drillService.filterAndSearchDrills(
      this.searchQuery || undefined,
      this.selectedCategory,
      this.selectedLevel
    ).subscribe(filtered => {
      this.filteredDrills.set(filtered);
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onFilterChange();
  }

  clearCategory(): void {
    this.selectedCategory = undefined;
    this.onFilterChange();
  }

  clearLevel(): void {
    this.selectedLevel = undefined;
    this.onFilterChange();
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = undefined;
    this.selectedLevel = undefined;
    this.onFilterChange();
  }

  getCategoryLabel(): string {
    const category = this.categories.find(c => c.value === this.selectedCategory);
    return category ? this.translate.instant(category.translationKey) : '';
  }

  getLevelLabel(): string {
    const level = this.levels.find(l => l.value === this.selectedLevel);
    return level ? this.translate.instant(level.translationKey) : '';
  }

  onDrillClick(drill: Drill): void {
    this.router.navigate(['/catalog', drill.id]);
  }
}
