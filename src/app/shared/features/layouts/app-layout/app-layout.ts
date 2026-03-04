import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { Footer } from '../../footer/footer';
import { Toast } from '../../../ui/toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './app-layout.html',
})
export class AppLayout {}
