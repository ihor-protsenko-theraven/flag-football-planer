import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

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
                path: 'drill/new',
                loadComponent: () => import('./drill-editor/drill-editor.component').then(m => m.DrillEditorComponent)
            },
            {
                path: 'drill/edit/:id',
                loadComponent: () => import('./drill-editor/drill-editor.component').then(m => m.DrillEditorComponent)
            },
            {
                path: 'plays/new',
                loadComponent: () => import('./play-editor/play-editor.component').then(m => m.PlayEditorComponent)
            },
            {
                path: 'plays/edit/:id',
                loadComponent: () => import('./play-editor/play-editor.component').then(m => m.PlayEditorComponent)
            }
        ]
    }
];
