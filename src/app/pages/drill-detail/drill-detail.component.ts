import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DrillService } from '../../services/drill.service';
import { TranslationHelperService } from '../../services/translation-helper.service';
import { Drill } from '../../models/drill.model';
import { DrillCardComponent } from '../../components/drill-card/drill-card.component';

@Component({
    selector: 'app-drill-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, DrillCardComponent],
    template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="mb-6 flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group"
        >
          <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ 'DRILL_DETAIL.BACK_TO_CATALOG' | translate }}
        </button>

        <div *ngIf="drill" class="animate-fade-in">
          <!-- Hero Section -->
          <div class="card overflow-hidden mb-8">
            <div class="grid md:grid-cols-2 gap-0">
              <!-- Image Section -->
              <div class="relative h-96 md:h-auto overflow-hidden bg-slate-200">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img 
                  [src]="drill.imageUrl || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop'" 
                  [alt]="drill.name"
                  class="w-full h-full object-cover"
                />
                <div class="absolute top-4 right-4 z-20 flex gap-2">
                  <span [class]="getLevelBadgeClass() + ' shadow-lg backdrop-blur-sm'">
                    {{ translationHelper.getLevelLabel(drill.level) }}
                  </span>
                </div>
              </div>

              <!-- Info Section -->
              <div class="p-8 flex flex-col">
                <h1 class="text-4xl font-display font-bold text-gray-900 mb-4">{{ drill.name }}</h1>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div class="text-sm text-green-600 font-medium mb-1">{{ 'DRILL_DETAIL.DURATION' | translate }}</div>
                    <div class="text-2xl font-bold text-green-700 flex items-center">
                      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ drill.duration }} {{ 'DRILL_DETAIL.MINUTES' | translate }}
                    </div>
                  </div>

                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div class="text-sm text-slate-600 font-medium mb-1">{{ 'DRILL_DETAIL.CATEGORY' | translate }}</div>
                    <div class="text-lg font-bold text-slate-700">
                      <span [class]="getCategoryBadgeClass()">
                        {{ translationHelper.getCategoryLabel(drill.category) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 mt-auto">
                  <button class="btn-primary flex-1 flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ 'DRILL_DETAIL.ADD_TO_TRAINING' | translate }}
                  </button>
                  
                  <button 
                    *ngIf="drill.videoUrl"
                    (click)="openVideo()"
                    class="btn-secondary flex items-center justify-center px-6"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ 'DRILL_DETAIL.WATCH_VIDEO' | translate }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Description & Details -->
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
              <!-- Description -->
              <div class="card p-6">
                <h2 class="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ 'DRILL_DETAIL.DESCRIPTION' | translate }}
                </h2>
                <p class="text-gray-700 leading-relaxed">{{ drill.description }}</p>
              </div>

              <!-- Instructions (placeholder) -->
              <div class="card p-6">
                <h2 class="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {{ 'DRILL_DETAIL.INSTRUCTIONS' | translate }}
                </h2>
                <ol class="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Set up the field with cones marking the boundaries</li>
                  <li>Divide players into two teams</li>
                  <li>Explain the drill objectives and rules</li>
                  <li>Run the drill for the specified duration</li>
                  <li>Provide feedback and coaching points</li>
                </ol>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Equipment -->
              <div class="card p-6">
                <h3 class="text-lg font-display font-bold text-gray-900 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {{ 'DRILL_DETAIL.EQUIPMENT' | translate }}
                </h3>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">•</span>
                    <span>Cones (8-12)</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">•</span>
                    <span>Footballs (2-4)</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">•</span>
                    <span>Flag belts</span>
                  </li>
                </ul>
              </div>

              <!-- Coaching Tips -->
              <div class="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                <h3 class="text-lg font-display font-bold text-gray-900 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {{ 'DRILL_DETAIL.TIPS' | translate }}
                </h3>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">✓</span>
                    <span>Focus on proper technique over speed</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">✓</span>
                    <span>Encourage communication between players</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-2">✓</span>
                    <span>Adjust difficulty based on skill level</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Related Drills -->
          <div *ngIf="relatedDrills.length > 0" class="mt-12">
            <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">{{ 'DRILL_DETAIL.RELATED_DRILLS' | translate }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <app-drill-card
                *ngFor="let relatedDrill of relatedDrills"
                [drill]="relatedDrill"
                (cardClick)="onRelatedDrillClick($event)"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!drill" class="text-center py-16">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading drill details...</p>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class DrillDetailComponent implements OnInit {
    drill: Drill | null = null;
    relatedDrills: Drill[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private drillService: DrillService,
        public translationHelper: TranslationHelperService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadDrill(id);
        }
    }

    loadDrill(id: string): void {
        this.drillService.getDrillById(id).subscribe(drill => {
            if (drill) {
                this.drill = drill;
                this.loadRelatedDrills();
            } else {
                this.router.navigate(['/catalog']);
            }
        });
    }

    loadRelatedDrills(): void {
        if (!this.drill) return;

        this.drillService.filterAndSearchDrills(
            undefined,
            this.drill.category,
            undefined
        ).subscribe(drills => {
            this.relatedDrills = drills
                .filter(d => d.id !== this.drill?.id)
                .slice(0, 3);
        });
    }

    goBack(): void {
        this.router.navigate(['/catalog']);
    }

    openVideo(): void {
        if (this.drill?.videoUrl) {
            window.open(this.drill.videoUrl, '_blank');
        }
    }

    onRelatedDrillClick(drill: Drill): void {
        this.router.navigate(['/catalog', drill.id]);
        // Reload the page with new drill
        this.loadDrill(drill.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getLevelBadgeClass(): string {
        if (!this.drill) return '';
        const baseClass = 'badge text-white font-medium tracking-wide text-sm px-3 py-1.5';
        switch (this.drill.level) {
            case 'beginner':
                return `${baseClass} bg-emerald-500`;
            case 'intermediate':
                return `${baseClass} bg-amber-500`;
            case 'advanced':
                return `${baseClass} bg-rose-500`;
            default:
                return `${baseClass} bg-slate-500`;
        }
    }

    getCategoryBadgeClass(): string {
        if (!this.drill) return '';
        const baseClass = 'badge border text-sm';
        switch (this.drill.category) {
            case 'passing':
                return `${baseClass} bg-sky-50 text-sky-700 border-sky-200`;
            case 'defense':
                return `${baseClass} bg-rose-50 text-rose-700 border-rose-200`;
            case 'offense':
                return `${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200`;
            case 'conditioning':
                return `${baseClass} bg-violet-50 text-violet-700 border-violet-200`;
            case 'warmup':
                return `${baseClass} bg-orange-50 text-orange-700 border-orange-200`;
            default:
                return `${baseClass} bg-slate-50 text-slate-700 border-slate-200`;
        }
    }
}
