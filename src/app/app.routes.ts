import { Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { ROUTE_PATTERNS } from './core/constants/routes';

export const routes: Routes = [
  { path: '', redirectTo: `/${ROUTE_PATTERNS.CATALOG}`, pathMatch: 'full' },
  {
    path: ROUTE_PATTERNS.CATALOG,
    loadComponent: () => import('./pages/drill-catalog/drill-catalog.component').then(m => m.DrillCatalogComponent)
  },
  {
    path: ROUTE_PATTERNS.CATALOG_DETAIL,
    loadComponent: () => import('./pages/drill-detail/drill-detail.component').then(m => m.DrillDetailComponent)
  },
  {
    path: ROUTE_PATTERNS.BUILDER,
    loadComponent: () => import('./pages/training-builder/training-builder.component').then(m => m.TrainingBuilderComponent)
  },
  {
    path: ROUTE_PATTERNS.TRAININGS,
    loadComponent: () => import('./pages/my-trainings/my-trainings.component').then(m => m.MyTrainingsComponent)
  },
  {
    path: ROUTE_PATTERNS.TRAINING_DETAIL,
    loadComponent: () => import('./pages/training-view/training-view.component').then(m => m.TrainingViewComponent)
  },
  {
    path: ROUTE_PATTERNS.PLAYS,
    loadComponent: () => import('./pages/plays-catalog/plays-catalog.component').then(m => m.PlaysCatalogComponent)
  },
  {
    path: ROUTE_PATTERNS.PLAY_DETAIL,
    loadComponent: () => import('./pages/play-detail/play-detail.component').then(m => m.PlayDetailComponent)
  },

  // Admin Routes
  { path: ROUTE_PATTERNS.ADMIN.LOGIN, component: AdminLoginComponent },
  {
    path: ROUTE_PATTERNS.ADMIN.ROOT,
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  { path: '**', redirectTo: `/${ROUTE_PATTERNS.CATALOG}` }
];


