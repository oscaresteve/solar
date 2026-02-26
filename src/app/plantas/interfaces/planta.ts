export interface Planta {
  id: string;
  created_at: string;
  name: string;
  active: boolean;
  latitude: number;
  longitude: number;
  capacity: number;
  user_id: string;
  photo_path?: string | null;
  photo_url?: string | null;
  description?: string;
}
