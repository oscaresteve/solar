import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface UserState {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private _state = signal<UserState>({
    first_name: null,
    last_name: null,
    email: null,
    loading: false,
    error: false,
  });

  first_name = computed(() => this._state().first_name);
  last_name = computed(() => this._state().last_name);
  email = computed(() => this._state().email);
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

  async readUser() {
    try {
      this.setLoading(true);
      this.setError(false);

      const {
        data: { user: userData },
        error: userError,
      } = await this._supabaseClient.auth.getUser();

      if (userError) throw userError;

      const { data: profileData, error: profileError } = await this._supabaseClient
        .from('profiles')
        .select('*')
        .single();

      if (profileError) throw profileError;

      this._state.update((state) => ({
        ...state,
        first_name: profileData.first_name ?? null,
        last_name: profileData.last_name ?? null,
        email: userData?.email ?? null,
      }));
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }
}
