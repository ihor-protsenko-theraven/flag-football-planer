import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DrillService } from '../../services/drill/drill.service';
import { DrillUiService } from '../../services/drill/drill-ui.service';
import {
  Drill,
  DRILL_CATEGORIES,
  DRILL_LEVELS,
  DrillCategory,
  DrillLevel,
  FirestoreDrill
} from '../../models/drill.model';
import { DrillCardComponent } from '../../components/drill-card/drill-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-drill-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, DrillCardComponent, SkeletonCardComponent, TranslateModule],
  templateUrl: './drill-catalog.component.html',
  styles: [`
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
export class DrillCatalogComponent implements OnInit, OnDestroy {
  private readonly drillService = inject(DrillService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly drillUi = inject(DrillUiService);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  // Filter Signals
  searchQuery = signal<string>('');
  selectedCategory = signal<DrillCategory | 'all'>('all');
  selectedLevel = signal<DrillLevel | 'all'>('all');

  isLoading = signal(true);
  isMobileFiltersOpen = signal(false);

  private currentLang = toSignal(
    this.translate.onLangChange.pipe(
      map(e => e.lang),
      startWith(this.translate.currentLang)
    )
  );

  private routeSub?: Subscription;

  constructor() {
    this.drillService.getDrills().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  ngOnInit(): void {
    // Sync filters with URL on init
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery.set(params['q']);
      if (params['cat']) this.selectedCategory.set(params['cat'] as DrillCategory);
      if (params['lvl']) this.selectedLevel.set(params['lvl'] as DrillLevel);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // Reactive Logic
  filteredDrills = computed(() => {
    this.currentLang();

    const term = this.searchQuery().trim() || undefined;
    const cat = this.selectedCategory() === 'all' ? undefined : (this.selectedCategory() as DrillCategory);
    const lvl = this.selectedLevel() === 'all' ? undefined : (this.selectedLevel() as DrillLevel);

    return this.drillService.filterAndSearchDrills(term, cat, lvl);
  });

  areFiltersActive = computed(() => {
    return this.searchQuery().trim() !== '' ||
      this.selectedCategory() !== 'all' ||
      this.selectedLevel() !== 'all';
  });

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.searchQuery().trim()) count++;
    if (this.selectedCategory() !== 'all') count++;
    if (this.selectedLevel() !== 'all') count++;
    return count;
  });

  private updateUrl(): void {
    const queryParams: any = {};
    if (this.searchQuery().trim()) queryParams.q = this.searchQuery();
    if (this.selectedCategory() !== 'all') queryParams.cat = this.selectedCategory();
    if (this.selectedLevel() !== 'all') queryParams.lvl = this.selectedLevel();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.updateUrl();
  }

  setCategory(val: DrillCategory | 'all'): void {
    this.selectedCategory.set(val);
    this.updateUrl();
  }

  setLevel(val: DrillLevel | 'all'): void {
    this.selectedLevel.set(val);
    this.updateUrl();
  }

  toggleFilters(): void {
    this.isMobileFiltersOpen.update(v => !v);
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
    this.selectedLevel.set('all');
    this.updateUrl();
  }

  onDrillClick(drill: Drill | FirestoreDrill): void {
    this.router.navigate(['/catalog', drill.id]);
  }
}
