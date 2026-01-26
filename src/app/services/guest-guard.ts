import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/data-access/auth-service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
