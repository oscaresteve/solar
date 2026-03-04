import { Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { EnergyBalancePipe } from '../../../shared/pipes/energy-balance-pipe';
import { BalanceStatusPipe } from '../../../shared/pipes/balance-status-pipe';
import { PlantaLog } from '../../../plantas/interfaces/planta-log';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../shared/ui/icon/icon';

@Component({
  selector: 'app-planta-logs-list',
  imports: [DatePipe, DecimalPipe, EnergyBalancePipe, BalanceStatusPipe, RouterLink, Icon, NgClass],
  templateUrl: './planta-logs-list.html',
  styleUrl: './planta-logs-list.scss',
})
export class PlantaLogsList {
  plantaLogs = input.required<PlantaLog[]>();
  loading = input.required<boolean>();
  error = input.required<boolean>();

  id = input.required<string>();

  retryLoad = output<void>();

  onRetryLoad() {
    this.retryLoad.emit();
  }
}
