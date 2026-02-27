import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'energyBalance',
  standalone: true,
})
export class EnergyBalancePipe implements PipeTransform {
  transform(production: number | null, consumption: number | null): number {
    const safeProduction = production ?? 0;
    const safeConsumption = consumption ?? 0;

    return safeProduction - safeConsumption;
  }
}
