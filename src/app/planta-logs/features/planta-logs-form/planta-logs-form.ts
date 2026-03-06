import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../../plantas/data-access/planta-service';
import { form, required, FormField } from '@angular/forms/signals';
import { PlantaLogsService } from '../../data-access/planta-logs-service';
import { DatePipe } from '@angular/common';
import { Icon } from '../../../shared/ui/icon/icon';
import { ToastService } from '../../../shared/utils/toast-service';

interface PlantaLogsFormData {
  production: number;
  consumption: number;
  message: string;
}

@Component({
  selector: 'app-planta-logs-form',
  imports: [RouterLink, FormField, DatePipe, Icon],
  templateUrl: './planta-logs-form.html',
  styleUrl: './planta-logs-form.scss',
})
export class PlantaLogsForm implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _plantaService = inject(PlantaService);
  private _plantaLogsService = inject(PlantaLogsService);
  private _toastService = inject(ToastService);

  private plantas = this._plantaService.plantas;
  loading = this._plantaLogsService.loading;
  error = this._plantaLogsService.error;

  private id = signal<string | null>(null);

  today = new Date();

  planta = computed(() => {
    const id = this.id();
    if (!id) return null;

    return this.plantas().find((planta) => planta.id.toString() === id) ?? null;
  });

  private initialFormValues = signal<PlantaLogsFormData | null>(null);

  hasUnsavedChanges = computed(() => {
    const initial = this.initialFormValues();

    if (!initial) return false;

    return (
      initial.production !== this.plantaLogsFormModel().production ||
      initial.consumption !== this.plantaLogsFormModel().consumption ||
      initial.message !== this.plantaLogsFormModel().message
    );
  });

  private plantaLogsFormModel = signal<PlantaLogsFormData>({
    production: 0,
    consumption: 0,
    message: '',
  });

  plantaLogsForm = form(this.plantaLogsFormModel, (schemaPath) => {
    required(schemaPath.production, { message: 'La producción es obligatoria.' });
    required(schemaPath.consumption, { message: 'El consumo es obligatorio.' });
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    const formValue = this.plantaLogsFormModel();
    const id = this.planta()?.id;
    if (!id) {
      this._toastService.show('No se encontro la planta para registrar el dato.', 'error');
      return;
    }
    if (this.loading()) return;

    const production = Number(formValue.production);
    const consumption = Number(formValue.consumption);

    if (!Number.isFinite(production) || !Number.isFinite(consumption)) {
      this._toastService.show('Produccion y consumo deben ser numeros validos.', 'warning');
      return;
    }
    if (production <= 0 || consumption <= 0) {
      this._toastService.show('Produccion y consumo deben ser mayores que cero.', 'warning');
      return;
    }

    const payload = {
      ...formValue,
      production,
      consumption,
      planta_id: id,
    };

    const createdPlantaLog = await this._plantaLogsService.createPlantaLog(payload);

    if (createdPlantaLog) {
      await this._router.navigate(['/plantas', id]);
      this._toastService.show('Registro creado correctamente.', 'success');
      return;
    }
    this._toastService.show('No se pudo crear el registro. Intentalo de nuevo.', 'error');
  }

  async ngOnInit(): Promise<void> {
    this.id.set(this._route.snapshot.paramMap.get('id'));

    const id = this.id();
    if (!id) return;

    await this._plantaService.readPlantaById(id);

    this.initialFormValues.set({
      production: this.plantaLogsFormModel().production,
      consumption: this.plantaLogsFormModel().consumption,
      message: this.plantaLogsFormModel().message,
    });
  }
}
