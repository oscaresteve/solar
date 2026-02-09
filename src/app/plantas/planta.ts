export interface Planta {
  id: string;
  created_at: string;
  name: string;
  location: Record<string, any>;
  capacity: number;
  user_id: string;
  photo_path?: string | null;
  photo_url?: string | null;
  favorite?: boolean | null;
}
