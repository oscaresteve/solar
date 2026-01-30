import { Component } from '@angular/core';
import { PlantaTable } from '../planta-table/planta-table';
import { Navbar } from '../../../shared/features/navbar/navbar';

@Component({
  selector: 'app-plantas',
  imports: [PlantaTable, Navbar],
  templateUrl: './plantas.html',
  styleUrl: './plantas.scss',
})
export class Plantas {}
