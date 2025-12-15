export interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  images: string[];
  thumbnail?: string;
  pdf?: string;
  github_url?: string;
  created_at: string; // ← Supabase
}



