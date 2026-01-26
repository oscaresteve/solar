import { Component, inject, OnInit, signal } from '@angular/core';
import { Planta } from '../../planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';
import { PlantaService } from '../../data-access/planta-service';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.css',
})
export class PlantaTable implements OnInit {
  private plantaService: PlantaService = inject(PlantaService);

  plantas = this.plantaService.plantas;

  ngOnInit(): void {
    this.plantaService.readPlantas();
  }
}
