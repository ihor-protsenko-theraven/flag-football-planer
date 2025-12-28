
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Combination } from '../../models/combination.model';
import { CombinationUiService } from '../../services/combination/combination-ui.service';

@Component({
  selector: 'app-combination-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div (click)="navigateToDetail()"
         class="group relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-950/50 border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col">

      <!-- Image / Diagram -->
      <div class="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" *ngIf="!drill"></div>
        <img [src]="drill.imageUrl || 'assets/images/placeholder_combination.jpg'"
             [alt]="drill.name"
             class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
             loading="lazy">

        <!-- Overlay Gradient -->
        <div
          class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

        <!-- Badges (Bottom Left) -->
        <div class="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/20 text-white border border-white/20">
              {{ drill.personnel }}
            </span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-black/40 text-white border border-white/10">
              {{ drill.formation }}
            </span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5 flex flex-col flex-1">
        <!-- Tags Header -->
        <div class="flex items-center gap-2 mb-3">
          <span
            [class]="'px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ' + uiService.getCategoryStyle(drill.category)">
             {{ 'COMBINATIONS.CATEGORIES.' + drill.category.toUpperCase() | translate }}
          </span>
          <span
            [class]="'ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 ' + uiService.getComplexityStyle(drill.complexity)">
            {{ 'COMBINATIONS.COMPLEXITY.' + drill.complexity.toUpperCase() | translate }}
          </span>
        </div>

        <h3
          class="text-xl font-display font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {{ drill.name }}
        </h3>

        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
          {{ drill.description }}
        </p>

        <!-- Key Points (Mini) -->
        <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800" *ngIf="drill.keyPoints?.length">
          <ul class="space-y-1">
            <li *ngFor="let point of drill.keyPoints | slice:0:2"
                class="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span class="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
              <span class="truncate">{{ point }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100 %; } `]
})
export class CombinationCardComponent {
  @Input({ required: true }) drill!: Combination;

  uiService = inject(CombinationUiService);
  private router = inject(Router);

  navigateToDetail() {
    this.router.navigate(['/combinations', this.drill.id]);
  }
}
