import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { PlantaDetail } from '../planta-detail/planta-detail';
import { PlantaForm } from '../planta-form/planta-form';
import { Plantas } from '../plantas/plantas';
import { plantaOwnerGuard } from '../../guards/planta-owner-guard';
import { PlantaLogsForm } from '../../../planta-logs/features/planta-logs-form/planta-logs-form';
import { Favorites } from '../favorites/favorites';
import { Mapa } from '../mapa/mapa';

export default [
  { path: 'home', component: Home },
  { path: 'plantas', component: Plantas },
  { path: 'mapa', component: Mapa },
  { path: 'favorites', component: Favorites },
  { path: 'plantas/new-planta', component: PlantaForm },
  { path: 'plantas/:id/edit', component: PlantaForm, canActivate: [plantaOwnerGuard] },
  { path: 'plantas/:id/new-log', component: PlantaLogsForm, canActivate: [plantaOwnerGuard] },
  { path: 'plantas/:id', component: PlantaDetail },
  { path: '**', redirectTo: 'home' },
] as Routes;
