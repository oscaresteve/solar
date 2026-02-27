import { computed, inject, Injectable, signal } from '@angular/core';
import { PlantaLog } from '../../plantas/interfaces/planta-log';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface PlantaLogsState {
  plantaLogs: PlantaLog[];
  plantaId: string | null;
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
export class PlantaLogsService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private readonly _initialState: PlantaLogsState = {
    plantaLogs: [],
    plantaId: null,
    loading: false,
    error: false,
    loaded: false,
    currentPage: 0,
    totalCount: 0,
    pageSize: 3,
  };

  private _state = signal<PlantaLogsState>({
    ...this._initialState,
  });

  plantaLogs = computed(() => this._state().plantaLogs);
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
          plantaId,
        }));
      }
    } catch (error) {
      this.setError(true);
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  async readPlantaLogsWithPagination(plantaId: string, page: number, pageSize: number) {
    try {
      this.setLoading(true);
      this.setError(false);

      const from = page * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await this._supabaseClient
        .from('planta_logs')
        .select('*', { count: 'exact' })
        .eq('planta_id', plantaId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        this._state.update((state) => ({
          ...state,
          plantaLogs: data,
          plantaId,
          totalCount: count ?? 0,
          currentPage: page,
          pageSize,
          loaded: true,
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

  async ensurePlantaLogsLoaded(plantaId: string, pageSize: number) {
    const state = this._state();

    if (state.loaded && state.pageSize === pageSize && plantaId === state.plantaId) return;

    await this.readPlantaLogsWithPagination(plantaId, 0, pageSize);
  }

  nextPage(plantaId: string) {
    const { currentPage, pageSize } = this._state();
    if (this.hasNextPage()) {
      this.readPlantaLogsWithPagination(plantaId, currentPage + 1, pageSize);
    }
  }

  previousPage(plantaId: string) {
    const { currentPage, pageSize } = this._state();
    if (this.hasPreviousPage()) {
      this.readPlantaLogsWithPagination(plantaId, currentPage - 1, pageSize);
    }
  }

  reloadCurrentPage(plantaId: string) {
    const { currentPage, pageSize } = this._state();
    return this.readPlantaLogsWithPagination(plantaId, currentPage, pageSize);
  }
}
