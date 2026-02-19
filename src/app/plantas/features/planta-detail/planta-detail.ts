import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { PlantaLogsList } from '../../../planta-logs/features/planta-logs-list/planta-logs-list';
import { PlantaLogsService } from '../../../planta-logs/data-access/planta-logs-service';
import { Navbar } from '../../../shared/features/navbar/navbar';
import { AuthService } from '../../../auth/data-access/auth-service';
@Component({
  selector: 'app-planta-detail',
  imports: [PlantaLogsList, Navbar, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.scss',
})
export class PlantaDetail implements OnInit {
  private _plantaService: PlantaService = inject(PlantaService);
  private _plantaLogsService: PlantaLogsService = inject(PlantaLogsService);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  @Input() id!: string;

  plantas = this._plantaService.plantas;
  plantaLogs = this._plantaLogsService.plantaLogs;
  uid = this._authService.uid;

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id);
  });

  isOwner = computed(() => this._plantaService.isPlantaOwner(this.planta()?.user_id, this.uid()));

  async onDelete() {
    const deleted = await this._plantaService.deletePlanta(this.id);
    if (deleted) {
      this._router.navigateByUrl('plantas');
    }
  }

  ngOnInit(): void {
    this._authService.readUser();
    this._plantaService.readPlantaById(this.id);
    this._plantaLogsService.readPlantaLogs(this.id);
  }
}
