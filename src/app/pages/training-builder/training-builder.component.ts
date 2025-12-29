import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { filter } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafeHtml } from '@angular/platform-browser';

import { DrillService } from '../../services/drill/drill.service';
import { TrainingService } from '../../services/training/training.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { DrillUiService } from '../../services/drill/drill-ui.service';
import { TrainingBuilderService } from '../../services/training/training-builder.service';
import { ToastService } from '../../services/toast.service';

import { Drill, DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, DrillLevel } from '../../models/drill.model';

@Component({
  selector: 'app-training-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TranslateModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './training-builder.component.html',
  styles: [`
    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 0.75rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      background-color: white;
      padding: 1rem;
      border: 1px solid #22c55e;
      opacity: 0.95;
      z-index: 9999 !important;
      max-width: 800px;
      transform: scale(1.02);
      cursor: grabbing;
    }

    .custom-placeholder {
      background: #f0fdf4;
      border: 2px dashed #86efac;
      border-radius: 0.75rem;
      min-height: 120px;
      margin-bottom: 0.75rem;
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class TrainingBuilderComponent implements OnInit {
  private readonly drillService = inject(DrillService);
  private readonly trainingService = inject(TrainingService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly drillUi = inject(DrillUiService);
  private readonly trainingBuilder = inject(TrainingBuilderService);
  private readonly toastService = inject(ToastService);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  searchQuery = signal<string>('');
  selectedCategory = signal<DrillCategory | undefined>(undefined);
  selectedLevel = signal<DrillLevel | undefined>(undefined);

  // Form signals
  trainingName = signal('');
  trainingDescription = signal('');
  trainingLevel = signal<DrillLevel>('beginner');
  scheduledDate = signal<string>('');  // ISO date string for input[type="date"]
  scheduledTime = signal<string>('');  // Time string for input[type="time"]


  areFiltersActive = computed(() => {
    return this.searchQuery().trim() !== '' ||
      this.selectedCategory() !== undefined ||
      this.selectedLevel() !== undefined;
  });

  availableDrills = computed(() => {
    return this.drillService.filterAndSearchDrills(
      this.searchQuery(),
      this.selectedCategory(),
      this.selectedLevel()
    );
  });

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(undefined);
    this.selectedLevel.set(undefined);
  }

  // Use training builder service for state management
  trainingDrills = this.trainingBuilder.trainingDrills;
  totalDuration = this.trainingBuilder.totalDuration;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFilterChange(): void {
    // Computed signal handles updates automatically
  }

  addDrillToTraining(drill: Drill): void {
    const wasAdded = this.trainingBuilder.addDrill(drill);

    if (wasAdded) {
      this.toastService.success(this.translate.instant('DRILL_DETAIL.DRILL_ADDED'));
    } else {
      this.toastService.error(this.translate.instant('DRILL_DETAIL.DRILL_ALREADY_EXISTS'));
    }
  }

  onDurationChange(index: number, newDuration: number): void {
    if (newDuration && newDuration > 0) {
      this.trainingBuilder.updateDrillDuration(index, newDuration);
    }
  }

  removeDrill(index: number): void {
    this.trainingBuilder.removeDrill(index);
  }

  clearAllDrills(): void {
    this.confirmationService.confirm({
      title: this.translate.instant('CONFIRMATION.TITLE'),
      message: this.translate.instant('TRAINING_BUILDER.CONFIRM_CLEAR'),
      confirmText: this.translate.instant('TRAINING_BUILDER.CLEAR_ALL'),
      cancelText: this.translate.instant('CONFIRMATION.CANCEL')
    }).pipe(
      filter(confirmed => confirmed)
    ).subscribe(() => {
      this.trainingBuilder.clearAllDrills();
    });
  }

  onDragStarted(): void {
    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  onDrop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the plan
      if (event.previousIndex === event.currentIndex) return;
      this.trainingBuilder.reorderDrills(event.previousIndex, event.currentIndex);
    }
  }

  canSave(): boolean {
    return this.trainingName().trim().length > 0 && this.trainingDrills().length > 0;
  }

  saveTraining(): void {
    if (!this.canSave()) {
      this.toastService.error(this.translate.instant('TRAINING_BUILDER.SAVE_ERROR'));
      return;
    }

    const training = {
      name: this.trainingName(),
      description: this.trainingDescription(),
      level: this.trainingLevel(),
      scheduledDate: this.scheduledDate() ? new Date(this.scheduledDate()) : undefined,
      scheduledTime: this.scheduledTime() || undefined,
      drills: this.trainingDrills().map(({ instanceId, drill, ...rest }) => rest),  // Exclude UI-only fields
      totalDuration: this.totalDuration()
    };


    this.toastService.success(this.translate.instant('TRAINING_BUILDER.SAVE_SUCCESS'));
    this.trainingService.createTraining(training).subscribe(() => {
      this.router.navigate(['/trainings']);
    });
  }

  resetBuilder(): void {
    this.confirmationService.confirm({
      title: this.translate.instant('CONFIRMATION.TITLE'),
      message: this.translate.instant('TRAINING_BUILDER.CONFIRM_RESET'),
      confirmText: this.translate.instant('TRAINING_BUILDER.RESET'),
      cancelText: this.translate.instant('CONFIRMATION.CANCEL')
    }).pipe(
      filter(confirmed => confirmed)
    ).subscribe(() => {
      this.trainingName.set('');
      this.trainingDescription.set('');
      this.trainingLevel.set('beginner');
      this.scheduledDate.set('');
      this.scheduledTime.set('');
      this.trainingBuilder.clearAllDrills();
      this.searchQuery.set('');
      this.selectedCategory.set(undefined);
      this.selectedLevel.set(undefined);
    });
  }

  getCategoryStyle(category: DrillCategory | undefined): string {
    return this.drillUi.getCategoryStyle(category);
  }

  getLevelStyle(level: DrillLevel | undefined): string {
    return this.drillUi.getLevelStyle(level);
  }

  getCategoryIcon(category: DrillCategory | undefined): SafeHtml {
    return this.drillUi.getCategoryIcon(category);
  }

  getLevelIcon(level: DrillLevel | undefined): SafeHtml {
    return this.drillUi.getLevelIcon(level);
  }
}
