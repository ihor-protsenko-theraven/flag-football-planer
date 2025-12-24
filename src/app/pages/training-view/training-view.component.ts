import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TrainingService} from '../../services/training.service';
import {DrillService} from '../../services/drill.service';
import {PdfExportService} from '../../services/pdf-export.service';
import {Training} from '../../models/training.model';
import {Drill} from '../../models/drill.model';

@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (training(); as trainingData) {
          <div class="animate-fade-in">
            <!-- Header -->
            <div class="mb-8">
              <button routerLink="/trainings"
                      class="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to My Trainings
              </button>

              <div class="flex items-start justify-between gap-6">
                <div>
                  <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">{{ trainingData.name }}</h1>
                  <p class="text-gray-600">{{ formatDate(trainingData.createdAt) }}</p>
                </div>

                <button (click)="exportToPDF()" class="btn-primary">
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Export to PDF
                </button>
              </div>
            </div>

            <!-- Summary Card -->
            <div class="card mb-8 p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center p-4 bg-primary-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Total Duration</p>
                  <p class="text-4xl font-bold text-primary-600">{{ trainingData.totalDuration }}</p>
                  <p class="text-sm text-gray-600">minutes</p>
                </div>
                <div class="text-center p-4 bg-accent-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Total Drills</p>
                  <p class="text-4xl font-bold text-accent-600">{{ trainingData.drills.length }}</p>
                  <p class="text-sm text-gray-600">exercises</p>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                  <p class="text-sm text-gray-600 mb-2">Avg Duration</p>
                  <p class="text-4xl font-bold text-purple-600">{{ getAverageDuration(trainingData) }}</p>
                  <p class="text-sm text-gray-600">min/drill</p>
                </div>
              </div>
            </div>

            <!-- Drills List -->
            <div class="card">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Training Drills</h2>

              <div class="space-y-6">
                @for (trainingDrill of getSortedDrills(trainingData); let i = $index; track trainingDrill.drillId) {
                  @let drillData = getDrill(trainingDrill.drillId);
                  <div class="border-l-4 border-primary-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                    <!-- Drill Header -->
                    <div class="flex items-start justify-between gap-4 mb-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <span
                            class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                            {{ i + 1 }}
                          </span>
                          <h3 class="text-xl font-bold text-gray-900">{{ drillData?.name }}</h3>
                        </div>

                        <div class="flex flex-wrap items-center gap-4 text-sm mb-3">
                          <span [class]="getCategoryBadgeClass(drillData?.category)">
                            {{ drillData?.category }}
                          </span>
                          <span [class]="getLevelBadgeClass(drillData?.level)">
                            {{ drillData?.level }}
                          </span>
                          <span class="text-primary-600 font-semibold">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ trainingDrill.duration }} minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-700 mb-3">{{ drillData?.description }}</p>

                    <!-- Notes -->
                    @if (trainingDrill.notes) {
                      <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                        <p class="text-sm font-medium text-blue-900 mb-1">📝 Coach Notes:</p>
                        <p class="text-sm text-blue-800">{{ trainingDrill.notes }}</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between mt-8">
              <button routerLink="/trainings" class="btn-secondary">
                Back to List
              </button>
              <div class="flex gap-4">
                <button (click)="exportToPDF()" class="btn-primary">
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
        } @else {
          <!-- Loading State -->
          <div class="text-center py-16">
            <div
              class="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-gray-600">Loading training...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class TrainingViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trainingService = inject(TrainingService);
  private readonly drillService = inject(DrillService);
  private readonly pdfExportService = inject(PdfExportService);

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
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  getCategoryBadgeClass(category?: string): string {
    const baseClass = 'badge';
    switch (category) {
      case 'passing':
        return `${baseClass} bg-blue-100 text-blue-700`;
      case 'defense':
        return `${baseClass} bg-red-100 text-red-700`;
      case 'offense':
        return `${baseClass} bg-green-100 text-green-700`;
      case 'conditioning':
        return `${baseClass} bg-purple-100 text-purple-700`;
      case 'warmup':
        return `${baseClass} bg-orange-100 text-orange-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  }

  getLevelBadgeClass(level?: string): string {
    const baseClass = 'badge text-white';
    switch (level) {
      case 'beginner':
        return `${baseClass} bg-green-500`;
      case 'intermediate':
        return `${baseClass} bg-yellow-500`;
      case 'advanced':
        return `${baseClass} bg-red-500`;
      default:
        return `${baseClass} bg-gray-500`;
    }
  }
}
