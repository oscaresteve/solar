import { Component, inject, OnInit, signal } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../planta';
import { SupabaseService } from '../../services/supabase-service';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);

  plantas = signal<Planta[]>([]);

  ngOnInit(): void {
    this.supabaseService
      .readPlantas()
      .subscribe((plantasSupabase: Planta[]) => this.plantas.set(plantasSupabase));
  }

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }
}
