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

  private setLoading(loading: boolean) {
    this._state.update((state) => ({
      ...state,
      loading,
    }));
  }

  private setError(error: boolean) {
    this._state.update((state) => ({
      ...state,
      error,
    }));
  }

  private mapPlantaWithPhoto(planta: Planta): Planta {
    return {
      ...planta,
      photo_url: this.getPlantaPhotoUrl(planta.photo_path),
    };
  }

  getPlantaPhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return '/placeholder.png';

    const { data } = this._supabaseClient.storage.from('plantas').getPublicUrl(photoPath);

    return data.publicUrl;
  }

  async uploadPlantaPhoto(file: File, plantaId: string): Promise<string> {
    const filePath = plantaId;

    const { error } = await this._supabaseClient.storage.from('plantas').upload(filePath, file, {
      upsert: true,
    });

    if (error) throw error;

    return filePath;
  }

  async readPlantas() {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient.from('plantas').select('*');

      if (error) throw error;

      if (data) {
        const plantasConFoto = data.map((planta) => this.mapPlantaWithPhoto(planta));

        this._state.update((state) => ({
          ...state,
          plantas: plantasConFoto,
        }));
      }
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }

  async createPlanta(
    planta: Omit<Planta, 'id' | 'created_at' | 'photo_url' | 'user_id'> & { user_id?: string },
  ): Promise<Planta | null> {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient
        .from('plantas')
        .insert(planta)
        .select('*')
        .single();

      if (error) throw error;
      if (!data) return null;

      const plantaConFoto = this.mapPlantaWithPhoto(data);

      this._state.update((state) => ({
        ...state,
        plantas: [plantaConFoto, ...state.plantas],
      }));

      return plantaConFoto;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async updatePlanta(
    id: string,
    changes: Partial<Omit<Planta, 'id' | 'created_at' | 'photo_url'>>,
  ): Promise<Planta | null> {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient
        .from('plantas')
        .update(changes)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      if (!data) return null;

      const plantaConFoto = this.mapPlantaWithPhoto(data);

      this._state.update((state) => ({
        ...state,
        plantas: state.plantas.map((planta) => (planta.id === id ? plantaConFoto : planta)),
      }));

      return plantaConFoto;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async deletePlanta(id: string): Promise<boolean> {
    try {
      this.setLoading(true);
      this.setError(false);

      const { error } = await this._supabaseClient.from('plantas').delete().eq('id', id);

      if (error) throw error;

      this._state.update((state) => ({
        ...state,
        plantas: state.plantas.filter((planta) => planta.id !== id),
      }));

      return true;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  canEditPlanta(ownerUid: string | null | undefined, authUid: string | null | undefined): boolean {
    if (!ownerUid || !authUid) return false;
    return ownerUid === authUid;
  }

  canDeletePlanta(
    ownerUid: string | null | undefined,
    authUid: string | null | undefined,
  ): boolean {
    if (!ownerUid || !authUid) return false;
    return ownerUid === authUid;
  }
}
