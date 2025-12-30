import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { startWith, Subject, takeUntil } from 'rxjs';

import { FirestorePlays } from '../../models/plays.model';
import { VideoPlayerModalComponent } from '../../components/video-player-modal/video-player-modal.component';
import { PlaysService } from '../../services/plays/plays.service';
import { PlaysUiService } from '../../services/plays/plays-ui.service';
import { LocalizedPlayPipe } from '../../core/pipes/localized-play.pipe';
import { APP_ROUTES } from '../../core/constants/routes';

@Component({
  selector: 'app-combination-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, VideoPlayerModalComponent, LocalizedPlayPipe],
  templateUrl: './play-detail.component.html',
})
export class PlayDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playsService = inject(PlaysService);
  private translate = inject(TranslateService);
  uiService = inject(PlaysUiService);

  private destroy$ = new Subject<void>();
  play = signal<FirestorePlays | null>(null);

  loader = signal(true);

  private readonly PLACEHOLDER_IMAGE = 'assets/images/logo.png';

  get getImageUrl(): string {
    return this.play()?.imageUrl || this.PLACEHOLDER_IMAGE;
  }

  @ViewChild(VideoPlayerModalComponent) videoPlayer!: VideoPlayerModalComponent;

  openVideo(url: string) {
    this.videoPlayer.open(url);
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.setupLangListener(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupLangListener(id: string): void {
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.currentLang }),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadCombination(id);
    });
  }

  loadCombination(id: string) {
    this.loader.set(true);
    this.playsService.getById(id).subscribe(data => {
      this.play.set(data || null);
      this.loader.set(false);
    });
  }

  goBack() {
    this.router.navigate([APP_ROUTES.PLAYS]);
  }
}

