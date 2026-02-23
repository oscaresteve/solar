import { Component, inject, OnInit } from '@angular/core';
import { PlantaTable } from '../planta-table/planta-table';
import { PlantaService } from '../../data-access/planta-service';
import { RouterLink } from '@angular/router';

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

  ngOnInit(): void {
    this._plantaService.ensurePlantasLoaded();
  }
}
