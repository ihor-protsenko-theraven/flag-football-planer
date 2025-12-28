import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CombinationService} from '../../services/combination/combination.service';
import {CombinationUiService} from '../../services/combination/combination-ui.service';
import {Combination} from '../../models/combination.model';

@Component({
  selector: 'app-combination-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      @if (drill(); as drillData) {

        <!-- Top Navigation -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button (click)="goBack()"
                  class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-wide transition-colors">
            <div
              class="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </div>
            {{ 'COMBINATIONS.BACK_TO_PLAYBOOK' | translate }}
          </button>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 lg:gap-24">

            <!-- Left Column: Visuals -->
            <div class="space-y-8">
              <!-- Main Image -->
              <div
                class="relative aspect-[4/3] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 overflow-hidden border border-slate-100 dark:border-slate-800 group">
                <img [src]="drillData.imageUrl || 'assets/images/placeholder_combination.jpg'"
                     [alt]="drillData.name"
                     class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">

                <!-- Overlay Badges -->
                <div class="absolute bottom-6 left-6 flex flex-wrap gap-2">
                    <span
                      class="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                      {{ drillData.personnel }}
                    </span>
                  <span
                    class="px-3 py-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20 shadow-lg shadow-indigo-600/40">
                      {{ drillData.formation }}
                    </span>
                </div>
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ 'COMBINATIONS.CATEGORY' | translate }}</span>
                  <div class="flex items-center gap-2">
                    <span [innerHTML]="uiService.getCategoryIcon(drillData.category)" class="w-5 h-5"
                          [class]="getIconClass(drillData.category)"></span>
                    <span
                      class="font-bold text-slate-900 dark:text-white">{{ 'COMBINATIONS.CATEGORIES.' + drillData.category.toUpperCase() | translate }}</span>
                  </div>
                </div>
                <div
                  class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ 'COMBINATIONS.COMPLEXITY_LABEL' | translate }}</span>
                  <span
                    [class]="'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ' + uiService.getComplexityStyle(drillData.complexity)">
                          {{ 'COMBINATIONS.COMPLEXITY.' + drillData.complexity.toUpperCase() | translate }}
                      </span>
                </div>
              </div>
            </div>

            <!-- Right Column: Content -->
            <div class="py-4">
              <h1
                class="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white mb-6 leading-tight">
                {{ drillData.name }}
              </h1>

              <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 font-medium">
                {{ drillData.description }}
              </p>

              <!-- Key Points -->
              @if (drillData.keyPoints?.length) {
                <div
                  class="bg-indigo-50 dark:bg-indigo-950/30 rounded-[2rem] p-8 border border-indigo-100 dark:border-indigo-900/50">
                  <h3 class="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-bold text-xl mb-6">
                    <span
                      class="w-8 h-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center">
                       <svg class="w-4 h-4 text-indigo-700 dark:text-indigo-300" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                      d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {{ 'COMBINATIONS.KEY_POINTS' | translate }}
                  </h3>
                  <ul class="space-y-4">
                    @for (point of drillData.keyPoints; track $index) {
                      <li class="flex items-start gap-4 text-indigo-900/80 dark:text-indigo-200/80">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                        <span class="text-lg">{{ point }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Actions (Future placeholder) -->
              <!-- <div class="mt-10 flex gap-4"> ... </div> -->

            </div>
          </div>
        </div>
      } @else {
        <!-- Loading Skeleton -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div class="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8"></div>
          <div class="grid lg:grid-cols-2 gap-12">
            <div class="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
            <div class="space-y-6">
              <div class="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              <div class="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              <div class="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CombinationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private combinationService = inject(CombinationService);
  uiService = inject(CombinationUiService);

  drill = signal<Combination | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCombination(id);
      }
    });
  }

  loadCombination(id: string) {
    this.combinationService.getCombinationById(id).subscribe(data => {
      this.drill.set(data);
    });
  }

  goBack() {
    this.router.navigate(['/combinations']);
  }

  getIconClass(category: string): string {
    switch (category) {
      case 'pass_play':
        return 'text-blue-600';
      case 'run_play':
        return 'text-emerald-600';
      case 'trick_play':
        return 'text-purple-600';
      case 'defense_scheme':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  }
}
