import { computed, inject, Injectable, signal } from '@angular/core';
import { Planta } from '../planta';
import { SupabaseService } from '../../shared/data-access/supabase-service';
import { AuthService } from '../../auth/data-access/auth-service';
import { PlantaLog } from '../planta-log';

interface PlantaState {
  plantas: Planta[];
  plantaLogs: PlantaLog[];
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
    plantaLogs: [],
    loading: false,
    error: false,
  });

  plantas = computed(() => this._state().plantas);
  plantaLogs = computed(() => this._state().plantaLogs);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async readPlantas() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));

      const { data, error } = await this._supabaseClient.from('plantas').select('*');

      if (error) throw error;

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

  async readLogsDePlanta(plantaId: string) {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));

      const { data, error } = await this._supabaseClient
        .from('planta_logs')
        .select('*')
        .eq('planta_id', plantaId);

      if (error) throw error;

      if (data) {
        this._state.update((state) => ({
          ...state,
          plantaLogs: data,
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
