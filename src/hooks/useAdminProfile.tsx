import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export interface AdminProfile {
  id: string;
  name: string | null;
  avatar: string; // Jamais null côté frontend
  updated_at: string | null;
}

// Avatar par défaut (doit exister dans le storage)
export const DEFAULT_AVATAR =
  'https://xnrvmdellsdeyiuxvsuv.supabase.co/storage/v1/object/public/admin-avatar/admin-avatar/avatar-1765747463893';

interface UseAdminProfileReturn {
  profile: AdminProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<AdminProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string>;
  DEFAULT_AVATAR: string;
}

export const useAdminProfile = (): UseAdminProfileReturn => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);

      // Lecture publique du profil admin
      const { data, error } = await supabase
        .from('admin_profile')
        .select('id, name, avatar, updated_at')
        .single();

      if (!mounted) return;

      if (error) {
        console.error('Erreur fetch admin_profile:', error);
        setProfile(null);
      } else {
        setProfile({
          ...data,
          avatar: data.avatar || DEFAULT_AVATAR, // avatar par défaut
        });
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // Permet à l'admin de mettre à jour son profil (authentifié)
  const updateProfile = async (
    updates: Partial<AdminProfile>
  ): Promise<boolean> => {
    if (!profile) return false;

    const payload = {
      ...updates,
      avatar: updates.avatar || DEFAULT_AVATAR,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('admin_profile')
      .update(payload)
      .eq('id', profile.id);

    if (error) {
      console.error('Erreur update admin_profile:', error);
      return false;
    }

    setProfile(prev => (prev ? { ...prev, ...payload } : prev));
    return true;
  };

  // Upload de l'avatar dans Supabase Storage
  const uploadAvatar = async (file: File): Promise<string> => {
    const path = `admin-avatar/avatar-${Date.now()}`;

    const { error } = await supabase.storage
      .from('admin-avatar')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('admin-avatar')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  return { profile, loading, updateProfile, uploadAvatar, DEFAULT_AVATAR };
};
