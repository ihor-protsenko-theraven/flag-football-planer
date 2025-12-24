import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; // Added TranslateService
import { TrainingService } from '../../services/training.service';
import { DrillService } from '../../services/drill.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { Training } from '../../models/training.model';
import { Drill } from '../../models/drill.model';

@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-6 pb-24 md:py-8 md:pb-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (training(); as trainingData) {
          <div class="animate-fade-in">

            <div class="flex items-center gap-3 mb-6 md:hidden">
              <button routerLink="/trainings" class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-bold text-gray-900 truncate">{{ trainingData.name }}</h1>
                <p class="text-xs text-gray-500">{{ formatDate(trainingData.createdAt) }}</p>
              </div>
            </div>

            <div class="hidden md:block mb-8">
              <button routerLink="/trainings"
                      class="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center gap-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                {{ 'TRAINING_VIEW.BACK_TO_LIST' | translate }}
              </button>

              <div class="flex items-start justify-between gap-6">
                <div>
                  <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">{{ trainingData.name }}</h1>
                  <p class="text-gray-600 flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {{ formatDate(trainingData.createdAt) }}
                  </p>
                </div>

                <button (click)="exportToPDF()" class="btn-primary shadow-lg shadow-primary-500/20">
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {{ 'TRAINING_VIEW.EXPORT_PDF' | translate }}
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
              <div class="grid grid-cols-3 gap-2 md:gap-6 divide-x divide-gray-100 md:divide-x-0">
                <div class="text-center px-2 md:p-4 md:bg-blue-50 md:rounded-xl">
                  <p class="text-[10px] md:text-sm text-gray-500 uppercase font-bold tracking-wider mb-1 md:mb-2">{{ 'TRAINING_VIEW.TOTAL_DURATION' | translate }}</p>
                  <p class="text-xl md:text-4xl font-bold text-blue-600">{{ trainingData.totalDuration }}</p>
                  <p class="text-[10px] md:text-sm text-gray-400 md:text-gray-600">{{ 'TRAINING_VIEW.MINUTES' | translate }}</p>
                </div>
                <div class="text-center px-2 md:p-4 md:bg-green-50 md:rounded-xl">
                  <p class="text-[10px] md:text-sm text-gray-500 uppercase font-bold tracking-wider mb-1 md:mb-2">{{ 'TRAINING_VIEW.TOTAL_DRILLS' | translate }}</p>
                  <p class="text-xl md:text-4xl font-bold text-green-600">{{ trainingData.drills.length }}</p>
                  <p class="text-[10px] md:text-sm text-gray-400 md:text-gray-600">{{ 'TRAINING_VIEW.EXERCISES' | translate }}</p>
                </div>
                <div class="text-center px-2 md:p-4 md:bg-purple-50 md:rounded-xl">
                  <p class="text-[10px] md:text-sm text-gray-500 uppercase font-bold tracking-wider mb-1 md:mb-2">{{ 'TRAINING_VIEW.AVG_DURATION' | translate }}</p>
                  <p class="text-xl md:text-4xl font-bold text-purple-600">{{ getAverageDuration(trainingData) }}</p>
                  <p class="text-[10px] md:text-sm text-gray-400 md:text-gray-600">{{ 'TRAINING_VIEW.MIN_DRILL' | translate }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span class="text-xl">📋</span> {{ 'TRAINING_VIEW.PLAN_TITLE' | translate }}
                </h2>
              </div>

              <div class="divide-y divide-gray-100">
                @for (trainingDrill of getSortedDrills(trainingData); let i = $index; track trainingDrill.drillId) {
                  @let drillData = getDrill(trainingDrill.drillId);
                  <div class="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex items-start gap-4">
                      <div class="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm mt-1">
                        {{ i + 1 }}
                      </div>

                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h3 class="text-lg font-bold text-gray-900">{{ drillData?.name }}</h3>
                          <div class="flex items-center gap-2 text-sm">
                            <span class="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              ⏱ {{ trainingDrill.duration }} {{ 'TRAINING_VIEW.MIN_SHORT' | translate }}
                            </span>
                          </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-3">
                          <span [class]="getCategoryBadgeClass(drillData?.category)">
                            {{ drillData?.category }}
                          </span>
                          <span [class]="getLevelBadgeClass(drillData?.level)">
                            {{ drillData?.level }}
                          </span>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3 md:line-clamp-none">
                          {{ drillData?.description }}
                        </p>

                        @if (trainingDrill.notes) {
                          <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                            <p class="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              {{ 'TRAINING_VIEW.COACH_NOTES' | translate }}:
                            </p>
                            <p class="text-sm text-amber-900 italic">"{{ trainingDrill.notes }}"</p>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="hidden md:flex items-center justify-between mt-8">
              <button routerLink="/trainings" class="btn-secondary">
                {{ 'TRAINING_VIEW.BACK_TO_LIST' | translate }}
              </button>
            </div>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full mb-4"></div>
            <p class="text-gray-500 font-medium">{{ 'TRAINING_VIEW.LOADING' | translate }}</p>
          </div>
        }
      </div>

      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
        <button (click)="exportToPDF()" class="w-full btn-primary py-3.5 text-base shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ 'TRAINING_VIEW.EXPORT_PDF' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pb-safe {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }

    .badge {
      @apply inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border;
    }
  `]
})
export class TrainingViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trainingService = inject(TrainingService);
  private readonly drillService = inject(DrillService);
  private readonly pdfExportService = inject(PdfExportService);
  private readonly translate = inject(TranslateService); // Added Inject

  training = signal<Training | null>(null);
  drillsMap = signal<Map<string, Drill>>(new Map());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTraining(id);
      this.loadDrills();
    }
  }

  private loadTraining(id: string): void {
    this.trainingService.getTrainingById(id).subscribe(trainingData => {
      if (trainingData) {
        this.training.set(trainingData);
      } else {
        this.router.navigate(['/trainings']);
      }
    });
  }

  private loadDrills(): void {
    this.drillService.getDrills().subscribe(drills => {
      const map = new Map(drills.map(d => [d.id, d]));
      this.drillsMap.set(map);
    });
  }

  getDrill(drillId: string): Drill | undefined {
    return this.drillsMap().get(drillId);
  }

  getSortedDrills(trainingData: Training) {
    return [...trainingData.drills].sort((a, b) => a.order - b.order);
  }

  getAverageDuration(trainingData: Training): number {
    if (trainingData.drills.length === 0) return 0;
    return Math.round(trainingData.totalDuration / trainingData.drills.length);
  }

  exportToPDF(): void {
    const trainingData = this.training();
    if (!trainingData) return;

    const drills = trainingData.drills
      .map(td => this.getDrill(td.drillId))
      .filter((d): d is Drill => d !== undefined);

    this.pdfExportService.exportTrainingToPDF(trainingData, drills);
  }

  formatDate(date: Date): string {
    // Check current language for better formatting
    const lang = this.translate.currentLang === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  getCategoryBadgeClass(category?: string): string {
    const baseClass = 'badge';
    switch (category) {
      case 'passing': return `${baseClass} bg-blue-50 text-blue-700 border-blue-200`;
      case 'defense': return `${baseClass} bg-red-50 text-red-700 border-red-200`;
      case 'offense': return `${baseClass} bg-green-50 text-green-700 border-green-200`;
      case 'conditioning': return `${baseClass} bg-teal-50 text-teal-700 border-teal-200`;
      case 'warmup': return `${baseClass} bg-yellow-50 text-yellow-700 border-yellow-200`;
      default: return `${baseClass} bg-gray-50 text-gray-700 border-gray-200`;
    }
  }

  getLevelBadgeClass(level?: string): string {
    const baseClass = 'badge';
    switch (level) {
      case 'beginner': return `${baseClass} bg-green-100 text-green-800 border-green-200`;
      case 'intermediate': return `${baseClass} bg-blue-100 text-blue-800 border-blue-200`;
      case 'advanced': return `${baseClass} bg-purple-100 text-purple-800 border-purple-200`;
      default: return `${baseClass} bg-gray-100 text-gray-800 border-gray-200`;
    }
  }
}
