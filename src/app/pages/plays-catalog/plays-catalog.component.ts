import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  PLAYS_CATEGORIES,
  PLAYS_COMPLEXITIES,
  Play,
  PlayCategory,
  PlayComplexity
} from '../../models/plays.model';
import { PlaysService } from '../../services/plays/plays.service';
import { PlayCardComponent } from '../../components/play-card/play-card.component';

@Component({
  selector: 'app-combinations-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, PlayCardComponent, TranslateModule],
  templateUrl: './plays-catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaysCatalogComponent implements OnInit, OnDestroy {
  private playsService = inject(PlaysService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly categories = PLAYS_CATEGORIES;
  readonly complexities = PLAYS_COMPLEXITIES;

  // State Signals
  private allPlays = signal<Play[]>([]);
  isLoading = signal(true);

  // Filter Signals
  searchQuery = signal('');
  selectedCategory = signal<PlayCategory | 'all'>('all');
  selectedComplexity = signal<PlayComplexity | 'all'>('all');
  isMobileFiltersOpen = signal(false);

  private routeSub?: Subscription;

  constructor() {
    // Initial data load
    this.playsService.getCombinationsStream().subscribe({
      next: (data) => {
        this.allPlays.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading plays:', err);
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    // Sync filters with URL on init
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['category']) this.selectedCategory.set(params['category'] as PlayCategory);
      if (params['complexity']) this.selectedComplexity.set(params['complexity'] as PlayComplexity);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  // Reactive Logic
  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.selectedCategory() !== 'all') count++;
    if (this.selectedComplexity() !== 'all') count++;
    return count;
  });

  filteredPlays = computed(() => {
    const list = this.allPlays();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const comp = this.selectedComplexity();

    return list.filter(play => {
      const matchSearch = !query ||
        play.name.toLowerCase().includes(query) ||
        (play.description && play.description.toLowerCase().includes(query));

      const matchCat = cat === 'all' || play.category === cat;
      const matchComp = comp === 'all' || play.complexity === comp;

      return matchSearch && matchCat && matchComp;
    });
  });

  // Actions
  onSearchChange(term: string) {
    this.searchQuery.set(term);
    this.updateUrl();
  }

  setCategory(cat: PlayCategory | 'all') {
    this.selectedCategory.set(cat);
    this.updateUrl();
  }

  setComplexity(lvl: PlayComplexity | 'all') {
    this.selectedComplexity.set(lvl);
    this.updateUrl();
  }

  toggleMobileFilters() {
    this.isMobileFiltersOpen.update(v => !v);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
    this.selectedComplexity.set('all');
    this.updateUrl();
  }

  private updateUrl() {
    const queryParams: any = {};
    const search = this.searchQuery();
    const cat = this.selectedCategory();
    const comp = this.selectedComplexity();

    if (search) queryParams.search = search;
    if (cat !== 'all') queryParams.category = cat;
    if (comp !== 'all') queryParams.complexity = comp;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
