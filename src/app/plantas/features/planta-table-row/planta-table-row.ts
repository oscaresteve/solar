import { Component, input } from '@angular/core';
import { Planta } from '../../planta';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: '[app-planta-table-row]',
  imports: [RouterLink, Icon],
  templateUrl: './planta-table-row.html',
  styleUrl: './planta-table-row.scss',
})
export class PlantaTableRow {
  //planta!: Planta;
  planta = input.required<Planta>({ alias: 'plantaId' });
}
