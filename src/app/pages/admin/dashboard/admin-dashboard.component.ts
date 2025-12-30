import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {APP_ROUTES} from '../../../core/constants/routes';
import {DrillService} from '../../../services/drill/drill.service';
import {PlaysService} from '../../../services/plays/plays.service';
import {AdminStat} from '../../../models/admin-stats.model';
import {TrainingService} from '../../../services/training/training.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly drillService = inject(DrillService);
  private readonly playsService = inject(PlaysService);
  private readonly trainingService = inject(TrainingService);
  protected readonly APP_ROUTES = APP_ROUTES;

  public readonly adminStats = computed<AdminStat[]>(() => [
    {
      title: 'ADMIN_DASHBOARD.STATS.TOTAL_DRILLS',
      value: this.drillService.drills().length,
      icon: 'pi pi-book',
    },
    {
      title: 'ADMIN_DASHBOARD.STATS.TOTAL_PLAYS',
      value: this.playsService.plays().length,
      icon: 'pi pi-map',

    },
    {
      title: 'ADMIN_DASHBOARD.STATS.TRAININGS',
      value: this.trainingService.trainings().length,
      icon: 'pi pi-calendar',
    }
  ]);
}
