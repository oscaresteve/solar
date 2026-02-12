import { computed, inject, Injectable, signal } from '@angular/core';
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface AuthState {
  email: string | null;
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _state = signal<AuthState>({
    email: null,
    loading: false,
    error: false,
  });

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

      const { data, error } = await this._supabaseClient.auth.getUser();

      if (error) throw error;

      this._state.update((state) => ({
        ...state,
        email: data.user.email ?? null,
      }));
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }

  session() {
    return this._supabaseClient.auth.getSession();
  }

  signUp(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signUp(credentials);
  }

  logIn(credentials: SignInWithPasswordCredentials) {
    return this._supabaseClient.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this._supabaseClient.auth.signOut();
  }

  //Detectar cambios de session

  /* onAuthStateChange(callback: (event: string, session: any) => void) {
    return this._supabaseClient.auth.onAuthStateChange(
      (event, session) => callback(event, session)
    );
  } */
}
