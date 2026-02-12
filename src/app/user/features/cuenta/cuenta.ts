import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../../../shared/features/navbar/navbar';
import { UserService } from '../../data-access/user-service';

@Component({
  selector: 'app-cuenta',
  imports: [Navbar],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.scss',
})
export class Cuenta implements OnInit {
  _userService = inject(UserService);

  first_name = this._userService.first_name;
  last_name = this._userService.last_name;
  email = this._userService.email;
  loading = this._userService.loading;
  error = this._userService.error;

  ngOnInit(): void {
    this._userService.readUser();
  }
}
