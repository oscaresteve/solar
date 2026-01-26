import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  user = signal<User | null>(null);
  session = signal<Session | null>(null);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
    this.initSession();
  }

  private async initSession() {
    const { data } = await this.supabase.auth.getSession();
    this.session.set(data.session ?? null);
    this.user.set(data.session?.user ?? null);

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
    });
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    this.user.set(data.user ?? null);
    this.session.set(data.session ?? null);
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.user.set(null);
    this.session.set(null);
  }

  isAuthenticated() {
    return this.user() !== null;
  }
}
