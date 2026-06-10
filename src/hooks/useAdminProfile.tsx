import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { notify } from '../utils/notify';

export interface AdminProfile {
  id: string;
  name: string | null;
  avatar: string;
  updated_at: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  badge_url: string | null;
  link_url?: string | null;
  created_at: string | null;
}

export interface Skill {
  id: string;
  title: string;
  text: string;
  icon_name: string;
  sort_order: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  degree: string;
  school: string;
  badge: string;
  badge_color: string;
  active: boolean;
  sort_order: number;
}

export const DEFAULT_AVATAR =
  'https://xnrvmdellsdeyiuxvsuv.supabase.co/storage/v1/object/public/admin-avatar/admin-avatar/avatar-1765747463893';

interface UseAdminProfileReturn {
  profile: AdminProfile | null;
  loading: boolean;
  certifications: Certification[];
  certsLoading: boolean;
  skills: Skill[];
  skillsLoading: boolean;
  timeline: TimelineItem[];
  timelineLoading: boolean;
  projectCount: number;
  updateProfile: (updates: Partial<AdminProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string>;
  addCertification: (cert: Omit<Certification, 'id' | 'created_at'>) => Promise<boolean>;
  updateCertification: (id: string, updates: Partial<Omit<Certification, 'id' | 'created_at'>>) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  updateSkill: (id: string, updates: Partial<Omit<Skill, 'id'>>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  addTimeline: (item: Omit<TimelineItem, 'id'>) => Promise<boolean>;
  updateTimeline: (id: string, updates: Partial<Omit<TimelineItem, 'id'>>) => Promise<boolean>;
  deleteTimeline: (id: string) => Promise<boolean>;
  DEFAULT_AVATAR: string;
}

export const useAdminProfile = (): UseAdminProfileReturn => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);

  // ── Fetch tout en parallèle pour la vitesse ──────────────
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      const [profileRes, certsRes, skillsRes, timelineRes, projectsRes] = await Promise.all([
        supabase.from('admin_profile').select('id, name, avatar, updated_at').single(),
        supabase.from('certifications').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('timeline').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
      ]);

      if (!mounted) return;

      if (!profileRes.error && profileRes.data) {
        setProfile({ ...profileRes.data, avatar: profileRes.data.avatar || DEFAULT_AVATAR });
      }
      setLoading(false);

      if (!certsRes.error && certsRes.data) setCertifications(certsRes.data);
      setCertsLoading(false);

      if (!skillsRes.error && skillsRes.data) setSkills(skillsRes.data);
      setSkillsLoading(false);

      if (!timelineRes.error && timelineRes.data) setTimeline(timelineRes.data);
      setTimelineLoading(false);

      if (!projectsRes.error) setProjectCount(projectsRes.count ?? 0);
    };

    loadAll();
    return () => { mounted = false; };
  }, []);

  // ── Realtime : écoute les projets pour incrémenter/décrémenter ──
  useEffect(() => {
    const channel = supabase
      .channel('projects-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, async () => {
        const { count } = await supabase.from('projects').select('id', { count: 'exact', head: true });
        setProjectCount(count ?? 0);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Update profil ─────────────────────────────────────────
  const updateProfile = useCallback(async (updates: Partial<AdminProfile>): Promise<boolean> => {
    if (!profile) return false;
    const payload = {
      ...updates,
      avatar: updates.avatar || DEFAULT_AVATAR,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('admin_profile').update(payload).eq('id', profile.id);
    if (error) { if (import.meta.env.DEV) console.error(error); return false; }
    // FIX #3 : forcer un nouvel objet pour déclencher le re-render
    setProfile(() => ({ ...profile, ...payload }));
    return true;
  }, [profile]);

  // ── Upload avatar (cache-bust) ────────────────────────────
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const path = `admin-avatar/avatar-${timestamp}`;
    const { error } = await supabase.storage.from('admin-avatar').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('admin-avatar').getPublicUrl(path);
    return `${data.publicUrl}?t=${timestamp}`;
  }, []);

  // ── CRUD Certifications ───────────────────────────────────
  const addCertification = useCallback(async (cert: Omit<Certification, 'id' | 'created_at'>): Promise<boolean> => {
    const { data, error } = await supabase.from('certifications').insert(cert).select().single();
    if (error) { notify('Erreur ajout certification', 'error'); return false; }
    setCertifications(prev => [data, ...prev]);
    notify('Certification ajoutée ✓', 'success');
    return true;
  }, []);

  const updateCertification = useCallback(async (id: string, updates: Partial<Omit<Certification, 'id' | 'created_at'>>): Promise<boolean> => {
    const { error } = await supabase.from('certifications').update(updates).eq('id', id);
    if (error) { notify('Erreur modification', 'error'); return false; }
    setCertifications(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    notify('Certification modifiée ✓', 'success');
    return true;
  }, []);

  const deleteCertification = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) { notify('Erreur suppression', 'error'); return false; }
    setCertifications(prev => prev.filter(c => c.id !== id));
    notify('Certification supprimée', 'info');
    return true;
  }, []);

  // ── CRUD Skills ───────────────────────────────────────────
  const addSkill = useCallback(async (skill: Omit<Skill, 'id'>): Promise<boolean> => {
    const { data, error } = await supabase.from('skills').insert(skill).select().single();
    if (error) { notify('Erreur ajout compétence', 'error'); return false; }
    setSkills(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    notify('Compétence ajoutée ✓', 'success');
    return true;
  }, []);

  const updateSkill = useCallback(async (id: string, updates: Partial<Omit<Skill, 'id'>>): Promise<boolean> => {
    const { error } = await supabase.from('skills').update(updates).eq('id', id);
    if (error) { notify('Erreur modification', 'error'); return false; }
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    notify('Compétence modifiée ✓', 'success');
    return true;
  }, []);

  const deleteSkill = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) { notify('Erreur suppression', 'error'); return false; }
    setSkills(prev => prev.filter(s => s.id !== id));
    notify('Compétence supprimée', 'info');
    return true;
  }, []);

  // ── CRUD Timeline ─────────────────────────────────────────
  const addTimeline = useCallback(async (item: Omit<TimelineItem, 'id'>): Promise<boolean> => {
    const { data, error } = await supabase.from('timeline').insert(item).select().single();
    if (error) { notify('Erreur ajout parcours', 'error'); return false; }
    setTimeline(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    notify('Parcours ajouté ✓', 'success');
    return true;
  }, []);

  const updateTimeline = useCallback(async (id: string, updates: Partial<Omit<TimelineItem, 'id'>>): Promise<boolean> => {
    const { error } = await supabase.from('timeline').update(updates).eq('id', id);
    if (error) { notify('Erreur modification', 'error'); return false; }
    setTimeline(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    notify('Parcours modifié ✓', 'success');
    return true;
  }, []);

  const deleteTimeline = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (error) { notify('Erreur suppression', 'error'); return false; }
    setTimeline(prev => prev.filter(t => t.id !== id));
    notify('Parcours supprimé', 'info');
    return true;
  }, []);

  return {
    profile, loading,
    certifications, certsLoading,
    skills, skillsLoading,
    timeline, timelineLoading,
    projectCount,
    updateProfile, uploadAvatar,
    addCertification, updateCertification, deleteCertification,
    addSkill, updateSkill, deleteSkill,
    addTimeline, updateTimeline, deleteTimeline,
    DEFAULT_AVATAR,
  };
};