import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { ROUTE_PATTERNS } from '../../core/constants/routes';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: ROUTE_PATTERNS.ADMIN.DRILL_NEW,
                loadComponent: () => import('./drill-editor/drill-editor.component').then(m => m.DrillEditorComponent)
            },
            {
                path: ROUTE_PATTERNS.ADMIN.DRILL_EDIT,
                loadComponent: () => import('./drill-editor/drill-editor.component').then(m => m.DrillEditorComponent)
            },
            {
                path: ROUTE_PATTERNS.ADMIN.PLAYS_NEW,
                loadComponent: () => import('./play-editor/play-editor.component').then(m => m.PlayEditorComponent)
            },
            {
                path: ROUTE_PATTERNS.ADMIN.PLAYS_EDIT,
                loadComponent: () => import('./play-editor/play-editor.component').then(m => m.PlayEditorComponent)
            }
        ]
    }
];
