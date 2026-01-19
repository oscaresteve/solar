import { Component, input, output } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-planta-item',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './planta-item.html',
  styleUrl: './planta-item.css',
})
export class PlantaItem {
  planta = input.required<Planta>();

  favoriteToggled = output<void>();

  toggleFavorite() {
    this.favoriteToggled.emit();
    //this.planta().favorite = !this.planta().favorite;
  }
}
