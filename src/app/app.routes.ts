import { Routes } from '@angular/router';
import { PlantaList } from './plantas/features/planta-list/planta-list';
import { PlantaDetail } from './plantas/features/planta-detail/planta-detail';
import { Home } from './shared/features/home/home';
import { PlantaTable } from './plantas/features/planta-table/planta-table';
import { AuthGuard } from './services/auth-guard';
import { LoginComponent } from './auth/features/login/login';
import { GuestGuard } from './services/guest-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'tabla', component: PlantaTable, canActivate: [AuthGuard] },
  { path: 'lista', component: PlantaList, canActivate: [AuthGuard] },
  { path: 'planta/:id', component: PlantaDetail, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
