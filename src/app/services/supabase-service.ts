import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Planta } from '../plantas/planta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private http = inject(HttpClient);

  readPlantas(): Observable<Planta[]> {
    return this.http.get<Planta[]>(`${environment.SUPABASE_URL}/rest/v1/plantas?select=*`, {
      headers: new HttpHeaders({
        apikey: environment.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${environment.SUPABASE_ANON_KEY}`,
      }),
    });
  }
}
