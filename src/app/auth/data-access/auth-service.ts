import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AuthChangeEvent,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface AuthState {
  email: string | null;
  uid: string | null;
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private readonly _initialState: AuthState = {
    email: null,
    uid: null,
    loading: false,
    error: false,
  };

  private _state = signal<AuthState>({
    ...this._initialState,
  });

  email = computed(() => this._state().email);
  uid = computed(() => this._state().uid);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

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

  async readUser() {
    try {
      this.setLoading(true);
      this.setError(false);

      const { data, error } = await this._supabaseClient.auth.getUser();

      if (error) throw error;

      this._state.update((state) => ({
        ...state,
        email: data.user?.email ?? null,
        uid: data.user?.id ?? null,
      }));
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }

  async session() {
    try {
      this.setLoading(true);
      this.setError(false);

      const response = await this._supabaseClient.auth.getSession();
      if (response.error) throw response.error;

      return response;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return { data: { session: null }, error };
    } finally {
      this.setLoading(false);
    }
  }

  async signUp(credentials: SignUpWithPasswordCredentials) {
    try {
      this.setLoading(true);
      this.setError(false);

      const response = await this._supabaseClient.auth.signUp(credentials);
      if (response.error) throw response.error;

      return response;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return { data: { user: null, session: null }, error };
    } finally {
      this.setLoading(false);
    }
  }

  async logIn(credentials: SignInWithPasswordCredentials) {
    try {
      this.setLoading(true);
      this.setError(false);

      const response = await this._supabaseClient.auth.signInWithPassword(credentials);
      if (response.error) throw response.error;

      if (response.data.user) {
        this._state.update((state) => ({
          ...state,
          email: response.data.user.email ?? null,
          uid: response.data.user.id ?? null,
        }));
      }

      return response;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return { data: { user: null, session: null }, error };
    } finally {
      this.setLoading(false);
    }
  }

  async signOut() {
    try {
      this.setLoading(true);
      this.setError(false);

      const response = await this._supabaseClient.auth.signOut();
      if (response.error) throw response.error;

      this._state.update((state) => ({
        ...state,
        email: null,
        uid: null,
      }));

      return response;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return { error };
    } finally {
      this.setLoading(false);
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this._supabaseClient.auth.onAuthStateChange((event, session) =>
      callback(event, session),
    );
  }

  async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this._supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user?.id ?? null;
  }
}
