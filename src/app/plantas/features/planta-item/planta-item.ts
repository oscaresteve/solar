import { Component, input, output } from '@angular/core';
import { Planta } from '../../planta';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-planta-item',
  imports: [RouterLink, Icon],
  templateUrl: './planta-item.html',
  styleUrl: './planta-item.scss',
})
export class PlantaItem {
  planta = input.required<Planta>();
  isFavorite = input(false);

  favoriteToggled = output<void>();

  toggleFavorite() {
    this.favoriteToggled.emit();
  }
}
