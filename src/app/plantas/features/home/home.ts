import { Component } from '@angular/core';
import { PlantaList } from '../planta-list/planta-list';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-home',
  imports: [PlantaList, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
