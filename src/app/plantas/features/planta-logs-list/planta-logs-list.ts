import { Component, effect, inject, input, OnInit } from '@angular/core';
import { PlantaService } from '../../data-access/planta-service';

@Component({
  selector: 'app-planta-logs-list',
  imports: [],
  templateUrl: './planta-logs-list.html',
  styleUrl: './planta-logs-list.scss',
})
export class PlantaLogsList {
  private _plantaService: PlantaService = inject(PlantaService);

  plantaLogs = this._plantaService.plantaLogs;
  loading = this._plantaService.loading;
  error = this._plantaService.error;
}
