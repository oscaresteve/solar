import { Component, inject, OnInit } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../../interfaces/planta';
import { PlantaService } from '../../data-access/planta-service';
import { FavoritesService } from '../../data-access/favorites-service';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.scss',
})
export class PlantaList implements OnInit {
  private _plantaService = inject(PlantaService);
  private _favoritesService = inject(FavoritesService);

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;

  isFavorite(plantaId: string) {
    return this._favoritesService.isFavorite(plantaId);
  }

  async toggleFavorite(planta: Planta) {
    await this._favoritesService.toggleFavorite(planta.id);
  }

  ngOnInit(): void {
    this._plantaService.ensurePlantasLoaded();
    this._favoritesService.ensureFavoritesLoaded();
  }
}
