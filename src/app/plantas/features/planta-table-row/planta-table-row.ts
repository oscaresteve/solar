import { Component, input } from '@angular/core';
import { Planta } from '../../planta';

@Component({
  selector: '[app-planta-table-row]',
  imports: [],
  templateUrl: './planta-table-row.html',
  styleUrl: './planta-table-row.css',
})
export class PlantaTableRow {
  //planta!: Planta;
  planta = input.required<Planta>({ alias: 'plantaId' });
}
