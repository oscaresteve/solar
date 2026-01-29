import { Component, input, output } from '@angular/core';
import { Planta } from '../../planta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planta-item',
  imports: [RouterLink],
  templateUrl: './planta-item.html',
  styleUrl: './planta-item.scss',
})
export class PlantaItem {
  planta = input.required<Planta>();

  favoriteToggled = output<void>();

  toggleFavorite() {
    this.favoriteToggled.emit();
    //this.planta().favorite = !this.planta().favorite;
  }
}
