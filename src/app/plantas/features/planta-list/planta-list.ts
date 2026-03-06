import { Component, input, output } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../../interfaces/planta';
import { CardSkeleton } from '../../../shared/ui/card-skeleton/card-skeleton';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem, CardSkeleton, RouterLink, Icon],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.scss',
})
export class PlantaList {
  loading = input.required<boolean>();
  error = input.required<boolean>();
  sortedPlantas = input.required<Planta[]>();
  favoriteIds = input.required<Set<string>>();

  retryLoad = output<void>();
  favoriteToggled = output<string>();

  onRetryLoad() {
    this.retryLoad.emit();
  }

  onFavoriteToggled(plantaId: string) {
    this.favoriteToggled.emit(plantaId);
  }
}
