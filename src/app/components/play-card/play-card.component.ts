import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirestorePlays, Play } from '../../models/plays.model';
import { LocalizedPlayPipe } from '../../core/pipes/localized-play.pipe';
import { APP_ROUTES } from '../../core/constants/routes';
import { PlaysUiService } from '../../services/plays/plays-ui.service';

@Component({
  selector: 'app-combination-card',
  standalone: true,
  imports: [TranslateModule, LocalizedPlayPipe],
  templateUrl: './play-card.component.html',
  styles: [`:host {
    display: block;
    height: 100%;
  } `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayCardComponent {
  @Input({ required: true }) play!: Play | FirestorePlays;

  private router = inject(Router);
  protected uiService = inject(PlaysUiService);
  private readonly PLACEHOLDER_IMAGE = 'assets/images/logo.png';

  get getImageUrl(): string {
    return this.play.imageUrl || this.PLACEHOLDER_IMAGE;
  }



  navigateToDetail() {
    this.router.navigate([APP_ROUTES.PLAY_DETAIL(this.play.id)]);
  }
}
