import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { GeolocationService } from '../../../shared/data-access/geolocation-service';
import { DatePipe } from '@angular/common';
import { Icon } from '../../../shared/ui/icon/icon';
import { ToastService } from '../../../shared/utils/toast-service';

interface PlantaFormData {
  name: string;
  description: string;
  active: boolean;
  capacity: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-planta-form',
  imports: [RouterLink, FormField, DatePipe, Icon],
  templateUrl: './planta-form.html',
  styleUrl: './planta-form.scss',
})
export class PlantaForm implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _plantaService = inject(PlantaService);
  private _geolocationService = inject(GeolocationService);

  _toastService = inject(ToastService);

  private plantas = this._plantaService.plantas;
  loading = this._plantaService.loading;
  error = this._plantaService.error;

  private id = signal<string | null>(null);

  private selectedPhoto = signal<File | null>(null);

  private previewObjectUrl = signal<string | null>(null);

  today = new Date();

  plantaFormModel = signal<PlantaFormData>({
    name: '',
    description: '',
    active: true,
    capacity: 0,
    latitude: 0,
    longitude: 0,
  });

  private initialFormValues = signal<PlantaFormData | null>(null);

  hasUnsavedChanges = computed(() => {
    const initial = this.initialFormValues();

    if (!initial) return false;

    return (
      initial.name !== this.plantaFormModel().name ||
      initial.description !== this.plantaFormModel().description ||
      initial.active !== this.plantaFormModel().active ||
      initial.capacity !== this.plantaFormModel().capacity ||
      initial.latitude !== this.plantaFormModel().latitude ||
      initial.longitude !== this.plantaFormModel().longitude ||
      this.selectedPhoto()
    );
  });

  planta = computed(() => {
    const id = this.id();
    if (!id) return null;

    return this.plantas().find((planta) => planta.id.toString() === id) ?? null;
  });

  isEditing = computed(() => Boolean(this.id()));

  cancelLink = computed(() => {
    const planta = this.planta();
    return planta ? ['/plantas', planta.id] : ['/plantas'];
  });

  previewURL = computed(() => {
    const objectUrl = this.previewObjectUrl();
    if (objectUrl) return objectUrl;
    return this.planta()?.photo_url ?? '/placeholder.png';
  });

  plantaForm = form(this.plantaFormModel, (schemaPath) => {
    required(schemaPath.name, { message: 'El nombre es obligatorio.' });

    required(schemaPath.capacity, { message: 'La capacidad es obligatoria.' });
    validate(schemaPath.capacity, ({ value }) => {
      if (value() <= 0) {
        return { kind: 'capacity-invalid', message: 'La capacidad debe ser mayor que 0.' };
      }
      return undefined;
    });

    required(schemaPath.latitude, { message: 'La latitud es obligatoria.' });
    validate(schemaPath.latitude, ({ value }) => {
      if (value() < -90 || value() > 90) {
        return { kind: 'latitude-invalid', message: 'La latitud debe estar entre -90 y 90.' };
      }
      return undefined;
    });

    required(schemaPath.longitude, { message: 'La longitud es obligatoria.' });
    validate(schemaPath.longitude, ({ value }) => {
      if (value() < -180 || value() > 180) {
        return { kind: 'longitude-invalid', message: 'La longitud debe estar entre -180 y 180.' };
      }
      return undefined;
    });
  });

  constructor() {
    effect(() => {
      const planta = this.planta();
      if (!planta) return;

      this.plantaForm.name().value.set(planta.name);
      this.plantaForm.description().value.set(planta.description ?? '');
      this.plantaForm.active().value.set(planta.active);
      this.plantaForm.capacity().value.set(planta.capacity);
      this.plantaForm.latitude().value.set(planta.latitude);
      this.plantaForm.longitude().value.set(planta.longitude);

      this.initialFormValues.set({
        name: planta.name,
        description: planta.description ?? '',
        active: planta.active,
        capacity: planta.capacity,
        latitude: planta.latitude,
        longitude: planta.longitude,
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.id.set(this._route.snapshot.paramMap.get('id'));

    const id = this.id();
    if (!id) return;
    this._plantaService.readPlantaById(id);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (
      this.plantaForm.name().invalid() ||
      this.plantaForm.description().invalid() ||
      this.plantaForm.active().invalid() ||
      this.plantaForm.capacity().invalid() ||
      this.plantaForm.latitude().invalid() ||
      this.plantaForm.longitude().invalid()
    )
      return;

    const formValue = this.plantaFormModel();
    const payload = {
      ...formValue,
      capacity: Number(formValue.capacity),
      latitude: Number(formValue.latitude),
      longitude: Number(formValue.longitude),
    };

    if (this.isEditing()) {
      const id = this.id();
      if (!id) return;

      const updatedPlanta = await this._plantaService.updatePlanta(
        id,
        payload,
        this.selectedPhoto(),
      );
      if (updatedPlanta) {
        await this._router.navigate(['/plantas', updatedPlanta.id]);
        this._toastService.show('Planta actualizada correctamente', 'success');
        return;
      }
      this._toastService.show('No se pudo actualizar la planta. Intentalo de nuevo.', 'error');
      return;
    }

    const createdPlanta = await this._plantaService.createPlanta(payload, this.selectedPhoto());
    if (createdPlanta) {
      await this._router.navigate(['/plantas', createdPlanta.id]);
      this._toastService.show('Planta creada correctamente', 'success');
      return;
    }
    this._toastService.show('No se pudo crear la planta. Intentalo de nuevo.', 'error');
  }

  async onCancelClick(cancelDialog: HTMLDialogElement) {
    if (this.hasUnsavedChanges()) {
      cancelDialog.showModal();
      return;
    }

    await this._router.navigate(this.cancelLink());
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedPhoto.set(file);

    this.revokePreviewObjectUrl();
    if (file) {
      this.previewObjectUrl.set(URL.createObjectURL(file));
    }
  }

  private revokePreviewObjectUrl() {
    const currentObjectUrl = this.previewObjectUrl();
    if (!currentObjectUrl) return;

    URL.revokeObjectURL(currentObjectUrl);
    this.previewObjectUrl.set(null);
  }

  async setCurrentPosition(): Promise<void> {
    try {
      const pos = await this._geolocationService.getCurrentPosition();
      this.plantaForm.latitude().value.set(pos.coords.latitude);
      this.plantaForm.longitude().value.set(pos.coords.longitude);
      this._toastService.show('Ubicacion obtenida correctamente.', 'info');
    } catch (error) {
      console.error(error);
      this._toastService.show('No se pudo obtener tu ubicacion actual.', 'warning');
    }
  }

  ngOnDestroy(): void {
    this.revokePreviewObjectUrl();
  }
}
