import { Component } from '@angular/core';
import { PlantaTable } from '../planta-table/planta-table';

@Component({
  selector: 'app-plantas',
  imports: [PlantaTable],
  templateUrl: './plantas.html',
  styleUrl: './plantas.scss',
})
export class Plantas {}
