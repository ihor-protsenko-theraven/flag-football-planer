import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrainingService } from '../../services/training.service';
import { Training } from '../../models/training.model';

@Component({
  selector: 'app-my-trainings',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">{{ 'MY_TRAININGS.TITLE' | translate }}</h1>
            <p class="text-gray-600">{{ 'MY_TRAININGS.SUBTITLE' | translate }}</p>
          </div>
          <button routerLink="/builder" class="btn-primary">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ 'MY_TRAININGS.NEW_TRAINING_BTN' | translate }}
          </button>
        </div>

        <!-- Trainings List -->
        <div *ngIf="trainings.length > 0" class="space-y-4 animate-fade-in">
          <div
            *ngFor="let training of trainings"
            class="card hover:shadow-premium transition-all duration-200"
          >
            <div class="flex items-start justify-between gap-6 p-6">
              <!-- Training Info -->
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ training.name }}</h2>
                
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDate(training.createdAt) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold text-primary-600">{{ training.totalDuration }} minutes</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{{ training.drills.length }} {{ training.drills.length === 1 ? 'drill' : 'drills' }}</span>
                  </div>
                </div>

                <!-- Drill Preview -->
                <div class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let drill of training.drills.slice(0, 5)"
                    class="badge bg-gray-100 text-gray-700 text-xs"
                  >
                    Drill {{ drill.order + 1 }}
                  </span>
                  <span
                    *ngIf="training.drills.length > 5"
                    class="badge bg-gray-100 text-gray-700 text-xs"
                  >
                    +{{ training.drills.length - 5 }} more
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2">
                <button
                  [routerLink]="['/trainings', training.id]"
                  class="btn-primary text-sm px-4 py-2"
                >
                  {{ 'MY_TRAININGS.VIEW_DETAILS' | translate }}
                </button>
                <button
                  (click)="deleteTraining(training)"
                  class="btn-secondary text-sm px-4 py-2 text-red-600 hover:bg-red-50 border-red-300"
                >
                  {{ 'MY_TRAININGS.DELETE' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="trainings.length === 0" class="text-center py-16 animate-fade-in">
          <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ 'MY_TRAININGS.NO_TRAININGS_TITLE' | translate }}</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {{ 'MY_TRAININGS.NO_TRAININGS_DESC' | translate }}
          </p>
          <button routerLink="/builder" class="btn-primary">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {{ 'MY_TRAININGS.CREATE_FIRST_BTN' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MyTrainingsComponent implements OnInit {
  trainings: Training[] = [];

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings().subscribe(trainings => {
      this.trainings = trainings.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  deleteTraining(training: Training): void {
    const message = this.translate.instant('MY_TRAININGS.CONFIRM_DELETE', { name: training.name });
    if (confirm(message)) {
      this.trainingService.deleteTraining(training.id).subscribe(success => {
        if (success) {
          this.loadTrainings();
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }
}
