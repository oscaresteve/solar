import { Routes } from '@angular/router';
import { Login } from '../login/login';
import { Register } from '../register/register';

export default [
  {
    path: 'sign-up',
    component: Register,
  },
  {
    path: 'log-in',
    component: Login,
  },
  {
    path: '**',
    redirectTo: 'log-in',
  },
] as Routes;
