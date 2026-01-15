import { Component, computed, input } from '@angular/core';
import { PLANTAS_DEMO } from '../plantas_demo';

@Component({
  selector: 'app-planta-detail',
  imports: [],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.css',
})
export class PlantaDetail {
  id = input<String>();

  planta = computed(() => {
    const idNum = Number(this.id());
    return PLANTAS_DEMO.find((p) => p.id === idNum);
  });
}
