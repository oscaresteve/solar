import { Routes } from '@angular/router';
import { PlantaList } from './plantas/planta-list/planta-list';
import { PlantaDetail } from './plantas/planta-detail/planta-detail';
import { Home } from './views/home/home';
import { PlantaTable } from './plantas/planta-table/planta-table';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tabla', component: PlantaTable },
  { path: 'lista', component: PlantaList },
  { path: 'planta/:id', component: PlantaDetail },
  { path: '**', pathMatch: 'full', redirectTo: '#home' },
];
