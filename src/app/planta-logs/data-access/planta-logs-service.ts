import { computed, inject, Injectable, signal } from '@angular/core';
import { PlantaLog } from '../../plantas/interfaces/planta-log';
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

  async readPlantaLogs(plantaId: string) {
    try {
      this.setLoading(true);
      this.setError(false);

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
      this.setError(true);
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  async createPlantaLog(
    plantaLog: Omit<PlantaLog, 'id' | 'created_at'>,
  ): Promise<PlantaLog | null> {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient
        .from('planta_logs')
        .insert(plantaLog)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        this._state.update((state) => ({
          ...state,
          plantaLogs: [...state.plantaLogs, data],
        }));

        return data;
      }
      return null;
    } catch (error) {
      this.setError(true);
      console.error(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }
}
