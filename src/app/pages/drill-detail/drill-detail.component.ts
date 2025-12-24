import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SafeHtml} from '@angular/platform-browser';

import {DrillService} from '../../services/drill.service';
import {TranslationHelperService} from '../../services/translation-helper.service';
import {DrillUiService} from '../../services/drill-ui.service';
import {Drill} from '../../models/drill.model';
import {DrillCardComponent} from '../../components/drill-card/drill-card.component';

@Component({
  selector: 'app-drill-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, DrillCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-24 md:pb-12">

      @if (drill(); as drillData) {

        <div class="relative bg-white md:bg-gray-50">

          <div class="hidden md:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button (click)="goBack()"
                    class="flex items-center text-green-700 hover:text-green-800 font-bold transition-colors group">
              <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              {{ 'DRILL_DETAIL.BACK_TO_CATALOG' | translate }}
            </button>
          </div>

          <div class="max-w-6xl mx-auto md:px-6 lg:px-8">
            <div
              class="bg-white md:rounded-2xl shadow-sm md:shadow-md border-b md:border border-gray-200 overflow-hidden">
              <div class="grid md:grid-cols-2 gap-0">

                <div class="relative aspect-video md:aspect-auto md:h-full min-h-[250px] overflow-hidden bg-gray-200">
                  <button (click)="goBack()"
                          class="md:hidden absolute top-4 left-4 z-30 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>

                  <img
                    [src]="drillData.imageUrl || 'assets/images/drills_images_preview/drill_placeholder.jpg'"
                    [alt]="drillData.name"
                    class="w-full h-full object-cover"
                  />

                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                  <div class="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                     <span
                       class="md:hidden inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-md text-gray-900 shadow-sm">
                        <span class="w-4 h-4 mr-1.5" [innerHTML]="getCategoryIcon(drillData)"></span>
                       {{ translationHelper.getCategoryLabel(drillData.category) }}
                     </span>

                    <span
                      [class]="getLevelBadgeClass(drillData) + ' shadow-lg backdrop-blur-md border border-white/20'">
                        <span class="w-4 h-4" [innerHTML]="getLevelIcon(drillData)"></span>
                      {{ translationHelper.getLevelLabel(drillData.level) }}
                     </span>
                  </div>
                </div>

                <div class="p-5 md:p-8 flex flex-col">
                  <h1 class="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2 leading-tight">
                    {{ drillData.name }}
                  </h1>

                  <div class="flex items-center gap-2 mb-6">
                    <span
                      class="text-sm text-gray-500 font-medium">Drill ID: #{{ drillData.id.substring(0, 11) }}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="bg-green-50 rounded-xl p-3 md:p-4 border border-green-100 flex flex-col justify-center">
                      <div
                        class="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">{{ 'DRILL_DETAIL.DURATION' | translate }}
                      </div>
                      <div class="text-lg md:text-xl font-bold text-green-800 flex items-center">
                        <svg class="w-5 h-5 mr-1.5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ drillData.duration }} {{ 'DRILL_DETAIL.MINUTES' | translate }}
                      </div>
                    </div>

                    <div
                      class="hidden md:flex bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100 flex-col justify-center">
                      <div
                        class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{{ 'DRILL_DETAIL.CATEGORY' | translate }}
                      </div>
                      <div class="text-lg font-bold text-gray-800 flex items-center">
                        <span class="w-5 h-5 mr-2" [innerHTML]="getCategoryIcon(drillData)"></span>
                        {{ translationHelper.getCategoryLabel(drillData.category) }}
                      </div>
                    </div>

                    @if (drillData.videoUrl) {
                      <button (click)="openVideo()"
                              class="col-span-1 md:col-span-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl p-3 flex items-center justify-center transition-colors shadow-sm group">
                        <div
                          class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <span class="font-bold">{{ 'DRILL_DETAIL.WATCH_VIDEO' | translate }}</span>
                      </button>
                    }
                  </div>

                  <div class="hidden md:block mt-auto">
                    <button
                      class="btn-primary w-full py-3 text-lg shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      {{ 'DRILL_DETAIL.ADD_TO_TRAINING' | translate }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid md:grid-cols-3 gap-8">

            <div class="md:col-span-2 space-y-8">

              <section>
                <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span
                    class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                      stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
                  </span>
                  {{ 'DRILL_DETAIL.DESCRIPTION' | translate }}
                </h2>
                <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-gray-700 leading-relaxed">
                  {{ drillData.description }}
                </div>
              </section>

              @if (drillData.instructions?.length) {
                <section>
                  <h2 class="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span
                      class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    </span>
                    {{ 'DRILL_DETAIL.INSTRUCTIONS' | translate }}
                  </h2>
                  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <ol class="space-y-3">
                      @for (step of drillData.instructions; track $index) {
                        <li class="flex items-start gap-3">
                          <span
                            class="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center mt-0.5">{{ $index + 1 }}</span>
                          <span class="text-gray-700">{{ step }}</span>
                        </li>
                      }
                    </ol>
                  </div>
                </section>
              }
            </div>

            <div class="space-y-6">

              @if (drillData.equipment?.length) {
                <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    {{ 'DRILL_DETAIL.EQUIPMENT' | translate }}
                  </h3>
                  <ul class="space-y-2">
                    @for (item of drillData.equipment; track $index) {
                      <li class="flex items-center text-sm text-gray-700">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        {{ item }}
                      </li>
                    }
                  </ul>
                </div>
              }

              @if (drillData.coachingTips?.length) {
                <div
                  class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-sm border border-green-100">
                  <h3 class="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {{ 'DRILL_DETAIL.TIPS' | translate }}
                  </h3>
                  <ul class="space-y-3">
                    @for (tip of drillData.coachingTips; track $index) {
                      <li class="flex items-start gap-2 text-sm text-green-800">
                        <svg class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {{ tip }}
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>

          @if (relatedDrills().length > 0) {
            <div class="mt-12 pt-8 border-t border-gray-200">
              <h2
                class="text-2xl font-display font-bold text-gray-900 mb-6">{{ 'DRILL_DETAIL.RELATED_DRILLS' | translate }}</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (relatedDrill of relatedDrills(); track relatedDrill.id) {
                  <app-drill-card [drill]="relatedDrill" (cardClick)="onRelatedDrillClick($event)"/>
                }
              </div>
            </div>
          }
        </div>

        <div
          class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe-area">
          <button
            class="btn-primary w-full py-3.5 text-base shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            {{ 'DRILL_DETAIL.ADD_TO_TRAINING' | translate }}
          </button>
        </div>

      } @else {
        <div class="min-h-screen flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mb-4"></div>
          <p class="text-gray-500 font-medium animate-pulse">Loading details...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .pb-safe-area {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
  `]
})
export class DrillDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly drillService = inject(DrillService);
  readonly translationHelper = inject(TranslationHelperService);
  private readonly drillUi = inject(DrillUiService);

  drill = signal<Drill | null>(null);
  relatedDrills = signal<Drill[]>([]);

  ngOnInit(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDrill(id);
    }
  }

  private loadDrill(id: string): void {
    this.drillService.getDrillById(id).subscribe(drillData => {
      if (drillData) {
        this.drill.set(drillData);
        this.loadRelatedDrills();
      } else {
        this.router.navigate(['/catalog']);
      }
    });
  }

  private loadRelatedDrills(): void {
    const currentDrill = this.drill();
    if (!currentDrill) return;

    this.drillService.filterAndSearchDrills(undefined, currentDrill.category, undefined).subscribe(drills => {
      this.relatedDrills.set(drills.filter(d => d.id !== currentDrill.id).slice(0, 3));
    });
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  openVideo(): void {
    const currentDrill = this.drill();
    if (currentDrill?.videoUrl) {
      window.open(currentDrill.videoUrl, '_blank');
    }
  }

  onRelatedDrillClick(drillData: Drill): void {
    this.router.navigate(['/catalog', drillData.id]);
    this.loadDrill(drillData.id);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  getLevelBadgeClass(drillData: Drill): string {
    return 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ' + this.drillUi.getLevelStyle(drillData.level);
  }

  getCategoryIcon(drillData: Drill): SafeHtml {
    return this.drillUi.getCategoryIcon(drillData.category);
  }

  getLevelIcon(drillData: Drill): SafeHtml {
    return this.drillUi.getLevelIcon(drillData.level);
  }
}
