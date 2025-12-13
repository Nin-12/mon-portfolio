export interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  images: string[];
  thumbnail?: string;
  pdf?: string;
  created_at: string; // ← Supabase
}



