import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { PlantaLogsList } from '../../../planta-logs/features/planta-logs-list/planta-logs-list';
import { PlantaLogsService } from '../../../planta-logs/data-access/planta-logs-service';
import { AuthService } from '../../../auth/data-access/auth-service';
import { PlantaLog } from '../../interfaces/planta-log';
import { LineChart } from '../../../shared/ui/line-chart/line-chart';
import { Icon } from '../../../shared/ui/icon/icon';
import { ToastService } from '../../../shared/utils/toast-service';

type SortField = 'created_at' | 'production' | 'consumption' | 'balance';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-planta-detail',
  imports: [PlantaLogsList, RouterLink, DatePipe, DecimalPipe, LineChart, Icon],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.scss',
})
export class PlantaDetail implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);
  private _plantaLogsService: PlantaLogsService = inject(PlantaLogsService);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _toastService = inject(ToastService);

  id = input.required<string>();

  plantas = this._plantaService.plantas;
  plantaLogs = this._plantaLogsService.plantaLogs;
  uid = this._authService.uid;

  plantaLogsLoaing = this._plantaLogsService.loading;
  plantaLogsError = this._plantaLogsService.error;

  hasPreviousPage = this._plantaLogsService.hasPreviousPage;
  hasNextPage = this._plantaLogsService.hasNextPage;
  currentPage = this._plantaLogsService.currentPage;

  sortField = signal<SortField>('created_at');
  sortDirection = signal<SortDirection>('desc');

  planta = computed(() => {
    return this.plantas().find((p) => p.id === this.id());
  });

  isOwner = computed(() => this._plantaService.isPlantaOwner(this.planta()?.user_id, this.uid()));

  sortedPlantaLogs = computed(() => {
    const plantaLogs = [...this.plantaLogs()];
    return plantaLogs.sort((a, b) => this.comparePlantaLogs(a, b));
  });

  async onDelete() {
    const deleted = await this._plantaService.deletePlanta(this.id());
    if (deleted) {
      this._router.navigateByUrl('plantas');
      this._toastService.show('Planta eliminada correctamente', 'success');
      return;
    }
    this._toastService.show('No se pudo eliminar la planta. Intentalo de nuevo.', 'error');
  }

  onNextPage() {
    this._plantaLogsService.nextPage(this.id());
  }

  onPreviousPage() {
    this._plantaLogsService.previousPage(this.id());
  }

  onRetryLoad() {
    this._plantaLogsService.reloadCurrentPage(this.id());
  }

  ngOnInit(): void {
    this._authService.readUser();
    this._plantaService.readPlantaById(this.id());
    this._plantaLogsService.ensurePlantaLogsLoaded(this.id(), 5);
  }

  private comparePlantaLogs(a: PlantaLog, b: PlantaLog) {
    const sortField = this.sortField();
    const sortDirection = this.sortDirection();

    let compareResult = 0;

    if (sortField === 'production') {
      compareResult = a.production - b.production;
    } else if (sortField === 'consumption') {
      compareResult = a.consumption - b.consumption;
    } else if (sortField === 'balance') {
      const balanceA = (a.production ?? 0) - (a.consumption ?? 0);
      const balanceB = (b.production ?? 0) - (b.consumption ?? 0);
      compareResult = balanceA - balanceB;
    } else {
      compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    return sortDirection === 'asc' ? compareResult : compareResult * -1;
  }
}
