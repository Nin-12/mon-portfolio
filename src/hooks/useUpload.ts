import { supabase } from '../utils/supabase';

export const uploadFile = async (file: File) => {
  //const filePath = `${Date.now()}-${file.name}`;
  const safeName = file.name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9._-]/g, '_');
const filePath = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from('projects-files')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('projects-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
