import { Component } from '@angular/core';
import { PlantaList } from '../planta-list/planta-list';

@Component({
  selector: 'app-dashboard',
  imports: [PlantaList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
