export interface PlantaLog {
  id: string;
  created_at: string;
  planta_id: string;
  production: number;
  consumption: number;
  message?: string | null;
}
