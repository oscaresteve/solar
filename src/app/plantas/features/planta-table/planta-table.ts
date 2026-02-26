import { Component, input, output, signal } from '@angular/core';
import { Planta } from '../../interfaces/planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';
import { TableRowSkeleton } from '../../../shared/ui/table-row-skeleton/table-row-skeleton';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow, TableRowSkeleton, RouterLink],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.scss',
})
export class PlantaTable {
  plantas = input.required<Planta[]>();
  loading = input(false);
  error = input(false);
  retryRequested = output<void>();
  activeFilterChanged = output<boolean | null>();
  sortChanged = output<{
    field: 'created_at' | 'name' | 'capacity';
    ascending: boolean;
  }>();

  activeFilter = signal<'all' | 'active' | 'inactive'>('all');
  sortField = signal<'created_at' | 'name' | 'capacity'>('created_at');
  sortDirection = signal<'asc' | 'desc'>('desc');

  onRetryLoad() {
    this.retryRequested.emit();
  }

  onActiveFilterChange(value: string) {
    if (value === 'active') {
      this.activeFilter.set('active');
      this.activeFilterChanged.emit(true);
      return;
    }

    if (value === 'inactive') {
      this.activeFilter.set('inactive');
      this.activeFilterChanged.emit(false);
      return;
    }

    this.activeFilter.set('all');
    this.activeFilterChanged.emit(null);
  }

  onSortFieldChange(field: string) {
    if (!this.isSortField(field)) return;
    this.sortField.set(field);
    this.sortChanged.emit({ field, ascending: this.sortDirection() === 'asc' });
  }

  onSortDirectionChange(direction: string) {
    if (direction !== 'asc' && direction !== 'desc') return;
    this.sortDirection.set(direction);
    this.sortChanged.emit({ field: this.sortField(), ascending: direction === 'asc' });
  }

  private isSortField(value: string): value is 'created_at' | 'name' | 'capacity' {
    return value === 'created_at' || value === 'name' || value === 'capacity';
  }
}
