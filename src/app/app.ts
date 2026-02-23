import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/features/navbar/navbar';
import { Footer } from './shared/features/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  protected readonly title = signal('solar');

  protected isAuthRoute(): boolean {
    return this.router.url.startsWith('/auth');
  }
}
