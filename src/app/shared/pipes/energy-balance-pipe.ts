import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'energyBalance',
  standalone: true,
})
export class EnergyBalancePipe implements PipeTransform {
  transform(production: number | null, consumption: number | null, unit = 'kWh'): string {
    const safeProduction = production ?? 0;
    const safeConsumption = consumption ?? 0;
    const delta = safeProduction - safeConsumption;

    if (delta === 0) return `0 ${unit} (Equilibrado)`;

    const absolute = Math.abs(delta).toLocaleString('es-ES');
    const sign = delta > 0 ? '+' : '-';
    const state = delta > 0 ? 'Superávit' : 'Déficit';

    return `${sign}${absolute} ${unit} (${state})`;
  }
}
