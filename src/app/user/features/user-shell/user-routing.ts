import { Routes } from '@angular/router';
import { Cuenta } from '../cuenta/cuenta';

export default [
  { path: 'cuenta', component: Cuenta },
  { path: '**', redirectTo: 'cuenta' },
] as Routes;
