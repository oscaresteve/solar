import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EnergyBalancePipe } from '../../../shared/pipes/energy-balance-pipe';
import { BalanceStatusPipe } from '../../../shared/pipes/balance-status-pipe';
import { PlantaLog } from '../../../plantas/interfaces/planta-log';

@Component({
  selector: 'app-planta-logs-list',
  imports: [DatePipe, DecimalPipe, EnergyBalancePipe, BalanceStatusPipe],
  templateUrl: './planta-logs-list.html',
  styleUrl: './planta-logs-list.scss',
})
export class PlantaLogsList {
  plantaLogs = input.required<PlantaLog[]>();
  loading = input.required<boolean>();
  error = input.required<boolean>();
}
