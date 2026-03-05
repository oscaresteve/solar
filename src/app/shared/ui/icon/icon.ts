import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type IconName =
  | 'arrow-right-outline'
  | 'chevron-right-outline'
  | 'chevron-left-outline'
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
  | 'plus-circle-solid'
  | 'arrow-uturn-left-outline'
  | 'arrow-uturn-left-solid'
  | 'arrow-down-tray-outline'
  | 'arrow-down-tray-solid'
  | 'globe-alt-outline'
  | 'globe-alt-solid'
  | 'arrow-trending-up-outline'
  | 'arrow-trending-down-outline'
  | 'exclamation-circle-outline'
  | 'check-circle-outline'
  | 'exclamation-triangle-outline'
  | 'info-circle-outline'
  | 'squares-2x2-outline'
  | 'x-mark-outline'
  | 'plus-outline'
  | 'document-text-outline';

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
