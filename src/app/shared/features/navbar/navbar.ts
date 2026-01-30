import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  _authService = inject(AuthService);
  _router = inject(Router);

  logOut() {
    this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }
}
