import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase-service';
import { Planta } from '../interfaces/planta';
import { AuthService } from '../../auth/data-access/auth-service';

interface FavoritesState {
  plantasFavorites: Planta[];
  loading: boolean;
  error: boolean;
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthService);

  private readonly _initialState: FavoritesState = {
    plantasFavorites: [],
    loading: false,
    error: false,
    loaded: false,
  };

  private _state = signal<FavoritesState>({
    ...this._initialState,
  });

  plantasFavorites = computed(() => this._state().plantasFavorites);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  resetState() {
    this._state.set({ ...this._initialState });
  }

  private setLoading(loading: boolean) {
    this._state.update((state) => ({ ...state, loading }));
  }

  private setError(error: boolean) {
    this._state.update((state) => ({ ...state, error }));
  }

  isFavorite(plantaId: string): boolean {
    return this.plantasFavorites().some((planta) => planta.id === plantaId);
  }

  async readFavorites(): Promise<Planta[] | null> {
    try {
      this.setLoading(true);
      this.setError(false);

      const userId = await this._authService.getCurrentUserId();
      if (!userId) {
        this._state.update((state) => ({ ...state, plantasFavorites: [], loaded: true }));
        return [];
      }

      const { data: favoriteRows, error: favoritesError } = await this._supabaseClient
        .from('favorites')
        .select('planta_id');

      if (favoritesError) throw favoritesError;

      const plantaIds = favoriteRows?.map((favorite) => favorite.planta_id) ?? [];
      if (plantaIds.length === 0) {
        this._state.update((state) => ({ ...state, plantasFavorites: [], loaded: true }));
        return [];
      }

      const { data: plantas, error: plantasError } = await this._supabaseClient
        .from('plantas')
        .select('*')
        .in('id', plantaIds);

      if (plantasError) throw plantasError;

      const plantasConFoto = (plantas ?? []).map((planta) => this.mapPlantaWithPhotoUrl(planta));

      this._state.update((state) => ({
        ...state,
        plantasFavorites: plantasConFoto,
        loaded: true,
      }));

      return plantasConFoto;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  async toggleFavorite(plantaId: string): Promise<void> {
    try {
      const userId = await this._authService.getCurrentUserId();
      if (!userId) return;

      const existing = this.isFavorite(plantaId);

      if (existing) {
        const { error } = await this._supabaseClient
          .from('favorites')
          .delete()
          .eq('planta_id', plantaId);

        if (error) throw error;

        this._state.update((state) => ({
          ...state,
          plantasFavorites: state.plantasFavorites.filter((planta) => planta.id !== plantaId),
          loaded: true,
        }));
      } else {
        const { error } = await this._supabaseClient
          .from('favorites')
          .insert({ user_id: userId, planta_id: plantaId });

        if (error) throw error;

        const { data: planta, error: plantaError } = await this._supabaseClient
          .from('plantas')
          .select('*')
          .eq('id', plantaId)
          .single();

        if (plantaError) throw plantaError;

        if (planta) {
          const plantaConFoto = this.mapPlantaWithPhotoUrl(planta);
          this._state.update((state) => ({
            ...state,
            plantasFavorites: state.plantasFavorites.some((item) => item.id === plantaConFoto.id)
              ? state.plantasFavorites
              : [...state.plantasFavorites, plantaConFoto],
            loaded: true,
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getPlantaPhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return '/placeholder.png';

    const { data } = this._supabaseClient.storage.from('plantas').getPublicUrl(photoPath);

    return data.publicUrl;
  }

  private mapPlantaWithPhotoUrl(planta: Planta): Planta {
    return {
      ...planta,
      photo_url: this.getPlantaPhotoUrl(planta.photo_path),
    };
  }

  async ensureFavoritesLoaded() {
    if (this._state().loaded) return;
    await this.readFavorites();
  }
}
