import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import {CombinationService} from '../../services/combination/combination.service';
import {CombinationCardComponent} from '../../components/combination-card/combination-card.component';
import {
  COMBINATION_CATEGORIES,
  COMBINATION_COMPLEXITIES,
  CombinationCategory,
  CombinationComplexity
} from '../../models/combination.model';

@Component({
  selector: 'app-combinations-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CombinationCardComponent, TranslateModule],
  templateUrl: './combinations-catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombinationsCatalogComponent implements OnInit {
  private combinationService = inject(CombinationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly categories = COMBINATION_CATEGORIES;
  readonly complexities = COMBINATION_COMPLEXITIES;
  readonly PAGE_SIZE = 9;

  isLoading = signal(true);
  isFiltersOpen = signal(false);
  visibleLimit = signal(this.PAGE_SIZE);

  filterForm = new FormGroup({
    search: new FormControl<string>(''),
    category: new FormControl<CombinationCategory | null>(null),
    complexity: new FormControl<CombinationComplexity | null>(null),
  });

  private allCombinations = signal<any[]>([]);

  constructor() {
    // Fetch data (simulated)
    this.combinationService.getCombinations().subscribe(data => {
      this.allCombinations.set(data);
      this.isLoading.set(false);
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(() => {
        this.updateUrl();
        this.visibleLimit.set(this.PAGE_SIZE);
      });
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.filterForm.patchValue({
      search: params['search'] || '',
      category: params['category'] || null,
      complexity: params['complexity'] || null
    }, {emitEvent: false});
  }

  private formValues = toSignal(this.filterForm.valueChanges, {initialValue: this.filterForm.value});

  filteredCombinations = computed(() => {
    const rawData = this.allCombinations();
    const filters = this.formValues();

    const term = filters?.search?.toLowerCase().trim();
    const category = filters?.category;
    const complexity = filters?.complexity;

    return rawData.filter(item => {
      const matchSearch = !term || item.name.toLowerCase().includes(term) || (item.description && item.description.toLowerCase().includes(term));
      const matchCategory = !category || item.category === category;
      const matchComplexity = !complexity || item.complexity === complexity;

      return matchSearch && matchCategory && matchComplexity;
    });
  });

  visibleCombinations = computed(() => {
    return this.filteredCombinations().slice(0, this.visibleLimit());
  });

  activeFiltersCount = computed(() => {
    const v = this.formValues();
    let count = 0;
    if (v?.search) count++;
    if (v?.category) count++;
    if (v?.complexity) count++;
    return count;
  });

  hasActiveFilters = computed(() => this.activeFiltersCount() > 0);

  // --- Actions ---

  updateUrl() {
    const val = this.filterForm.value;
    const queryParams: any = {};

    if (val.search) queryParams.search = val.search;
    if (val.category) queryParams.category = val.category;
    if (val.complexity) queryParams.complexity = val.complexity;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  loadMore() {
    this.visibleLimit.update(l => l + this.PAGE_SIZE);
  }

  toggleFilters() {
    this.isFiltersOpen.update(v => !v);
  }

  setCategory(cat: CombinationCategory) {
    // If clicking same category, clear it (toggle behavior)
    if (this.filterForm.value.category === cat) {
      this.filterForm.patchValue({category: null});
    } else {
      this.filterForm.patchValue({category: cat});
    }
  }

  setComplexity(lvl: CombinationComplexity) {
    if (this.filterForm.value.complexity === lvl) {
      this.filterForm.patchValue({complexity: null});
    } else {
      this.filterForm.patchValue({complexity: lvl});
    }
  }

  clearSearch() {
    this.filterForm.patchValue({search: ''});
  }

  clearAllFilters() {
    this.filterForm.reset();
  }
}
