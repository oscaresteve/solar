import { Component, inject, OnInit } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../../planta';
import { PlantaService } from '../../data-access/planta-service';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.scss',
})
export class PlantaList implements OnInit {
  private _plantaService = inject(PlantaService);

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }

  ngOnInit(): void {
    this._plantaService.readPlantas();
  }
}
