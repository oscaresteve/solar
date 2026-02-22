import { computed, inject, Injectable, signal } from '@angular/core';
import { Planta } from '../interfaces/planta';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface PlantaState {
  plantas: Planta[];
  loading: boolean;
  error: boolean;
  loaded: boolean;
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
    loaded: false,
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

  private mapPlantaWithPhotoUrl(planta: Planta): Planta {
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

  async uploadPlantaPhoto(file: File, plantaId: string): Promise<Planta | null> {
    try {
      const photoPath = plantaId;

      const { error } = await this._supabaseClient.storage.from('plantas').upload(photoPath, file, {
        upsert: true,
      });

      if (error) throw error;

      const planta = await this.updatePlantaPhotoPath(photoPath, plantaId);

      if (planta) {
        return planta;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updatePlantaPhotoPath(photoPath: string, id: string): Promise<Planta | null> {
    try {
      const { data, error } = await this._supabaseClient
        .from('plantas')
        .update({ photo_path: photoPath })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        return data;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async readPlantas() {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient.from('plantas').select('*');

      if (error) throw error;

      if (data) {
        const plantasConFoto = data.map((planta) => this.mapPlantaWithPhotoUrl(planta));

        this._state.update((state) => ({
          ...state,
          plantas: plantasConFoto,
          loaded: true,
        }));
      }
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }

  async ensurePlantasLoaded() {
    if (this._state().loaded) return;
    await this.readPlantas();
  }

  async readPlantaById(id: string): Promise<Planta | null> {
    const plantaEnEstado = this._state().plantas.find((planta) => planta.id.toString() === id);
    if (plantaEnEstado) return plantaEnEstado;

    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient
        .from('plantas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const plantaConFoto = this.mapPlantaWithPhotoUrl(data);

        this._state.update((state) => ({
          ...state,
          plantas: [plantaConFoto, ...state.plantas.filter((planta) => planta.id !== data.id)],
        }));

        return plantaConFoto;
      }

      return null;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async createPlanta(
    planta: Omit<Planta, 'id' | 'created_at' | 'user_id' | 'photo_path' | 'photo_url'>,
    file?: File | null,
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

      if (data) {
        const plantaFinal = file ? await this.uploadPlantaPhoto(file, data.id) : data;
        const plantaConFoto = this.mapPlantaWithPhotoUrl(plantaFinal ?? data);

        this._state.update((state) => ({
          ...state,
          plantas: [plantaConFoto, ...state.plantas],
        }));

        return plantaConFoto;
      }

      return null;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async updatePlanta(
    id: string | null,
    changes: Partial<Omit<Planta, 'id' | 'created_at' | 'user_id' | 'photo_path' | 'photo_url'>>,
    file?: File | null,
  ): Promise<Planta | null> {
    if (!id) return null;

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

      if (data) {
        const plantaFinal = file ? await this.uploadPlantaPhoto(file, data.id) : data;
        const plantaConFoto = this.mapPlantaWithPhotoUrl(plantaFinal ?? data);

        this._state.update((state) => ({
          ...state,
          plantas: state.plantas.map((planta) => (planta.id === id ? plantaConFoto : planta)),
        }));

        return plantaConFoto;
      }

      return null;
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

  isPlantaOwner(ownerUid: string | null | undefined, authUid: string | null | undefined): boolean {
    if (!ownerUid || !authUid) return false;
    return ownerUid === authUid;
  }
}
