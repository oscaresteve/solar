import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../footer/footer';
import { Toast } from '../../../ui/toast/toast';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, Footer, Toast],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
