import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/data-access/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  //No se usa inject porque donde se va a ejecutar esta funcion no se permite
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
