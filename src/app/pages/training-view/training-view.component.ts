import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafeHtml } from '@angular/platform-browser';

import { TrainingService } from '../../services/training/training.service';
import { DrillService } from '../../services/drill/drill.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { DrillUiService } from '../../services/drill/drill-ui.service';
import { Training } from '../../models/training.model';
import { Drill, DrillCategory, DrillLevel } from '../../models/drill.model';

@Component({
  selector: 'app-training-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './training-view.component.html',
  styles: [`
    .stat-card {
      @apply p-6 rounded-[2rem] border flex flex-col justify-center transition-all hover:scale-[1.02];
    }

    .stat-label {
      @apply text-[10px] font-black uppercase tracking-[0.2em] mb-2;
    }

    .stat-value {
      @apply text-3xl font-black flex items-baseline gap-2;
    }

    .stat-unit {
      @apply text-sm font-bold opacity-60;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
      animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class TrainingViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trainingService = inject(TrainingService);
  private readonly drillService = inject(DrillService);
  private readonly pdfExportService = inject(PdfExportService);
  private readonly translate = inject(TranslateService);
  private readonly drillUi = inject(DrillUiService);

  training = signal<Training | null>(null);
  drillsMap = signal<Map<string, Drill>>(new Map());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTraining(id);
      this.loadDrills();
    }
  }

  private loadTraining(id: string): void {
    this.trainingService.getTrainingById(id).subscribe(trainingData => {
      if (trainingData) {
        this.training.set(trainingData);
      } else {
        this.router.navigate(['/trainings']);
      }
    });
  }

  private loadDrills(): void {
    this.drillService.getDrills().subscribe(drills => {
      const map = new Map(drills.map(d => [d.id, d]));
      this.drillsMap.set(map);
    });
  }

  getDrill(drillId?: string): Drill | undefined {
    if (!drillId) return undefined;
    return this.drillsMap().get(drillId);
  }

  getSortedDrills(trainingData: Training) {
    return [...trainingData.drills].sort((a, b) => a.order - b.order);
  }

  getAverageDuration(trainingData: Training): number {
    if (trainingData.drills.length === 0) return 0;
    return Math.round(trainingData.totalDuration / trainingData.drills.length);
  }

  exportToPDF(): void {
    const trainingData = this.training();
    if (!trainingData) return;

    const drills = trainingData.drills
      .map(td => this.getDrill(td.drillId))
      .filter((d): d is Drill => d !== undefined);

    this.pdfExportService.exportTrainingToPDF(trainingData, drills);
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const lang = this.translate.currentLang === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  }

  getCategoryBadgeStyles(category?: DrillCategory): string {
    return 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ' + this.drillUi.getCategoryStyle(category);
  }

  getLevelBadgeStyles(level?: DrillLevel): string {
    return 'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ' + this.drillUi.getLevelStyle(level);
  }

  getCategoryIcon(category?: DrillCategory): SafeHtml {
    return this.drillUi.getCategoryIcon(category);
  }

  getLevelIcon(level?: DrillLevel): SafeHtml {
    return this.drillUi.getLevelIcon(level);
  }
}
