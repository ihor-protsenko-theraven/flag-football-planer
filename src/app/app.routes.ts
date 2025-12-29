import {Routes} from '@angular/router';
import {AdminLoginComponent} from './pages/admin/login/admin-login.component';

export const routes: Routes = [
  {path: '', redirectTo: '/catalog', pathMatch: 'full'},
  {
    path: 'catalog',
    loadComponent: () => import('./pages/drill-catalog/drill-catalog.component').then(m => m.DrillCatalogComponent)
  },
  {
    path: 'catalog/:id',
    loadComponent: () => import('./pages/drill-detail/drill-detail.component').then(m => m.DrillDetailComponent)
  },
  {
    path: 'builder',
    loadComponent: () => import('./pages/training-builder/training-builder.component').then(m => m.TrainingBuilderComponent)
  },
  {
    path: 'trainings',
    loadComponent: () => import('./pages/my-trainings/my-trainings.component').then(m => m.MyTrainingsComponent)
  },
  {
    path: 'trainings/:id',
    loadComponent: () => import('./pages/training-view/training-view.component').then(m => m.TrainingViewComponent)
  },
  {
    path: 'plays',
    loadComponent: () => import('./pages/plays-catalog/plays-catalog.component').then(m => m.PlaysCatalogComponent)
  },
  {
    path: 'plays/:id',
    loadComponent: () => import('./pages/play-detail/play-detail.component').then(m => m.PlayDetailComponent)
  },

  // Admin Routes
  {path: 'admin/login', component: AdminLoginComponent},
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  {path: '**', redirectTo: '/catalog'}
];


