import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../../plantas/data-access/planta-service';
import { form, required, FormField } from '@angular/forms/signals';
import { PlantaLogsService } from '../../data-access/planta-logs-service';

interface PlantaLogsFormData {
  production: number;
  consumption: number;
  message: string;
}

@Component({
  selector: 'app-planta-logs-form',
  imports: [RouterLink, FormField],
  templateUrl: './planta-logs-form.html',
  styleUrl: './planta-logs-form.scss',
})
export class PlantaLogsForm implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _plantaService = inject(PlantaService);
  private _plantaLogsService = inject(PlantaLogsService);

  private plantas = this._plantaService.plantas;
  loading = this._plantaLogsService.loading;
  error = this._plantaLogsService.error;

  private id = signal<string | null>(null);

  planta = computed(() => {
    const id = this.id();
    if (!id) return null;

    return this.plantas().find((planta) => planta.id.toString() === id) ?? null;
  });

  private plantaLogsFormModel = signal<PlantaLogsFormData>({
    production: 0,
    consumption: 0,
    message: '',
  });

  plantaLogsForm = form(this.plantaLogsFormModel, (schemaPath) => {
    required(schemaPath.production, { message: 'production is required' });
    required(schemaPath.consumption, { message: 'consumption is required' });
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    const formValue = this.plantaLogsFormModel();
    const id = this.planta()?.id;
    if (!id) return;
    if (this.loading()) return;

    const production = Number(formValue.production);
    const consumption = Number(formValue.consumption);

    if (!Number.isFinite(production) || !Number.isFinite(consumption)) return;
    if (production <= 0 || consumption <= 0) return;

    const payload = {
      ...formValue,
      production,
      consumption,
      planta_id: id,
    };

    const createdPlantaLog = await this._plantaLogsService.createPlantaLog(payload);

    if (createdPlantaLog) {
      await this._router.navigate(['/plantas', id]);
    }
  }

  async ngOnInit(): Promise<void> {
    this.id.set(this._route.snapshot.paramMap.get('id'));

    const id = this.id();
    if (!id) return;

    await this._plantaService.readPlantaById(id);
  }
}
