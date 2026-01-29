import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { PlantaService } from '../../data-access/planta-service';
import { PlantaLogsList } from '../planta-logs-list/planta-logs-list';
@Component({
  selector: 'app-planta-detail',
  imports: [PlantaLogsList],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.scss',
})
export class PlantaDetail implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);

  @Input() id!: string;

  plantas = this._plantaService.plantas;
  plantaLogs = this._plantaService.plantaLogs;

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id);
  });

  ngOnInit(): void {
    this._plantaService.readPlantas();
    this._plantaService.readLogsDePlanta(this.id);
  }
}
