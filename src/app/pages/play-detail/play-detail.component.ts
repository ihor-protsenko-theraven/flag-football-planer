import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Play } from '../../models/plays.model';
import { VideoPlayerModalComponent } from '../../components/video-player-modal/video-player-modal.component';
import { PlaysService } from '../../services/plays/plays.service';
import { PlaysUiService } from '../../services/plays/plays-ui.service';

@Component({
  selector: 'app-combination-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, VideoPlayerModalComponent],
  templateUrl: './play-detail.component.html',
})
export class PlayDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playsService = inject(PlaysService);
  uiService = inject(PlaysUiService);

  play = signal<Play | null>(null);

  loader = signal(true);

  @ViewChild(VideoPlayerModalComponent) videoPlayer!: VideoPlayerModalComponent;

  openVideo(url: string) {
    this.videoPlayer.open(url);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCombination(id);
      }
    });
  }

  loadCombination(id: string) {
    this.loader.set(true);
    this.playsService.getCombinationById(id).subscribe(data => {
      this.play.set(data || null);
      this.loader.set(false);
    });
  }

  goBack() {
    this.router.navigate(['/plays']);
  }
}
