import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase-service';

interface UserState {
  first_name: string | null;
  last_name: string | null;
  photo_path: string | null;
  loading: boolean;
  error: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  private readonly _initialState: UserState = {
    first_name: null,
    last_name: null,
    photo_path: null,
    loading: false,
    error: false,
  };

  private _state = signal<UserState>({
    ...this._initialState,
  });

  first_name = computed(() => this._state().first_name);
  last_name = computed(() => this._state().last_name);
  photo_url = computed(() => this.getProfilePhotoUrl(this._state().photo_path));
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

  private async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this._supabaseClient.auth.getUser();
    if (error) throw error;

    return data.user?.id ?? null;
  }

  async readProfile() {
    try {
      this.setLoading(true);
      this.setError(false);

      const uid = await this.getCurrentUserId();
      if (!uid) return;

      const { data, error } = await this._supabaseClient
        .from('profiles')
        .select()
        .eq('id', uid)
        .single();

      if (error) throw error;

      this._state.update((state) => ({
        ...state,
        first_name: data.first_name ?? null,
        last_name: data.last_name ?? null,
        photo_path: data.photo_path ?? null,
      }));
    } catch (error) {
      console.error(error);
      this.setError(true);
    } finally {
      this.setLoading(false);
    }
  }

  getProfilePhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return null;

    const { data } = this._supabaseClient.storage.from('profiles').getPublicUrl(photoPath);
    return `${data.publicUrl}?v=${Date.now()}`;
  }

  private async uploadProfilePhoto(uid: string, file: File): Promise<string> {
    const photoPath = uid;

    const { error } = await this._supabaseClient.storage.from('profiles').upload(photoPath, file, {
      upsert: true,
    });
    if (error) throw error;

    return photoPath;
  }

  async updateProfile(changes: { first_name: string; last_name: string }, file?: File | null) {
    try {
      this.setLoading(true);
      this.setError(false);

      const uid = await this.getCurrentUserId();
      if (!uid) return false;

      let photoPath: string | undefined;
      if (file) {
        photoPath = await this.uploadProfilePhoto(uid, file);
      }

      const payload = photoPath ? { ...changes, photo_path: photoPath } : changes;
      const { data, error } = await this._supabaseClient
        .from('profiles')
        .update(payload)
        .eq('id', uid)
        .select('*')
        .single();
      if (error) throw error;

      this._state.update((state) => ({
        ...state,
        first_name: data.first_name ?? null,
        last_name: data.last_name ?? null,
        photo_path: data.photo_path ?? null,
      }));

      return true;
    } catch (error) {
      console.error(error);
      this.setError(true);
      return false;
    } finally {
      this.setLoading(false);
    }
  }
}
