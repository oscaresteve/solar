import { Component, signal } from '@angular/core';
import { Header } from './shared/features/header/header';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('solar');

  ngOnInit(): void {
    initFlowbite();
  }
}
