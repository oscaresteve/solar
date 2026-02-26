import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlantaTable } from '../planta-table/planta-table';
import { PlantaService } from '../../data-access/planta-service';
import { RouterLink } from '@angular/router';
import { Planta } from '../../interfaces/planta';

type SortField = 'created_at' | 'name' | 'capacity';

@Component({
  selector: 'app-plantas',
  imports: [PlantaTable, RouterLink],
  templateUrl: './plantas.html',
  styleUrl: './plantas.scss',
})
export class Plantas implements OnInit {
  private _plantaService = inject(PlantaService);

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;
  currentPage = this._plantaService.currentPage;
  hasPreviousPage = this._plantaService.hasPreviousPage;
  hasNextPage = this._plantaService.hasNextPage;
  activeFilter = signal<boolean | null>(null);
  sortField = signal<SortField>('created_at');
  sortAscending = signal(false);
  filteredAndSortedPlantas = computed(() => {
    const plantas = [...this.plantas()];
    const activeFilter = this.activeFilter();

    const filteredPlantas =
      activeFilter === null
        ? plantas
        : plantas.filter((planta) => planta.active === activeFilter);

    return filteredPlantas.sort((a, b) => this.comparePlantas(a, b));
  });

  onNextPage() {
    this._plantaService.nextPage();
  }

  onPreviousPage() {
    this._plantaService.previousPage();
  }

  onRetryLoad() {
    this._plantaService.reloadCurrentPage();
  }

  onActiveFilterChanged(active: boolean | null) {
    this.activeFilter.set(active);
  }

  onSortChanged(sort: {
    field: 'created_at' | 'name' | 'capacity';
    ascending: boolean;
  }) {
    this.sortField.set(sort.field);
    this.sortAscending.set(sort.ascending);
  }

  ngOnInit(): void {
    this._plantaService.ensurePlantasLoaded(5);
  }

  private comparePlantas(a: Planta, b: Planta) {
    const sortField = this.sortField();
    let compareResult = 0;

    if (sortField === 'name') {
      compareResult = a.name.localeCompare(b.name);
    } else if (sortField === 'capacity') {
      compareResult = a.capacity - b.capacity;
    } else {
      compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    return this.sortAscending() ? compareResult : compareResult * -1;
  }
}
