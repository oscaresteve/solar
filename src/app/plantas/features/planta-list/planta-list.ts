import { Component, inject, OnInit } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../../planta';
import { PlantaService } from '../../data-access/planta-service';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);

  plantas = this._plantaService.plantas;

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }

  ngOnInit(): void {
    this._plantaService.readPlantas();
  }
}
