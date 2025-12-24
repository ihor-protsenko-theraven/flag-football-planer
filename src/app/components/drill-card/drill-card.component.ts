import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Drill, DRILL_CATEGORIES, DRILL_LEVELS } from '../../models/drill.model';

@Component({
  selector: 'app-drill-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="card group cursor-pointer h-full flex flex-col relative overflow-hidden" (click)="onCardClick()">
      <!-- Hover Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
      </div>

      <!-- Drill Image -->
      <div class="relative overflow-hidden h-48 shrink-0">
        <!-- Skeleton Loader -->
        @if (!imageLoaded()) {
          <div class="absolute inset-0 bg-slate-200 animate-pulse z-10"></div>
        }

        <!-- Main Image -->
        <img
          [src]="getImageUrl()"
          [alt]="drill.name"
          loading="lazy"
          (load)="onImageLoad()"
          (error)="onImageError()"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <!-- Level Badge -->
        <div class="absolute top-3 right-3 z-20">
          <span [class]="getLevelBadgeClass() + ' shadow-sm backdrop-blur-sm'">
            {{ getLevelTranslationKey(drill.level) | translate }}
          </span>
        </div>
      </div>

      <!-- Drill Info -->
      <div class="p-5 flex-1 flex flex-col space-y-3">
        <div class="flex items-start justify-between gap-3">
          <h3
            class="font-display font-semibold text-lg text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
            {{ drill.name }}
          </h3>
          <span
            class="flex items-center text-green-600 font-bold text-sm whitespace-nowrap bg-green-50 px-2 py-1 rounded-lg">
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ drill.duration }} min
          </span>
        </div>

        <p class="text-sm text-slate-600 line-clamp-2 flex-1 leading-relaxed">
          {{ drill.description }}
        </p>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span [class]="getCategoryBadgeClass()">
            {{ getCategoryTranslationKey(drill.category) | translate }}
          </span>

          @if (showAddButton) {
            <button
              (click)="onAddClick($event)"
              class="btn-primary text-xs px-3 py-1.5 shadow-none hover:shadow-md"
            >
              Add
              <svg class="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class DrillCardComponent {
  @Input() drill!: Drill;
  @Input() showAddButton = false;
  @Output() cardClick = new EventEmitter<Drill>();
  @Output() addClick = new EventEmitter<Drill>();

  imageLoaded = signal(false);

  private readonly PLACEHOLDER_IMAGE = 'assets/images/drills_images_preview/drill_placeholder.jpg';

  getImageUrl(): string {
    return this.drill.imageUrl || this.PLACEHOLDER_IMAGE;
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  onImageError(): void {
    // Якщо основна картинка не завантажилась, показуємо placeholder
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
    const baseClass = 'badge text-white font-medium tracking-wide';
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
    const baseClass = 'badge border';
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

  getCategoryTranslationKey(value: string): string {
    return DRILL_CATEGORIES.find(c => c.value === value)?.translationKey || value;
  }

  getLevelTranslationKey(value: string): string {
    return DRILL_LEVELS.find(l => l.value === value)?.translationKey || value;
  }
}
