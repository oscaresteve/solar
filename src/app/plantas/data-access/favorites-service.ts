import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface Favorite {
  id: string;
  user_id: string;
  created_at: string;
  planta_id: string;
}

interface FavoritesState {
  favorites: Favorite[];
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private _state = signal<FavoritesState>({
    favorites: [],
    loading: false,
    error: false,
  });

  favorites = computed(() => this._state().favorites);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  private setLoading(loading: boolean) {
    this._state.update((state) => ({ ...state, loading }));
  }

  private setError(error: boolean) {
    this._state.update((state) => ({ ...state, error }));
  }

  isFavorite(plantaId: string): boolean {
    return this.favorites().some((favorite) => favorite.planta_id === plantaId);
  }

  private async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this._supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user?.id ?? null;
  }

  async readFavorites(): Promise<Favorite[] | null> {
    try {
      this.setLoading(true);
      this.setError(false);

      const userId = await this.getCurrentUserId();
      if (!userId) {
        this._state.update((state) => ({ ...state, favorites: [] }));
        return [];
      }

      const { data, error } = await this._supabaseClient
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        this._state.update((state) => ({
          ...state,
          favorites: data,
        }));
        return data;
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

  async toggleFavorite(plantaId: string): Promise<void> {
    try {
      this.setLoading(true);
      this.setError(false);

      const userId = await this.getCurrentUserId();
      if (!userId) return;

      const favorites = this.favorites();
      const existing = favorites.find((favorite) => favorite.planta_id === plantaId);

      if (existing) {
        const { error } = await this._supabaseClient
          .from('favorites')
          .delete()
          .eq('planta_id', existing.planta_id);

        if (error) throw error;

        this._state.update((state) => ({
          ...state,
          favorites: state.favorites.filter(
            (favorite) => favorite.planta_id !== existing.planta_id,
          ),
        }));

        return;
      }

      const { data, error } = await this._supabaseClient
        .from('favorites')
        .insert({ user_id: userId, planta_id: plantaId })
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        this._state.update((state) => ({
          ...state,
          favorites: [...state.favorites, data],
        }));
      }
    } catch (error) {
      console.error(error);
      this.setError(true);
      await this.readFavorites();
    } finally {
      this.setLoading(false);
    }
  }
}
