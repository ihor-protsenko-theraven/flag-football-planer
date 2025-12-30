import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {FirestorePlays, Play} from '../../models/plays.model';
import {LocalizedPlayPipe} from '../../core/pipes/localized-play.pipe';
import {APP_ROUTES} from '../../core/constants/routes';

@Component({
  selector: 'app-combination-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, LocalizedPlayPipe],
  template: `
    <div (click)="navigateToDetail()"
         class="group relative bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 cursor-pointer h-full flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98]">

      <!-- Image / Diagram -->
      <div class="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img [src]="getImageUrl"
             [alt]="(play | localizedPlay)?.name"
             class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
             loading="lazy">

        <!-- Overlay Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <!-- Category Badge (Top Left) -->
        <div class="absolute top-4 left-4">
          <span
            class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-blue-600/90 text-white border border-blue-400/30">
             {{ 'COMBINATIONS.CATEGORIES.' + play.category.toUpperCase() | translate }}
          </span>
        </div>

        <!-- Complexity Dot (Top Right) -->
        <div class="absolute top-4 right-4">
          <div
            class="flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/40 border border-white/10">
            <span [class]="'w-2 h-2 rounded-full ' + getComplexityColor(play.complexity)"></span>
            <span class="text-[10px] font-bold text-white uppercase tracking-wider">
              {{ 'COMBINATIONS.COMPLEXITY.' + play.complexity.toUpperCase() | translate }}
            </span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col flex-1">
        <div
          class="flex items-center gap-2 mb-3 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider">
          <span>{{ play.personnel }}</span>
          <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>{{ play.formation }}</span>
        </div>

        <h3
          class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ (play | localizedPlay)?.name }}
        </h3>

        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">
          {{ (play | localizedPlay)?.description }}
        </p>

        <!-- Footer -->
        <div
          class="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between group/footer">
          <span
            class="text-blue-600 dark:text-blue-400 text-sm font-bold">{{ 'COMMON.VIEW_DETAILS' | translate }}</span>
          <div
            class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/footer:bg-blue-600 group-hover/footer:text-white transition-all duration-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host {
    display: block;
    height: 100%;
  } `]
})
export class PlayCardComponent {
  @Input({required: true}) play!: Play | FirestorePlays;

  private router = inject(Router);
  private readonly PLACEHOLDER_IMAGE = 'assets/images/logo.png';

  get getImageUrl(): string {
    return this.play.imageUrl || this.PLACEHOLDER_IMAGE;
  }

  getComplexityColor(complexity: string): string {
    switch (complexity) {
      case 'basic':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'intermediate':
        return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
      case 'pro':
        return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      default:
        return 'bg-slate-500';
    }
  }

  navigateToDetail() {
    this.router.navigate([APP_ROUTES.PLAY_DETAIL(this.play.id)]);
  }
}
