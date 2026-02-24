import { computed, inject, Injectable, signal } from '@angular/core';
import { Planta } from '../interfaces/planta';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface PlantaState {
  plantas: Planta[];
  loading: boolean;
  error: boolean;
  loaded: boolean;
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlantaService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private readonly _initialState: PlantaState = {
    plantas: [],
    loading: false,
    error: false,
    loaded: false,
    currentPage: 0,
    totalCount: 0,
    pageSize: 3,
  };

  private _state = signal<PlantaState>({
    ...this._initialState,
  });

  plantas = computed(() => this._state().plantas);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);
  currentPage = computed(() => this._state().currentPage);
  totalPages = computed(() => Math.ceil(this._state().totalCount / this._state().pageSize));
  hasPreviousPage = computed(() => this._state().currentPage > 0);
  hasNextPage = computed(() => this._state().currentPage < this.totalPages() - 1);

  resetState() {
    this._state.set({ ...this._initialState });
  }

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

    return `${data.publicUrl}?v=${Date.now()}`;
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

  async readPlantasWithPagination(page: number, pageSize: number) {
    try {
      this.setLoading(true);
      this.setError(false);

      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await this._supabaseClient
        .from('plantas')
        .select('*', { count: 'exact' })
        .range(from, to);

      if (error) throw error;

      if (data) {
        const plantasConFoto = data.map((planta) => this.mapPlantaWithPhotoUrl(planta));

        this._state.update((state) => ({
          ...state,
          plantas: plantasConFoto,
          totalCount: count ?? 0,
          currentPage: page,
          pageSize,
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

  nextPage() {
    const { currentPage, pageSize } = this._state();
    if (this.hasNextPage()) {
      this.readPlantasWithPagination(currentPage + 1, pageSize);
    }
  }

  previousPage() {
    const { currentPage, pageSize } = this._state();
    if (this.hasPreviousPage()) {
      this.readPlantasWithPagination(currentPage - 1, pageSize);
    }
  }

  reloadCurrentPage() {
    const { currentPage, pageSize } = this._state();
    return this.readPlantasWithPagination(currentPage, pageSize);
  }

  async ensurePlantasLoaded(pageSize: number) {
    const state = this._state();

    if (state.loaded && state.pageSize === pageSize) return;

    await this.readPlantasWithPagination(0, pageSize);
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
