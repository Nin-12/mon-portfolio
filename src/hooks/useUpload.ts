import { supabase } from '../utils/supabase';

export const uploadFile = async (file: File) => {
  const filePath = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('projects-files')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('projects-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
