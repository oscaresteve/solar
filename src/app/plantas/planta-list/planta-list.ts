import { Component, OnInit, signal } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { PLANTAS_DEMO } from '../plantas_demo';
import { Planta } from '../planta';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList implements OnInit {
  plantas = signal<Planta[]>([]);

  ngOnInit(): void {
    this.plantas.set(PLANTAS_DEMO);
  }

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }
}
