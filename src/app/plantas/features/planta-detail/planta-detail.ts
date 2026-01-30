import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { PlantaService } from '../../data-access/planta-service';
import { PlantaLogsList } from '../../../planta-logs/features/planta-logs-list/planta-logs-list';
import { PlantaLogsService } from '../../../planta-logs/data-access/planta-logs-service';
@Component({
  selector: 'app-planta-detail',
  imports: [PlantaLogsList],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.scss',
})
export class PlantaDetail implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);
  private _plantaLogsService: PlantaLogsService = inject(PlantaLogsService);

  @Input() id!: string;

  plantas = this._plantaService.plantas;
  plantaLogs = this._plantaLogsService.plantaLogs;

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id);
  });

  ngOnInit(): void {
    this._plantaService.readPlantas();
    this._plantaLogsService.readLogsDePlanta(this.id);
  }
}
