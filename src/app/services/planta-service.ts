import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Injectable, signal } from '@angular/core';
import { Planta } from '../plantas/planta';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PlantaService {
  private supabase: SupabaseClient;

  plantas = signal<Planta[]>([]);

  constructor() {
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  async readPlantas() {
    let { data, error } = await this.supabase.from('plantas').select('*');

    if (error) throw error;

    this.plantas.set(data ?? []);
  }
}
