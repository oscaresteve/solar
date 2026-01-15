import { Component, signal } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { PLANTAS_DEMO } from '../plantas_demo';
import { Planta } from '../planta';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList {
  plantas = signal<Planta[]>(PLANTAS_DEMO);
}
