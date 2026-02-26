import { Component, input } from '@angular/core';
import { Planta } from '../../interfaces/planta';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: '[app-planta-table-row]',
  imports: [RouterLink, Icon, DatePipe],
  templateUrl: './planta-table-row.html',
  styleUrl: './planta-table-row.scss',
})
export class PlantaTableRow {
  //planta!: Planta;
  planta = input.required<Planta>({ alias: 'plantaId' });
}
