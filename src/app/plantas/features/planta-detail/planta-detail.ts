import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { PlantaLogsList } from '../../../planta-logs/features/planta-logs-list/planta-logs-list';
import { PlantaLogsService } from '../../../planta-logs/data-access/planta-logs-service';
import { AuthService } from '../../../auth/data-access/auth-service';
import { PlantaLog } from '../../interfaces/planta-log';

type SortField = 'created_at' | 'production' | 'consumption' | 'balance';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-planta-detail',
  imports: [PlantaLogsList, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.scss',
})
export class PlantaDetail implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);
  private _plantaLogsService: PlantaLogsService = inject(PlantaLogsService);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  @Input() id!: string;

  plantas = this._plantaService.plantas;
  plantaLogs = this._plantaLogsService.plantaLogs;
  uid = this._authService.uid;

  sortField = signal<SortField>('created_at');
  sortDirection = signal<SortDirection>('desc');

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id);
  });

  isOwner = computed(() => this._plantaService.isPlantaOwner(this.planta()?.user_id, this.uid()));

  sortedPlantaLogs = computed(() => {
    const plantaLogs = [...this.plantaLogs()];
    /* return plantaLogs.sort((a, b) => this.comparePlantaLogs(a, b)); */
  });

  async onDelete() {
    const deleted = await this._plantaService.deletePlanta(this.id);
    if (deleted) {
      this._router.navigateByUrl('plantas');
    }
  }

  ngOnInit(): void {
    this._authService.readUser();
    this._plantaService.readPlantaById(this.id);
    this._plantaLogsService.readPlantaLogs(this.id);
  }

  private comparePlantaLogs(a: PlantaLog, b: PlantaLog) {
    /* const sortField = this.sortField();
    const sortDirection = this.sortDirection();
    let compareResult = 0;

    if (sortField === 'name') {
      compareResult = a.name.localeCompare(b.name);
    } else if (sortField === 'capacity') {
      compareResult = a.capacity - b.capacity;
    } else {
      compareResult = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    return sortDirection === 'asc' ? compareResult : compareResult * -1; */
  }
}
