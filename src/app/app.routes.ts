import { Routes } from '@angular/router';
import { DrillCatalogComponent } from './pages/drill-catalog/drill-catalog.component';
import { DrillDetailComponent } from './pages/drill-detail/drill-detail.component';
import { TrainingBuilderComponent } from './pages/training-builder/training-builder.component';
import { MyTrainingsComponent } from './pages/my-trainings/my-trainings.component';
import { TrainingViewComponent } from './pages/training-view/training-view.component';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/catalog', pathMatch: 'full' },
    { path: 'catalog', component: DrillCatalogComponent },
    { path: 'catalog/:id', component: DrillDetailComponent },
    { path: 'builder', component: TrainingBuilderComponent },
    { path: 'trainings', component: MyTrainingsComponent },
    { path: 'trainings/:id', component: TrainingViewComponent },
    {
        path: 'combinations',
        loadComponent: () => import('./pages/combinations-catalog/combinations-catalog.component').then(m => m.CombinationsCatalogComponent)
    },
    {
        path: 'combinations/:id',
        loadComponent: () => import('./pages/combination-detail/combination-detail.component').then(m => m.CombinationDetailComponent)
    },

    // Admin Routes
    { path: 'admin/login', component: AdminLoginComponent },
    {
        path: 'admin/editor',
        loadComponent: () => import('./pages/admin/editor/drill-editor.component').then(m => m.DrillEditorComponent),
        canActivate: [adminGuard]
    },

    { path: '**', redirectTo: '/catalog' }
];


