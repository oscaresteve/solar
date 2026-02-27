import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balanceStatus',
  standalone: true,
})
export class BalanceStatusPipe implements PipeTransform {
  transform(balance: number | null): string {
    const safeBalance = balance ?? 0;

    if (safeBalance > 0) return 'Superávit';
    if (safeBalance < 0) return 'Déficit';

    return 'Equilibrado';
  }
}
