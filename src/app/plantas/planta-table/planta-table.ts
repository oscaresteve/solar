import { Component } from '@angular/core';
import { Planta } from '../planta';
import { PLANTAS_DEMO } from '../plantas_demo';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from "../planta-table-row/planta-table-row";

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.css',
})
export class PlantaTable {
  plantas: Planta[] = PLANTAS_DEMO;
}
