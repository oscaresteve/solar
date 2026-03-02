import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type IconName =
  | 'arrow-right-outline'
  | 'chevron-right-outline'
  | 'heart-outline'
  | 'heart-solid'
  | 'arrow-path-rounded-square-outline'
  | 'envelope-outline'
  | 'lock-closed-outline'
  | 'identification';

export type StrokeWidth = '1.5' | '2.0' | '2.5';

@Component({
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  name = input.required<IconName>();
  className = input<string>('size-6');
  strokeWidth = input<StrokeWidth>('1.5');
}
