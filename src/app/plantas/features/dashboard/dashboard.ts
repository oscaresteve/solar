import { Component } from '@angular/core';
import { PlantaList } from '../planta-list/planta-list';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-dashboard',
  imports: [PlantaList, Icon],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
