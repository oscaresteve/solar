import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { PlantaTable } from './plantas/planta-table/planta-table';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, PlantaTable, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('solar');
}
