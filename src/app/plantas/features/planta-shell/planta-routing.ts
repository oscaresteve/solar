import { Routes } from '@angular/router';
import { Dashboard } from '../dashboard/dashboard';
import { PlantaDetail } from '../planta-detail/planta-detail';
import { PlantaForm } from '../planta-form/planta-form';
import { Plantas } from '../plantas/plantas';
import { plantaOwnerGuard } from '../../guards/planta-owner-guard';

export default [
  { path: 'dashboard', component: Dashboard },
  { path: 'plantas', component: Plantas },
  { path: 'plantas/nueva', component: PlantaForm },
  { path: 'plantas/:id/edit', component: PlantaForm, canActivate: [plantaOwnerGuard] },
  { path: 'plantas/:id', component: PlantaDetail },
  { path: '**', redirectTo: 'dashboard' },
] as Routes;
