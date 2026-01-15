import { Component, input } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planta-item',
  imports: [RouterLink],
  templateUrl: './planta-item.html',
  styleUrl: './planta-item.css',
})
export class PlantaItem {
  planta = input.required<Planta>();
}
