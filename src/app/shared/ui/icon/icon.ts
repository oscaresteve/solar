import { Component, input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

export type IconName = 'arrow-right' | 'chevron-right' | 'heart' | 'heart-solid' | 'arrow-path';

@Component({
  selector: 'app-icon',
  imports: [NgClass, NgStyle],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  name = input.required<IconName>();
  className = input<string>('size-6');
  color = input<string | null>(null);
  size = input<string | null>(null);
  ariaHidden = input<boolean>(true);
}
