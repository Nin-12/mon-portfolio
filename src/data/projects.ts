export interface Project {
  id: string;
  title: string;
  description?: string;
  details?: string;
  category?: string;
  images: string[];
  thumbnail?: string;
  pdf?: string;
  github_url?: string;
  created_at: string; // ← Supabase
  
  links?: {
    label: string;
    url: string;
  }[];
}



