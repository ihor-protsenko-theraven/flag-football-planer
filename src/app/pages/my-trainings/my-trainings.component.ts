import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {filter, switchMap} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SafeHtml} from '@angular/platform-browser';

import {TrainingService} from '../../services/training.service';
import {ConfirmationService} from '../../services/confirmation.service';
import {DrillUiService} from '../../services/drill-ui.service';
import {SkeletonCardComponent} from '../../components/skeleton-card/skeleton-card.component';
import {Training} from '../../models/training.model';
import {DRILL_LEVELS, DrillLevel} from '../../models/drill.model';

@Component({
  selector: 'app-my-trainings',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule, SkeletonCardComponent],
  templateUrl: './my-trainings.component.html',
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class MyTrainingsComponent implements OnInit {
  private readonly trainingService = inject(TrainingService);
  private readonly translate = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly drillUi = inject(DrillUiService);

  trainings = signal<Training[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedLevel = signal<DrillLevel | null>(null);

  levels = DRILL_LEVELS;

  filteredTrainings = computed(() => {
    let list = this.trainings();
    const query = this.searchQuery().toLowerCase().trim();
    const level = this.selectedLevel();

    if (query) {
      list = list.filter(t => t.name.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query));
    }

    if (level) {
      list = list.filter(t => t.level === level);
    }

    return list;
  });

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.isLoading.set(true);
    this.trainingService.getTrainings().subscribe(trainings => {
      this.trainings.set(
        trainings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      this.isLoading.set(false);
    });
  }

  deleteTraining(event: Event, training: Training): void {
    event.stopPropagation();
    const message = this.translate.instant('MY_TRAININGS.CONFIRM_DELETE', {name: training.name});
    this.confirmationService.confirm({
      title: this.translate.instant('CONFIRMATION.TITLE'),
      message: message,
      confirmText: this.translate.instant('MY_TRAININGS.DELETE'),
      cancelText: this.translate.instant('CONFIRMATION.CANCEL')
    }).pipe(
      filter(Boolean),
      switchMap(() => this.trainingService.deleteTraining(training.id))
    ).subscribe(success => {
      if (success) {
        this.loadTrainings();
      }
    });
  }

  editTraining(event: Event, training: Training): void {
    event.stopPropagation();
    this.router.navigate(['/trainings', training.id]);
  }

  formatDate(date: Date): string {
    const lang = this.translate.currentLang === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.DateTimeFormat(lang, {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(date));
  }

  formatScheduledDateTime(training: Training): string {
    if (!training.scheduledDate) {
      return this.translate.instant('MY_TRAININGS.NO_SCHEDULE');
    }

    try {
      // Handle different date formats (Date object, Firestore Timestamp, string)
      const dateObj = training.scheduledDate instanceof Date
        ? training.scheduledDate
        : new Date(training.scheduledDate as any);

      // Validate the date
      if (isNaN(dateObj.getTime())) {
        return this.translate.instant('MY_TRAININGS.NO_SCHEDULE');
      }

      const lang = this.translate.currentLang === 'uk' ? 'uk-UA' : 'en-US';
      const dateStr = new Intl.DateTimeFormat(lang, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);

      return training.scheduledTime
        ? `${dateStr}, ${training.scheduledTime}`
        : dateStr;
    } catch (error) {
      console.error('Error formatting scheduled date:', error);
      return this.translate.instant('MY_TRAININGS.NO_SCHEDULE');
    }
  }

  getLevelBadgeClass(level?: DrillLevel): string {
    return 'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ' + this.drillUi.getLevelStyle(level);
  }

  getLevelIcon(level?: DrillLevel): SafeHtml {
    return this.drillUi.getLevelIcon(level);
  }
}
