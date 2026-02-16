import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../data-access/planta-service';
import { Navbar } from '../../../shared/features/navbar/navbar';
import { form, FormField, required } from '@angular/forms/signals';

interface plantaFormData {
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
export class PlantaForm implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _plantaService = inject(PlantaService);

  plantas = this._plantaService.plantas;
  id = signal<string | null>(null);

  planta = computed(() => {
    const id = this.id();
    if (!id) return null;

    return this.plantas().find((planta) => planta.id.toString() === id) ?? null;
  });

  isEditing = computed(() => Boolean(this.id()));

  plantaFormModel = signal<plantaFormData>({
    name: '',
    capacity: 0,
    latitude: 0,
    longitude: 0,
  });

  plantaForm = form(this.plantaFormModel, (schemaPath) => {
    required(schemaPath.name, { message: 'name is required' });
    required(schemaPath.capacity, { message: 'capacity is required' });
    required(schemaPath.latitude, { message: 'latitude is required' });
    required(schemaPath.longitude, { message: 'longitude is required' });
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

      const updatedPlanta = await this._plantaService.updatePlanta(id, payload);
      if (updatedPlanta) {
        await this._router.navigate(['/plantas', updatedPlanta.id]);
      }
      return;
    }

    const createdPlanta = await this._plantaService.createPlanta(payload);
    if (createdPlanta) {
      await this._router.navigate(['/plantas', createdPlanta.id]);
    }
  }
}
