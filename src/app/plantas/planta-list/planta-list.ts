import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PlantaItem } from '../planta-item/planta-item';
import { Planta } from '../planta';
import { SupabaseService } from '../../services/supabase-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-planta-list',
  imports: [PlantaItem],
  templateUrl: './planta-list.html',
  styleUrl: './planta-list.css',
})
export class PlantaList implements OnInit, OnDestroy {
  private supabaseService: SupabaseService = inject(SupabaseService);

  plantas = signal<Planta[]>([]);
  plantasSubscription?: Subscription;

  ngOnInit(): void {
    this.plantasSubscription = this.supabaseService
      .readPlantas()
      .subscribe((plantasSupabase: Planta[]) => this.plantas.set(plantasSupabase));
  }

  toggleFavorite(planta: Planta) {
    planta.favorite = !planta.favorite;
  }

  ngOnDestroy(): void {
    this.plantasSubscription && this.plantasSubscription.unsubscribe();
  }
}
