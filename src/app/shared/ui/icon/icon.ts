import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type IconName = 'arrow-right' | 'chevron-right' | 'heart' | 'heart-solid';

@Component({
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  name = input.required<IconName>();
  className = input<string>('size-6');
  ariaHidden = input<boolean>(true);
}
