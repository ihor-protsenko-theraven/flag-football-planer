import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DrillService } from '../../services/drill.service';
import { TrainingService } from '../../services/training.service';
import { Drill, DrillCategory, DrillLevel, DRILL_CATEGORIES, DRILL_LEVELS } from '../../models/drill.model';
import { Training, TrainingDrill } from '../../models/training.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface BuilderDrill extends TrainingDrill {
  drill?: Drill;
}

@Component({
  selector: 'app-training-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">{{ 'TRAINING_BUILDER.TITLE' | translate }}</h1>
            <p class="text-slate-600 font-medium">{{ 'TRAINING_BUILDER.SUBTITLE' | translate }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button (click)="resetBuilder()" class="btn-secondary text-sm">
              {{ 'TRAINING_BUILDER.RESET' | translate }}
            </button>
            <button
              (click)="saveTraining()"
              [disabled]="!canSave()"
              [class.opacity-50]="!canSave()"
              [class.cursor-not-allowed]="!canSave()"
              class="btn-primary text-sm shadow-lg shadow-green-500/20"
            >
              {{ 'TRAINING_BUILDER.SAVE_TRAINING' | translate }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left: Drill Catalog (Compact) -->
          <div class="lg:col-span-4 xl:col-span-3">
            <div class="card sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
              <div class="p-4 border-b border-slate-100">
                <h2 class="text-lg font-bold text-slate-900 mb-3">{{ 'TRAINING_BUILDER.AVAILABLE_DRILLS' | translate }}</h2>

                <!-- Filters -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label class="block text-xs font-medium text-slate-500 mb-1">{{ 'TRAINING_BUILDER.CATEGORY_LABEL' | translate }}</label>
                    <select
                      [(ngModel)]="selectedCategory"
                      (ngModelChange)="applyFilters()"
                      class="input-field py-1.5 text-xs"
                    >
                      <option [value]="undefined">{{ 'TRAINING_BUILDER.ALL_CATEGORIES' | translate }}</option>
                      <option *ngFor="let cat of categories" [value]="cat.value">
                        {{ cat.translationKey | translate }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-500 mb-1">{{ 'TRAINING_BUILDER.LEVEL_LABEL' | translate }}</label>
                    <select
                      [(ngModel)]="selectedLevel"
                      (ngModelChange)="applyFilters()"
                      class="input-field py-1.5 text-xs"
                    >
                      <option [value]="undefined">{{ 'TRAINING_BUILDER.ALL_LEVELS' | translate }}</option>
                      <option *ngFor="let level of levels" [value]="level.value">
                        {{ level.translationKey | translate }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Quick Search -->
                <div class="relative">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="applyFilters()"
                    [placeholder]="'TRAINING_BUILDER.SEARCH_PLACEHOLDER' | translate"
                    class="input-field pl-9 text-sm"
                  />
                  <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor"
                       viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              <!-- Drill List -->
              <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                <div
                  *ngFor="let drill of availableDrills"
                  class="group p-3 bg-white rounded-xl hover:bg-slate-50 border border-slate-200 hover:border-green-200 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  (click)="addDrillToTraining(drill)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 min-w-0">
                      <h3
                        class="font-semibold text-sm text-slate-900 truncate group-hover:text-green-700 transition-colors">{{ drill.name }}</h3>
                      <div class="flex items-center gap-2 mt-1">
                        <span
                          class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">{{ drill.category }}</span>
                        <span class="text-xs text-slate-500">{{ drill.duration }} min</span>
                      </div>
                    </div>
                    <button
                      class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div *ngIf="availableDrills.length === 0" class="text-center py-8 text-slate-500 text-sm">
                  {{ 'TRAINING_BUILDER.NO_DRILLS' | translate }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Training Builder -->
          <div class="lg:col-span-8 xl:col-span-9 space-y-6">
            <!-- Training Details Card -->
            <div class="card p-6">
              <div class="flex flex-col md:flex-row gap-6 items-start">
                <div class="flex-1 w-full">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">{{ 'TRAINING_BUILDER.TRAINING_NAME_LABEL' | translate }}</label>
                  <input
                    type="text"
                    [(ngModel)]="trainingName"
                    [placeholder]="'TRAINING_BUILDER.TRAINING_NAME_PLACEHOLDER' | translate"
                    class="input-field text-lg font-medium"
                  />
                </div>

                <div class="flex gap-4 w-full md:w-auto">
                  <div class="flex-1 md:w-32 p-3 bg-green-50 rounded-xl border border-green-100 text-center">
                    <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">{{ 'TRAINING_BUILDER.DURATION' | translate }}</p>
                    <p class="text-2xl font-bold text-green-700">{{ totalDuration }}<span
                      class="text-sm font-medium ml-1">{{ 'TRAINING_BUILDER.MIN' | translate }}</span></p>
                  </div>
                  <div class="flex-1 md:w-32 p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{{ 'TRAINING_BUILDER.DRILLS' | translate }}</p>
                    <p class="text-2xl font-bold text-blue-700">{{ trainingDrills.length }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Drills in Training -->
            <div
              class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span class="text-xl">📋</span> {{ 'TRAINING_BUILDER.SESSION_PLAN' | translate }}
                </h2>
                <button
                  *ngIf="trainingDrills.length > 0"
                  (click)="clearAllDrills()"
                  class="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {{ 'TRAINING_BUILDER.CLEAR_ALL' | translate }}
                </button>
              </div>

              <!-- Drag and Drop List -->
              <div
                cdkDropList
                (cdkDropListDropped)="onDrop($event)"
                class="flex-1 p-4 space-y-3 bg-slate-50/30"
              >
                <div
                  *ngFor="let item of trainingDrills; let i = index"
                  cdkDrag
                  class="group bg-white border border-slate-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition-all cursor-move relative"
                >
                  <!-- Drag Handle -->
                  <div class="flex items-start gap-4">
                    <div cdkDragHandle class="text-slate-300 group-hover:text-green-500 pt-1 transition-colors">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                      </svg>
                    </div>

                    <div class="flex-1 min-w-0">
                      <!-- Drill Header -->
                      <div class="flex items-start justify-between gap-4 mb-3">
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span
                              class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">{{ i + 1 }}</span>
                            <h3 class="font-bold text-slate-900 text-lg">{{ item.drill?.name }}</h3>
                          </div>
                          <p class="text-sm text-slate-500 pl-8 line-clamp-1">{{ item.drill?.description }}</p>
                        </div>
                        <button
                          (click)="removeDrill(i)"
                          class="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Duration and Notes -->
                      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 pl-8">
                        <div class="md:col-span-3">
                          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{{ 'TRAINING_BUILDER.DURATION' | translate }}
                            ({{ 'TRAINING_BUILDER.MIN' | translate }})</label>
                          <input
                            type="number"
                            [(ngModel)]="item.duration"
                            (ngModelChange)="updateTotalDuration()"
                            min="1"
                            class="input-field py-1.5 text-sm font-semibold text-center"
                          />
                        </div>
                        <div class="md:col-span-9">
                          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{{ 'TRAINING_BUILDER.COACH_NOTES' | translate }}</label>
                          <input
                            type="text"
                            [(ngModel)]="item.notes"
                            [placeholder]="'TRAINING_BUILDER.NOTES_PLACEHOLDER' | translate"
                            class="input-field py-1.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="trainingDrills.length === 0"
                     class="h-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <span class="text-3xl">🏗️</span>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 mb-1">{{ 'TRAINING_BUILDER.START_BUILDING_TITLE' | translate }}</h3>
                  <p class="text-slate-500 max-w-xs mx-auto">{{ 'TRAINING_BUILDER.START_BUILDING_DESC' | translate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cdk-drag-preview {
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      opacity: 0.9;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class TrainingBuilderComponent implements OnInit {
  availableDrills: Drill[] = [];
  drills: Drill[] = []; // Holds all drills fetched from the service
  searchQuery: string = '';
  selectedCategory?: DrillCategory;
  selectedLevel?: DrillLevel;

  categories = DRILL_CATEGORIES;
  levels = DRILL_LEVELS;

  trainingName: string = '';
  trainingDrills: BuilderDrill[] = [];
  totalDuration: number = 0;

  constructor(
    private drillService: DrillService,
    private trainingService: TrainingService,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.loadDrills();
  }

  loadDrills(): void {
    this.drillService.getDrills().subscribe(drills => {
      this.drills = drills;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.drillService.filterAndSearchDrills(
      this.searchQuery,
      this.selectedCategory,
      this.selectedLevel
    ).subscribe(filtered => {
      this.availableDrills = filtered;
    });
  }

  addDrillToTraining(drill: Drill): void {
    const newDrill: BuilderDrill = {
      drillId: drill.id,
      duration: drill.duration,
      notes: '',
      order: this.trainingDrills.length,
      drill: drill
    };

    this.trainingDrills.push(newDrill);
    this.updateTotalDuration();
  }

  removeDrill(index: number): void {
    this.trainingDrills.splice(index, 1);
    this.updateOrders();
    this.updateTotalDuration();
  }

  clearAllDrills(): void {
    if (confirm(this.translate.instant('TRAINING_BUILDER.CONFIRM_CLEAR'))) {
      this.trainingDrills = [];
      this.updateTotalDuration();
    }
  }

  onDrop(event: CdkDragDrop<BuilderDrill[]>): void {
    moveItemInArray(this.trainingDrills, event.previousIndex, event.currentIndex);
    this.updateOrders();
  }

  updateOrders(): void {
    this.trainingDrills.forEach((drill, index) => {
      drill.order = index;
    });
  }

  updateTotalDuration(): void {
    this.totalDuration = this.trainingDrills.reduce((sum, drill) => sum + (drill.duration || 0), 0);
  }

  canSave(): boolean {
    return this.trainingName.trim().length > 0 && this.trainingDrills.length > 0;
  }

  saveTraining(): void {
    if (!this.canSave()) {
      alert(this.translate.instant('TRAINING_BUILDER.SAVE_ERROR'));
      return;
    }

    const training = {
      name: this.trainingName,
      drills: this.trainingDrills.map(({ drill, ...rest }) => rest),
      totalDuration: this.totalDuration
    };

    this.trainingService.createTraining(training).subscribe(saved => {
      alert(this.translate.instant('TRAINING_BUILDER.SAVE_SUCCESS'));
      this.router.navigate(['/trainings']);
    });
  }

  resetBuilder(): void {
    if (confirm(this.translate.instant('TRAINING_BUILDER.CONFIRM_RESET'))) {
      this.trainingName = '';
      this.trainingDrills = [];
      this.searchQuery = '';
      this.selectedCategory = undefined;
      this.selectedLevel = undefined;
      this.applyFilters();
      this.updateTotalDuration();
    }
  }
}
