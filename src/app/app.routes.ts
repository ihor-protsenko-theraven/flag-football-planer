import { Routes } from '@angular/router';
import { DrillCatalogComponent } from './pages/drill-catalog/drill-catalog.component';
import { DrillDetailComponent } from './pages/drill-detail/drill-detail.component';
import { TrainingBuilderComponent } from './pages/training-builder/training-builder.component';
import { MyTrainingsComponent } from './pages/my-trainings/my-trainings.component';
import { TrainingViewComponent } from './pages/training-view/training-view.component';

export const routes: Routes = [
    { path: '', redirectTo: '/catalog', pathMatch: 'full' },
    { path: 'catalog', component: DrillCatalogComponent },
    { path: 'catalog/:id', component: DrillDetailComponent },
    { path: 'builder', component: TrainingBuilderComponent },
    { path: 'trainings', component: MyTrainingsComponent },
    { path: 'trainings/:id', component: TrainingViewComponent },
    { path: '**', redirectTo: '/catalog' }
];


