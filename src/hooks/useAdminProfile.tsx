import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { notify } from '../utils/notify';

export interface AdminProfile {
  id: string;
  name: string | null;
  avatar: string;
  subtitle: string | null;
  bio: string | null;
  motto: string | null;
  motto_author: string | null;
  ga_measurement_id: string | null;
  clarity_project_id: string | null;
  updated_at: string | null;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  badge_url: string | null;
  link_url?: string | null;
  sort_order: number;
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
  bac_level?: number | null;
}

export interface Tag {
  id: string;
  label: string;
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
  tags: Tag[];
  tagsLoading: boolean;
  projectCount: number;
  formationYears: number;
  formationYearsLoading: boolean;
  updateProfile: (updates: Partial<AdminProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string>;
  addCertification: (cert: Omit<Certification, 'id' | 'created_at'>) => Promise<boolean>;
  updateCertification: (id: string, updates: Partial<Omit<Certification, 'id' | 'created_at'>>) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;
  moveCertification: (id: string, direction: 'up' | 'down') => Promise<boolean>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<boolean>;
  updateSkill: (id: string, updates: Partial<Omit<Skill, 'id'>>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;
  addTimeline: (item: Omit<TimelineItem, 'id'>) => Promise<boolean>;
  updateTimeline: (id: string, updates: Partial<Omit<TimelineItem, 'id'>>) => Promise<boolean>;
  deleteTimeline: (id: string) => Promise<boolean>;
  addTag: (label: string) => Promise<boolean>;
  deleteTag: (id: string) => Promise<boolean>;
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
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const [formationYears, setFormationYears] = useState(3);
  const [formationYearsLoading, setFormationYearsLoading] = useState(true);

  // ── Fetch tout en parallèle pour la vitesse ──────────────
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      const [profileRes, certsRes, skillsRes, timelineRes, tagsRes, projectsRes, formationRes] = await Promise.all([
        // FIX : select('*') plutôt qu'une liste de colonnes explicite.
        // Si une colonne (ex: ga_measurement_id) n'existe pas encore en base,
        // une liste explicite ferait échouer TOUTE la requête (donc plus de
        // profil affiché nulle part). select('*') ne casse jamais.
        supabase.from('admin_profile').select('*').single(),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('timeline').select('*').order('sort_order', { ascending: true }),
        supabase.from('tags').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.rpc('get_formation_years'),
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

      // Si la table "tags" n'existe pas encore (migration non appliquée),
      // on garde un tableau vide sans rien casser ailleurs.
      if (!tagsRes.error && tagsRes.data) setTags(tagsRes.data);
      setTagsLoading(false);

      if (!projectsRes.error) setProjectCount(projectsRes.count ?? 0);

      // Si la fonction SQL n'existe pas encore (migration non appliquée),
      // on garde la valeur par défaut (3) sans rien casser.
      if (!formationRes.error && typeof formationRes.data === 'number') {
        setFormationYears(formationRes.data);
      }
      setFormationYearsLoading(false);
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

  // ── Realtime : écoute la timeline pour recalculer le niveau BAC+X ──
  useEffect(() => {
    const channel = supabase
      .channel('formation-years')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timeline' }, async () => {
        const { data, error } = await supabase.rpc('get_formation_years');
        if (!error && typeof data === 'number') setFormationYears(data);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Update profil ─────────────────────────────────────────
  const updateProfile = useCallback(async (updates: Partial<AdminProfile>): Promise<boolean> => {
    if (!profile) return false;
    const payload = {
      ...updates,
      // FIX : ne réinitialise plus l'avatar quand on met à jour un autre champ
      // (ex: ga_measurement_id, subtitle, bio...) sans le fournir explicitement.
      avatar: updates.avatar ?? profile.avatar ?? DEFAULT_AVATAR,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('admin_profile').update(payload).eq('id', profile.id);
    if (error) { if (import.meta.env.DEV) console.error(error); return false; }
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
    setCertifications(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
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

  // ── Réordonner une certification (échange sort_order avec le voisin) ──
  const moveCertification = useCallback(async (id: string, direction: 'up' | 'down'): Promise<boolean> => {
    const sorted = [...certifications].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex(c => c.id === id);
    if (index === -1) return false;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return false;

    const current = sorted[index];
    const target = sorted[swapIndex];

    const [{ error: err1 }, { error: err2 }] = await Promise.all([
      supabase.from('certifications').update({ sort_order: target.sort_order }).eq('id', current.id),
      supabase.from('certifications').update({ sort_order: current.sort_order }).eq('id', target.id),
    ]);

    if (err1 || err2) { notify('Erreur lors du réordonnancement', 'error'); return false; }

    setCertifications(prev =>
      prev
        .map(c => {
          if (c.id === current.id) return { ...c, sort_order: target.sort_order };
          if (c.id === target.id) return { ...c, sort_order: current.sort_order };
          return c;
        })
        .sort((a, b) => a.sort_order - b.sort_order)
    );
    return true;
  }, [certifications]);

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

  // ── CRUD Tags ──────────────────────────────────────────────
  const addTag = useCallback(async (label: string): Promise<boolean> => {
    const trimmed = label.trim();
    if (!trimmed) return false;
    const { data, error } = await supabase
      .from('tags')
      .insert({ label: trimmed, sort_order: tags.length })
      .select()
      .single();
    if (error) { notify('Erreur ajout tag', 'error'); return false; }
    setTags(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    notify('Tag ajouté ✓', 'success');
    return true;
  }, [tags.length]);

  const deleteTag = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) { notify('Erreur suppression', 'error'); return false; }
    setTags(prev => prev.filter(t => t.id !== id));
    notify('Tag supprimé', 'info');
    return true;
  }, []);

  return {
    profile, loading,
    certifications, certsLoading,
    skills, skillsLoading,
    timeline, timelineLoading,
    tags, tagsLoading,
    projectCount,
    formationYears, formationYearsLoading,
    updateProfile, uploadAvatar,
    addCertification, updateCertification, deleteCertification, moveCertification,
    addSkill, updateSkill, deleteSkill,
    addTimeline, updateTimeline, deleteTimeline,
    addTag, deleteTag,
    DEFAULT_AVATAR,
  };
};