import { Component, inject, OnInit } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../planta';
import { PlantaService } from '../../services/planta-service';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList implements OnInit {
  private plantaService: PlantaService = inject(PlantaService);

  plantas = this.plantaService.plantas;

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }

  ngOnInit(): void {
    this.plantaService.readPlantas();
  }
}
