import { Component, inject, OnInit, signal } from '@angular/core';
import { Planta } from '../planta';
import { CommonModule } from '@angular/common';
import { PlantaTableRow } from '../planta-table-row/planta-table-row';
import { SupabaseService } from '../../services/supabase-service';

@Component({
  selector: 'app-planta-table',
  imports: [CommonModule, PlantaTableRow],
  templateUrl: './planta-table.html',
  styleUrl: './planta-table.css',
})
export class PlantaTable implements OnInit {
  private supabaseService: SupabaseService = inject(SupabaseService);

  plantas = signal<Planta[]>([]);

  ngOnInit(): void {
    this.supabaseService
      .readPlantas()
      .subscribe((plantasSupabase: Planta[]) => this.plantas.set(plantasSupabase));
  }
}
