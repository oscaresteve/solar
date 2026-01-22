import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Planta } from '../planta';
import { SupabaseService } from '../../services/supabase-service';

@Component({
  selector: 'app-planta-detail',
  imports: [],
  templateUrl: './planta-detail.html',
  styleUrl: './planta-detail.css',
})
export class PlantaDetail implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);

  id = input<String>();

  plantas = signal<Planta[]>([]);

  planta = computed(() => {
    return this.plantas().find((p) => p.id.toString() === this.id());
  });

  ngOnInit(): void {
    this.supabaseService
      .readPlantas()
      .subscribe((plantasSupabase: Planta[]) => this.plantas.set(plantasSupabase));
  }
}
