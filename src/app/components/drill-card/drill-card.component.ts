import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {SafeHtml} from '@angular/platform-browser';
import {Drill, FirestoreDrill} from '../../models/drill.model';
import {DrillUiService} from '../../services/drill/drill-ui.service';
import {LocalizedDrillPipe} from '../../core/pipes/localized-drill.pipe';

@Component({
  selector: 'app-drill-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, LocalizedDrillPipe],
  template: `
    <div
      class="group relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md dark:hover:shadow-slate-950/50 hover:-translate-y-1 active:scale-[0.98] active:shadow-sm"
      (click)="onCardClick()"
    >

      <div class="relative w-full aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-slate-800">
        @if (!imageLoaded()) {
          <div class="absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse z-10"></div>
        }

        <img
          [src]="getImageUrl"
          [alt]="(drill | localizedDrill)?.name || 'Drill image'"
          loading="lazy"
          (load)="onImageLoad()"
          (error)="onImageError()"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          [class.opacity-0]="!imageLoaded()"
          [class.opacity-100]="imageLoaded()"
        />

        <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

        <div class="absolute top-3 right-3 z-20">
          <span [class]="getLevelBadgeClass() + ' shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-80'">
            {{ drillUi.getLevelTranslationKey(drill.level) | translate }}
          </span>
        </div>
      </div>

      <div class="p-4 md:p-5 flex-1 flex flex-col">

        <div class="flex items-start justify-between gap-3 mb-2">
          <h3
            class="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            {{ (drill | localizedDrill)?.name }}
          </h3>
          <span
            class="shrink-0 flex items-center text-xs font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-gray-200 dark:border-slate-700">
            <svg class="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24"><path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ drill.duration }} min
          </span>
        </div>

        <p class="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {{ (drill | localizedDrill)?.description }}
        </p>

        <div class="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">

          <span [class]="getCategoryBadgeClass()">
            <span class="w-3.5 h-3.5" [innerHTML]="getCategoryIcon()"></span>
            {{ drillUi.getCategoryTranslationKey(drill.category) | translate }}
          </span>

          @if (showAddButton) {
            <button
              (click)="onAddClick($event)"
              class="btn-primary text-xs py-2 px-3.5 shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5 transition-all"
            >
              Add
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DrillCardComponent {
  @Input({required: true}) drill!: Drill | FirestoreDrill;
  @Input() showAddButton = false;
  @Output() cardClick = new EventEmitter<Drill | FirestoreDrill>();
  @Output() addClick = new EventEmitter<Drill | FirestoreDrill>();

  imageLoaded = signal(false);

  protected readonly drillUi = inject(DrillUiService);

  private readonly PLACEHOLDER_IMAGE = 'assets/images/logo.png';

  get getImageUrl(): string {
    return this.drill.imageUrl || this.PLACEHOLDER_IMAGE;
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  onImageError(): void {
    this.imageLoaded.set(true);
  }

  onCardClick(): void {
    this.cardClick.emit(this.drill);
  }

  onAddClick(event: Event): void {
    event.stopPropagation();
    this.addClick.emit(this.drill);
  }

  getLevelBadgeClass(): string {
    return `badge text-[10px] uppercase tracking-wider font-bold px-2 py-1 border border-white/20 ` + this.drillUi.getLevelStyle(this.drill.level);
  }

  getCategoryBadgeClass(): string {
    return `badge text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 border transition-colors ` + this.drillUi.getCategoryStyle(this.drill.category);
  }

  getCategoryIcon(): SafeHtml {
    return this.drillUi.getCategoryIcon(this.drill.category);
  }
}
