import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {filter, switchMap} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {TrainingService} from '../../services/training.service';
import {ConfirmationService} from '../../services/confirmation.service';
import {Training} from '../../models/training.model';

@Component({
  selector: 'app-my-trainings',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-4 md:py-8 pb-24 md:pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 class="text-2xl md:text-4xl font-display font-bold text-gray-900 mb-1 md:mb-2">
              {{ 'MY_TRAININGS.TITLE' | translate }}
            </h1>
            <p class="text-gray-500 text-sm md:text-base">
              {{ 'MY_TRAININGS.SUBTITLE' | translate }}
            </p>
          </div>
          <button routerLink="/builder" class="hidden md:inline-flex btn-primary shadow-lg shadow-green-500/20">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ 'MY_TRAININGS.NEW_TRAINING_BTN' | translate }}
          </button>
        </div>

        @if (trainings().length > 0) {
          <div class="space-y-4 animate-fade-in">
            @for (training of trainings(); track training.id) {
              <div
                class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div class="p-4 md:p-6 flex flex-col md:flex-row gap-4">

                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-3">
                      <h2 class="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 pr-2">
                        {{ training.name }}
                      </h2>
                      <span class="text-xs font-medium text-gray-400 md:hidden whitespace-nowrap pt-1">
                        {{ formatDate(training.createdAt) }}
                      </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 mb-4">
                      <div class="hidden md:flex items-center gap-1 text-sm text-gray-500 mr-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ formatDate(training.createdAt) }}</span>
                      </div>

                      <div
                        class="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-100">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>{{ training.totalDuration }} min</span>
                      </div>

                      <div
                        class="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <span>{{ training.drills.length }} drills</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mt-2 pt-3 border-t border-gray-50 md:border-t-0 md:pt-0">
                      @for (drill of getVisibleDrills(training); track drill.order) {
                        <span
                          class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 font-medium">
                          {{ ('Drill ' + (drill.order + 1)) }}
                        </span>
                      }
                      @if (training.drills.length > 5) {
                        <span class="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded border border-gray-200">
                          +{{ training.drills.length - 5 }}
                        </span>
                      }
                    </div>
                  </div>

                  <div
                    class="flex md:flex-col gap-3 md:gap-2 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button
                      [routerLink]="['/trainings', training.id]"
                      class="flex-1 md:flex-none btn-secondary text-sm justify-center py-2.5 px-4 hover:bg-gray-100 border border-gray-200"
                    >
                      {{ 'MY_TRAININGS.VIEW_DETAILS' | translate }}
                    </button>
                    <button
                      (click)="deleteTraining(training)"
                      class="flex-1 md:flex-none btn-danger-outline text-sm justify-center py-2.5 px-4"
                    >
                      {{ 'MY_TRAININGS.DELETE' | translate }}
                    </button>
                  </div>

                </div>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span class="text-4xl">📋</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ 'MY_TRAININGS.NO_TRAININGS_TITLE' | translate }}
            </h3>
            <p class="text-gray-500 max-w-xs mx-auto mb-8 text-sm md:text-base">
              {{ 'MY_TRAININGS.NO_TRAININGS_DESC' | translate }}
            </p>
            <button routerLink="/builder" class="btn-primary px-8">
              {{ 'MY_TRAININGS.CREATE_FIRST_BTN' | translate }}
            </button>
          </div>
        }
      </div>

      <button
        routerLink="/builder"
        class="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-900/30 flex items-center justify-center active:scale-95 transition-transform"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>

    </div>
  `,
  styles: [`
    .btn-danger-outline {
      @apply border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-colors rounded-lg font-medium;
    }
  `]
})
export class MyTrainingsComponent implements OnInit {
  private readonly trainingService = inject(TrainingService);
  private readonly translate = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);

  trainings = signal<Training[]>([]);

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings().subscribe(trainings => {
      this.trainings.set(
        trainings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    });
  }

  deleteTraining(training: Training): void {
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
      if (success) this.loadTrainings();
    });
  }

  getVisibleDrills(training: Training) {
    return training.drills.slice(0, 5);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('uk-UA', {day: 'numeric', month: 'short'}).format(new Date(date));
  }
}
