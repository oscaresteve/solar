export interface Planta {
  id: string;
  created_at: string;
  name: string;
  location: Record<string, any>;
  capacity: number;
  user_id: string;
  photo?: string | null;
  favorite?: boolean | null;
}
