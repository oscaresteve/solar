import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type IconName =
  | 'arrow-right-outline'
  | 'chevron-right-outline'
  | 'heart-outline'
  | 'heart-solid'
  | 'arrow-path'
  | 'envelope-outline'
  | 'lock-closed-outline'
  | 'identification'
  | 'home-outline'
  | 'home-solid'
  | 'bolt-outline'
  | 'bolt-solid'
  | 'user-outline'
  | 'user-solid'
  | 'cog-outline'
  | 'cog-solid'
  | 'arrow-right-on-rectangle-outline'
  | 'arrow-right-on-rectangle-solid'
  | 'pencil-square-outline'
  | 'pencil-square-solid'
  | 'trash-outline'
  | 'trash-solid'
  | 'plus-circle-outline'
  | 'plus-circle-solid';

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
