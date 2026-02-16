import { Component, input } from '@angular/core';
import { Planta } from '../../planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.scss',
})
export class PlantaTable {
  plantas = input.required<Planta[]>();
  loading = input(false);
  error = input(false);
}
