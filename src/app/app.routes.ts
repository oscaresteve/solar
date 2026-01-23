import { Routes } from '@angular/router';
import { PlantaList } from './plantas/planta-list/planta-list';
import { PlantaDetail } from './plantas/planta-detail/planta-detail';
import { Home } from './views/home/home';
import { PlantaTable } from './plantas/planta-table/planta-table';
import { AuthGuard } from './services/auth-guard';
import { LoginComponent } from './views/login/login';
import { GuestGuard } from './services/guest-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'tabla', component: PlantaTable, canActivate: [AuthGuard] },
  { path: 'lista', component: PlantaList, canActivate: [AuthGuard] },
  { path: 'planta/:id', component: PlantaDetail, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
