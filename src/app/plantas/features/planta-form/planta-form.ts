import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { Navbar } from '../../../shared/features/navbar/navbar';
import { form, FormField, min, minLength, required, validate } from '@angular/forms/signals';
import { GeolocationService } from '../../../shared/data-access/geolocation-service';

interface PlantaFormData {
  name: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-planta-form',
  imports: [Navbar, RouterLink, FormField],
  templateUrl: './planta-form.html',
  styleUrl: './planta-form.scss',
})
export class PlantaForm implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _plantaService = inject(PlantaService);
  private _geolocationService = inject(GeolocationService);

  private plantas = this._plantaService.plantas;

  private id = signal<string | null>(null);

  private selectedPhoto = signal<File | null>(null);

  private previewObjectUrl = signal<string | null>(null);

  private plantaFormModel = signal<PlantaFormData>({
    name: '',
    capacity: 0,
    latitude: 0,
    longitude: 0,
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
    required(schemaPath.name, { message: 'name is required' });

    required(schemaPath.capacity, { message: 'capacity is required' });
    /*     validate(schemaPath.capacity, ({ value }) => {
      if (value() > 0) {
        return { kind: 'capacity-invalid', message: 'capacity must be bigger than 0 ' };
      }
      return undefined;
    }); */

    required(schemaPath.latitude, { message: 'latitude is required' });
    /*     validate(schemaPath.latitude, ({ value }) => {
      if (value() > 0) {
        return { kind: 'latitude-invalid', message: 'latitude must be bigger than 0 ' };
      }
      return undefined;
    }); */

    required(schemaPath.longitude, { message: 'longitude is required' });
    /*     validate(schemaPath.longitude, ({ value }) => {
      if (value() > 0) {
        return { kind: 'longitude-invalid', message: 'longitude must be bigger than 0 ' };
      }
      return undefined;
    }); */
  });

  constructor() {
    effect(() => {
      const planta = this.planta();
      if (!planta) return;

      this.plantaForm.name().value.set(planta.name);
      this.plantaForm.capacity().value.set(planta.capacity);
      this.plantaForm.latitude().value.set(planta.latitude);
      this.plantaForm.longitude().value.set(planta.longitude);
    });
  }

  async ngOnInit(): Promise<void> {
    this.id.set(this._route.snapshot.paramMap.get('id'));

    const id = this.id();
    if (!id) return;

    await this._plantaService.readPlantaById(id);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    const formValue = this.plantaFormModel();
    const payload = {
      ...formValue,
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
      }
      return;
    }

    const createdPlanta = await this._plantaService.createPlanta(payload, this.selectedPhoto());
    if (createdPlanta) {
      await this._router.navigate(['/plantas', createdPlanta.id]);
    }
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
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy(): void {
    this.revokePreviewObjectUrl();
  }
}
