import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth-service';
import { UserService } from '../../../user/data-access/user-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  _authService = inject(AuthService);
  _userService = inject(UserService);
  _router = inject(Router);

  first_name = this._userService.first_name;
  photo_url = this._userService.photo_url;

  async logOut() {
    await this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }
  ngOnInit(): void {
    this._userService.readProfile();
  }
}
