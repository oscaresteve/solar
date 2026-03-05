import { Component, input, output, signal } from '@angular/core';
import { Planta } from '../../interfaces/planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';
import { TableRowSkeleton } from '../../../shared/ui/table-row-skeleton/table-row-skeleton';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow, TableRowSkeleton, RouterLink, Icon],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.scss',
})
export class PlantaTable {
  plantas = input.required<Planta[]>();
  loading = input(false);
  error = input(false);
  retryRequested = output<void>();

  onRetryLoad() {
    this.retryRequested.emit();
  }
}
