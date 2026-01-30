import { Component } from '@angular/core';
import { PlantaList } from '../planta-list/planta-list';
import { Navbar } from '../../../shared/features/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [PlantaList, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
