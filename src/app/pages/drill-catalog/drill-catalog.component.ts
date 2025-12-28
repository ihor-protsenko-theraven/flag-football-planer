import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SafeHtml } from '@angular/platform-browser';
import { map, startWith } from 'rxjs/operators';

import { DrillService } from '../../services/drill.service';
import { DrillUiService } from '../../services/drill-ui.service';
import { Drill, DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, DrillLevel, FirestoreDrill } from '../../models/drill.model';
import { DrillCardComponent } from '../../components/drill-card/drill-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-drill-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DrillCardComponent, SkeletonCardComponent, TranslateModule],
  templateUrl: './drill-catalog.component.html',
  styles: [`
    /* Твої стилі без змін */
    .animate-fade-in {
      animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-down {
      animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
      }
    }

    .chip {
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .chip:hover {
      transform: translateY(-1px);
      filter: brightness(0.95);
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

  searchQuery = signal<string>('');
  selectedCategory = signal<DrillCategory | null>(null);
  selectedLevel = signal<DrillLevel | null>(null);

  isFiltersOpen = signal(false);
  activeAccordion = signal<string | null>(null);
  isMobile = signal(window.innerWidth < 768);
  isLoading = signal(true);

  private currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map(e => e.lang),
      startWith(this.translate.currentLang)
    )
  );

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    });

    this.drillService.getDrills().subscribe(() => {
      setTimeout(() => this.isLoading.set(false), 300);
    });
  }

  ngOnInit(): void {
  }

  filteredDrills = computed(() => {
    this.currentLang();

    const term = this.searchQuery().trim() || undefined;
    const cat = this.selectedCategory() || undefined;
    const lvl = this.selectedLevel() || undefined;

    return this.drillService.filterAndSearchDrills(term, cat, lvl);
  });

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

  onFilterChange(): void {
    // Signals handle updates automatically
  }

  toggleFilters(): void {
    this.isFiltersOpen.update(v => !v);
  }

  toggleAccordion(section: string): void {
    this.activeAccordion.update(curr => curr === section ? null : section);
  }

  selectCategoryMobile(value: DrillCategory | null): void {
    this.selectedCategory.set(value);
  }

  selectLevelMobile(value: DrillLevel | null): void {
    this.selectedLevel.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  clearCategory(): void {
    this.selectedCategory.set(null);
  }

  clearLevel(): void {
    this.selectedLevel.set(null);
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.selectedLevel.set(null);
  }

  onDrillClick(drill: Drill | FirestoreDrill): void {
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
