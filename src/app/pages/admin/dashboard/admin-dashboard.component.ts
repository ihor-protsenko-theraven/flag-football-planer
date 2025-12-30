import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { APP_ROUTES } from '../../../core/constants/routes';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './admin-dashboard.component.html',
    styles: []
})
export class AdminDashboardComponent {
    protected readonly APP_ROUTES = APP_ROUTES;
    adminStats = [
        { label: 'ADMIN_DASHBOARD.STATS.TOTAL_DRILLS', value: '24', icon: 'description' },
        { label: 'ADMIN_DASHBOARD.STATS.ACTIVE_PLAYS', value: '12', icon: 'map' },
        { label: 'ADMIN_DASHBOARD.STATS.TEAM_MEMBERS', value: '5', icon: 'group' }
    ];
}
