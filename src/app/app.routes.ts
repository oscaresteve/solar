import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './shared/guards/auth-guard';
import { AppLayout } from './shared/features/layouts/app-layout/app-layout';
import { AuthLayout } from './shared/features/layouts/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    component: AuthLayout,
    children: [{ path: '', loadChildren: () => import('./auth/features/auth-shell/auth-routing') }],
  },
  {
    path: '',
    canActivate: [privateGuard],
    component: AppLayout,
    children: [
      { path: 'user', loadChildren: () => import('./user/features/user-shell/user-routing') },
      { path: '', loadChildren: () => import('./plantas/features/planta-shell/planta-routing') },
    ],
  },
];
