import { Routes } from '@angular/router';
import { PlantaList } from './plantas/planta-list/planta-list';
import { PlantaDetail } from './plantas/planta-detail/planta-detail';
import { Home } from './components/home/home';
import { PlantaTable } from './plantas/planta-table/planta-table';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'plantas', component: PlantaList },
  { path: 'tabla', component: PlantaTable },
  { path: 'lista', component: PlantaList },
  { path: 'planta/:id', component: PlantaDetail },
  { path: '**', pathMatch: 'full', redirectTo: '#home' },
];
