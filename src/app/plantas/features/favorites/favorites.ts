import { Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../data-access/favorites-service';
import { Planta } from '../../interfaces/planta';
import { PlantaItem } from '../planta-item/planta-item';
import { CardSkeleton } from '../../../shared/ui/card-skeleton/card-skeleton';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-favoritos',
  imports: [PlantaItem, CardSkeleton, RouterLink, Icon],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  private _favoritesService = inject(FavoritesService);

  plantasFavorites = this._favoritesService.plantasFavorites;
  loading = this._favoritesService.loading;
  error = this._favoritesService.error;

  onRetryLoad() {
    this._favoritesService.readFavorites();
  }

  isFavorite(plantaId: string) {
    return this._favoritesService.isFavorite(plantaId);
  }

  async toggleFavorite(planta: Planta) {
    await this._favoritesService.toggleFavorite(planta.id);
  }

  ngOnInit(): void {
    void this._favoritesService.ensureFavoritesLoaded();
  }
}
