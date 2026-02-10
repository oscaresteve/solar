import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantaService } from '../../data-access/planta-service';
import { Navbar } from '../../../shared/features/navbar/navbar';

@Component({
  selector: 'app-planta-form',
  imports: [Navbar, RouterLink, ReactiveFormsModule],
  templateUrl: './planta-form.html',
  styleUrl: './planta-form.scss',
})
export class PlantaForm implements OnInit {
  private _route = inject(ActivatedRoute);
  private _plantaService = inject(PlantaService);
  private _formBuilder = inject(FormBuilder);

  plantas = this._plantaService.plantas;
  id = signal<string | null>(null);
  photoFile = signal<File | null>(null);

  form = this._formBuilder.group({
    name: ['', [Validators.required]],
    capacity: [null as number | null, [Validators.required]],
    latitude: [''],
    longitude: [''],
    favorite: [false],
  });

  planta = computed(() => {
    const id = this.id();
    if (!id) return null;

    return this.plantas().find((planta) => planta.id.toString() === id) ?? null;
  });

  isEditing = computed(() => Boolean(this.id()));

  private _syncForm = effect(() => {
    const planta = this.planta();
    if (!planta) {
      this.photoFile.set(null);
      this.form.reset({
        name: '',
        capacity: null,
        latitude: '',
        longitude: '',
        favorite: false,
      });
      return;
    }

    this.photoFile.set(null);
    this.form.reset({
      name: planta.name ?? '',
      capacity: planta.capacity ?? null,
      latitude: planta.location?.['latitude'] ?? '',
      longitude: planta.location?.['longitude'] ?? '',
      favorite: planta.favorite ?? false,
    });
  });

  ngOnInit(): void {
    this.id.set(this._route.snapshot.paramMap.get('id'));
    this._plantaService.readPlantas();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.photoFile.set(input.files?.[0] ?? null);
  }

  private buildPayload() {
    const { name, capacity, latitude, longitude, favorite } = this.form.getRawValue();

    return {
      name: name ?? '',
      capacity: typeof capacity === 'number' ? capacity : Number(capacity ?? 0),
      location: {
        latitude: latitude ?? '',
        longitude: longitude ?? '',
      },
      favorite: favorite ?? false,
    };
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const id = this.id();

    if (!id) {
      const nueva = await this._plantaService.createPlanta(payload);
      const file = this.photoFile();

      if (nueva && file) {
        const photoPath = await this._plantaService.uploadPlantaPhoto(file, nueva.id);
        await this._plantaService.updatePlanta(nueva.id, { photo_path: photoPath });
      }

      return;
    }

    await this._plantaService.updatePlanta(id, payload);

    const file = this.photoFile();
    if (file) {
      const photoPath = await this._plantaService.uploadPlantaPhoto(file, id);
      await this._plantaService.updatePlanta(id, { photo_path: photoPath });
    }
  }
}
