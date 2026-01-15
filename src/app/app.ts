import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { PlantaTable } from "./plantas/planta-table/planta-table";

@Component({
  selector: 'app-root',
  imports: [Header, PlantaTable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('solar');
}
