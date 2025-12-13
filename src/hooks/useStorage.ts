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

  // CREATE
  const saveProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    await supabase.from('projects').insert(project);
    fetchProjects();
  };

  // DELETE
  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
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
    getProjects: () => projects,
    saveProject,
    deleteProject,
    uploadFile,
    loading
  };
};
