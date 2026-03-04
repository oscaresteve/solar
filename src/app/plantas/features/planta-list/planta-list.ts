import { Component, computed, inject, OnInit } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../../interfaces/planta';
import { PlantaService } from '../../data-access/planta-service';
import { FavoritesService } from '../../data-access/favorites-service';
import { CardSkeleton } from '../../../shared/ui/card-skeleton/card-skeleton';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem, CardSkeleton, RouterLink, Icon],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.scss',
})
export class PlantaList implements OnInit {
  private _plantaService = inject(PlantaService);
  private _favoritesService = inject(FavoritesService);

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;
  sortedPlantas = computed(() =>
    [...this.plantas()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  );

  onRetryLoad() {
    this._plantaService.readAllPlantas();
  }

  isFavorite(plantaId: string) {
    return this._favoritesService.isFavorite(plantaId);
  }

  async toggleFavorite(planta: Planta) {
    await this._favoritesService.toggleFavorite(planta.id);
  }

  ngOnInit(): void {
    this._plantaService.ensurePlantasLoaded(null);
    this._favoritesService.ensureFavoritesLoaded();
  }
}
