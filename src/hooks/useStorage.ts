import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';
import { supabase } from '../utils/supabase';

export const useStorage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // READ
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProjects(data);
    setLoading(false);
  };

  // CREATE (ANTI-DOUBLON)
  const saveProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('projects')
      .insert(project);

    if (error) {
      if (error.code === '23505') {
        throw new Error('Projet déjà existant');
      }
      throw error;
    }

    await fetchProjects();
  };

  // UPDATE
  const updateProject = async (
    id: string,
    updates: Partial<Omit<Project, 'id' | 'created_at'>>
  ) => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    await fetchProjects();
  };

  // DELETE
  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchProjects();
  };

  // STORAGE
  const uploadFile = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;

    const { error } = await supabase
      .storage
      .from('projects-files')
      .upload(path, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from('projects-files')
      .getPublicUrl(path);

    return data.publicUrl;
  };

 useEffect(() => {
  const fetchData = async () => {
    await fetchProjects();
  };
  fetchData();
}, []);

  return {
    projects,
    saveProject,
    updateProject,
    deleteProject,
    uploadFile,
    loading,
  };
};
