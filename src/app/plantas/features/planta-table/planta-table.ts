import { Component, input } from '@angular/core';
import { Planta } from '../../interfaces/planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';
import { TableRowSkeleton } from '../../../shared/ui/table-row-skeleton/table-row-skeleton';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow, TableRowSkeleton],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.scss',
})
export class PlantaTable {
  plantas = input.required<Planta[]>();
  loading = input(false);
  error = input(false);
}
