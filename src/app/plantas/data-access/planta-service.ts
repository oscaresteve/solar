import { computed, inject, Injectable, signal } from '@angular/core';
import { Planta } from '../planta';
import { SupabaseService } from '../../shared/data-access/supabase-service';
import { AuthService } from '../../auth/data-access/auth-service';

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
  private _authService = inject(AuthService);

  private _state = signal<PlantaState>({
    plantas: [],
    loading: false,
    error: false,
  });

  plantas = computed(() => this._state().plantas);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async readPlantas() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));
      const {
        data: { session },
      } = await this._authService.session();
      const { data } = await this._supabaseClient.from('plantas').select('*');
      if (data) {
        this._state.update((state) => ({
          ...state,
          plantas: data,
        }));
      }
    } catch (error) {
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
