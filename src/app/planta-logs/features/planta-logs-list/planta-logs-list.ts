import { Component, inject } from '@angular/core';
import { PlantaLogsService } from '../../data-access/planta-logs-service';

@Component({
  selector: 'app-planta-logs-list',
  imports: [],
  templateUrl: './planta-logs-list.html',
  styleUrl: './planta-logs-list.scss',
})
export class PlantaLogsList {
  private _plantaLogsService: PlantaLogsService = inject(PlantaLogsService);

  plantaLogs = this._plantaLogsService.plantaLogs;
  loading = this._plantaLogsService.loading;
  error = this._plantaLogsService.error;
}
