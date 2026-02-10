import { Routes } from '@angular/router';
import { Dashboard } from '../dashboard/dashboard';
import { PlantaDetail } from '../planta-detail/planta-detail';
import { PlantaForm } from '../planta-form/planta-form';
import { Plantas } from '../plantas/plantas';

export default [
  { path: 'dashboard', component: Dashboard },
  { path: 'plantas', component: Plantas },
  { path: 'plantas/nueva', component: PlantaForm },
  { path: 'plantas/:id/edit', component: PlantaForm },
  { path: 'plantas/:id', component: PlantaDetail },
  { path: '**', redirectTo: 'dashboard' },
] as Routes;
