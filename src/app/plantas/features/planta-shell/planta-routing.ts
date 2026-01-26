import { Routes } from '@angular/router';
import { Home } from '../../../shared/features/home/home';
import { PlantaDetail } from '../planta-detail/planta-detail';
import { PlantaList } from '../planta-list/planta-list';
import { PlantaTable } from '../planta-table/planta-table';

export default [
  { path: 'home', component: Home },
  { path: 'tabla', component: PlantaTable },
  { path: 'lista', component: PlantaList },
  { path: 'planta/:id', component: PlantaDetail },
  { path: '**', redirectTo: 'home' },
] as Routes;
