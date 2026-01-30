import { computed, inject, Injectable, signal } from '@angular/core';
import { PlantaLog } from '../../plantas/planta-log';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface PlantaLogsState {
  plantaLogs: PlantaLog[];
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlantaLogsService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private _state = signal<PlantaLogsState>({
    plantaLogs: [],
    loading: false,
    error: false,
  });

  plantaLogs = computed(() => this._state().plantaLogs);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

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
