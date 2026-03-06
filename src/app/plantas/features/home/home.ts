import { Component, computed, inject } from '@angular/core';
import { PlantaList } from '../planta-list/planta-list';
import { Icon } from '../../../shared/ui/icon/icon';
import { PlantaService } from '../../data-access/planta-service';
import { FavoritesService } from '../../data-access/favorites-service';

@Component({
  selector: 'app-home',
  imports: [PlantaList, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private _plantaService = inject(PlantaService);
  private _favoritesService = inject(FavoritesService);

  plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;
  favoritePlantaIds = computed(
    () => new Set(this._favoritesService.plantasFavorites().map((planta) => planta.id)),
  );
  sortedPlantas = computed(() =>
    [...this.plantas()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  );

  onRetryLoad() {
    this._plantaService.readAllPlantas();
  }

  async onToggleFavorite(plantaId: string) {
    await this._favoritesService.toggleFavorite(plantaId);
  }

  ngOnInit(): void {
    this._plantaService.ensurePlantasLoaded(null);
    this._favoritesService.ensureFavoritesLoaded();
  }
}
