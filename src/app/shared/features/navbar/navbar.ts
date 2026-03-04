import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth-service';
import { UserService } from '../../../user/data-access/user-service';
import { Icon } from '../../ui/icon/icon';
import { ToastService } from '../../utils/toast-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  _authService = inject(AuthService);
  _userService = inject(UserService);
  _toastService = inject(ToastService);

  first_name = this._userService.first_name;
  photo_url = this._userService.photo_url;

  loading = this._authService.loading;
  error = this._authService.error;

  async logOut() {
    const response = await this._authService.signOut();
    if (response.error) {
      this._toastService.show('No se pudo cerrar sesion. Intentalo de nuevo.', 'error');
      return;
    }

    this._toastService.show('Sesion cerrada correctamente.', 'info');
  }
  ngOnInit(): void {
    this._userService.readProfile();
  }
}
