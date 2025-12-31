import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SafeHtml } from '@angular/platform-browser';
import { startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { DrillService } from '../../services/drill/drill.service';
import { TranslationHelperService } from '../../services/translation-helper.service';
import { DrillUiService } from '../../services/drill/drill-ui.service';
import { TrainingBuilderService } from '../../services/training/training-builder.service';
import { ToastService } from '../../services/toast.service';
import { Drill, FirestoreDrill } from '../../models/drill.model';
import { DrillCardComponent } from '../../components/drill-card/drill-card.component';
import { DrillDetailSkeletonComponent } from '../../components/drill-detail-skeleton/drill-detail-skeleton.component';
import { LocalizedDrillPipe } from '../../core/pipes/localized-drill.pipe';
import { VideoPlayerModalComponent } from '../../components/video-player-modal/video-player-modal.component';
import { APP_ROUTES } from '../../core/constants/routes';

@Component({
  selector: 'app-drill-detail',
  standalone: true,
  imports: [RouterModule, TranslateModule, DrillCardComponent, DrillDetailSkeletonComponent, LocalizedDrillPipe, VideoPlayerModalComponent],
  templateUrl: './drill-detail.component.html',
  styles: [`
    .pb-safe-area {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
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
export class DrillDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly drillService = inject(DrillService);
  readonly translationHelper = inject(TranslationHelperService);
  readonly drillUi = inject(DrillUiService);
  private readonly trainingBuilder = inject(TrainingBuilderService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  private destroy$ = new Subject<void>();

  drill = signal<FirestoreDrill | null>(null);

  private readonly PLACEHOLDER_IMAGE = 'assets/images/logo.png';

  get getImageUrl(): string {
    return this.drill()?.imageUrl || this.PLACEHOLDER_IMAGE;
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadDrill(id);
    } else {
      this.router.navigate([APP_ROUTES.CATALOG]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDrill(id: string): void {
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.currentLang }),
      switchMap(() => this.drillService.getDrillById(id)),
      takeUntil(this.destroy$)
    ).subscribe(drillData => {
      if (drillData) {
        this.drill.set(drillData);
      } else {
        this.router.navigate([APP_ROUTES.CATALOG]);
      }
    });
  }

  relatedDrills = computed(() => {
    const currentDrill = this.drill();
    if (!currentDrill) {
      return [];
    }

    return this.drillService.filterAndSearchDrills(undefined, currentDrill.category as any, undefined)
      .filter(d => d.id !== currentDrill.id)
      .slice(0, 3);
  });

  goBack(): void {
    this.router.navigate([APP_ROUTES.CATALOG]);
  }

  @ViewChild(VideoPlayerModalComponent) videoPlayer!: VideoPlayerModalComponent;

  openVideo(url: string) {
    if (this.videoPlayer) {
      this.videoPlayer.open(url);
    }
  }


  onRelatedDrillClick(drillData: Drill | FirestoreDrill): void {
    this.router.navigate([APP_ROUTES.CATALOG_DETAIL(drillData.id)]);
    this.loadDrill(drillData.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getLevelBadgeStyles(drillData: FirestoreDrill): string {
    return 'flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-black shadow-lg backdrop-blur-xl border border-white/20 uppercase tracking-widest ' + this.drillUi.getLevelStyle(drillData.level);
  }

  getCategoryBadgeStyles(drillData: FirestoreDrill): string {
    return 'flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-black shadow-lg backdrop-blur-xl border border-white/20 uppercase tracking-widest ' + this.drillUi.getCategoryStyle(drillData.category);
  }

  getCategoryIcon(drillData: FirestoreDrill): SafeHtml {
    return this.drillUi.getCategoryIcon(drillData.category);
  }

  getLevelIcon(drillData: FirestoreDrill): SafeHtml {
    return this.drillUi.getLevelIcon(drillData.level);
  }

  addToTraining(): void {
    const currentDrill = this.drill();
    if (!currentDrill) {
      return;
    }

    const flattenedDrill = this.flattenDrillForTraining(currentDrill);
    const wasAdded = this.trainingBuilder.addDrill(flattenedDrill);

    if (wasAdded) {
      this.toastService.success(this.translate.instant('DRILL_DETAIL.DRILL_ADDED'));
    } else {
      this.toastService.error(this.translate.instant('DRILL_DETAIL.DRILL_ALREADY_EXISTS'));
    }
  }

  private flattenDrillForTraining(drill: FirestoreDrill): Drill {
    const currentLang = this.translate.currentLang || 'en';
    const safeLang = (currentLang === 'uk' || currentLang === 'en') ? currentLang : 'en';
    const translation = drill.translations?.[safeLang] || drill.translations?.['en'];

    return {
      id: drill.id,
      duration: drill.duration,
      category: drill.category,
      level: drill.level,
      imageUrl: drill.imageUrl,
      videoUrl: drill.videoUrl,
      equipment: translation?.equipment || [],
      createdAt: drill.createdAt,
      updatedAt: drill.updatedAt,
      name: translation?.name || 'Unknown Drill',
      description: translation?.description || '',
      instructions: translation?.instructions || [],
      coachingTips: translation?.coachingTips || []
    };
  }
}
