export interface Planta {
  id: number;
  created_at: number;
  name: string;
  location: { latitude: number; longitude: number };
  capacity: number;
  user: string;
  photo?: string;
  favorite: Boolean;
}
