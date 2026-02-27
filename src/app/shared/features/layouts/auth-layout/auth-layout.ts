import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, Footer],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
