import { Component, computed, inject, input, OnInit } from '@angular/core';
import { PlantaService } from '../../data-access/planta-service';
@Component({
  selector: 'app-planta-detail',
  imports: [],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.css',
})
export class PlantaDetail implements OnInit {
  private plantaService: PlantaService = inject(PlantaService);

  id = input<String>();

  plantas = this.plantaService.plantas;

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id());
  });

  ngOnInit(): void {
    this.plantaService.readPlantas();
  }
}
