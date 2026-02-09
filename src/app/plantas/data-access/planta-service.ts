import { computed, inject, Injectable, signal } from '@angular/core';
import { Planta } from '../planta';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface PlantaState {
  plantas: Planta[];
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlantaService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private _state = signal<PlantaState>({
    plantas: [],
    loading: false,
    error: false,
  });

  plantas = computed(() => this._state().plantas);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  getPlantaPhotoUrl(photoPath?: string): string | null {
    if (!photoPath) return '/placeholder.png';

    const { data } = this._supabaseClient.storage.from('plantas').getPublicUrl(photoPath);

    console.log(data);

    return data.publicUrl;
  }

  /* async uploadPlantaPhoto(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = crypto.randomUUID();
    const filePath = `plantas/${fileName}.${fileExt}`;

    const { error } = await this._supabaseClient.storage.from('plantas').upload(filePath, file, {
      upsert: false,
    });

    if (error) throw error;

    return filePath;
  } */

  async readPlantas() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
        error: false,
      }));

      const { data, error } = await this._supabaseClient.from('plantas').select('*');

      if (error) throw error;

      if (data) {
        const plantasConFoto = data.map((planta) => ({
          ...planta,
          photo_url: this.getPlantaPhotoUrl(planta.photo_path),
        }));

        this._state.update((state) => ({
          ...state,
          plantas: plantasConFoto,
        }));
      }
    } catch (error) {
      console.error(error);
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this._state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }
}
