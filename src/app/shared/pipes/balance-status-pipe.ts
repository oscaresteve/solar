import { Pipe, PipeTransform } from '@angular/core';
import { IconName } from '../ui/icon/icon';

@Pipe({
  name: 'balanceStatus',
  standalone: true,
})
export class BalanceStatusPipe implements PipeTransform {
  transform(balance: number | null): IconName {
    const safeBalance = balance ?? 0;

    if (safeBalance > 0) return 'arrow-trending-up-outline';
    if (safeBalance < 0) return 'arrow-trending-down-outline';

    return 'arrow-right-outline';
  }
}
