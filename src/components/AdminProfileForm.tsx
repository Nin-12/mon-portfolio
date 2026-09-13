// src/components/AdminProfileForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';
import type { Certification, Skill, TimelineItem } from '../hooks/useAdminProfile';
import {
  Trash2, Award, Plus, X, Pencil, Check, ChevronUp, ChevronDown, BarChart3, Eye, Tag as TagIcon, Quote,
  Network, Server, Shield, Code2, Globe, Wrench, Users,
} from 'lucide-react';
import { notify } from '../utils/notify';
import DeleteConfirmModal from '../hooks/DeleteConfirmModal';

/* ── Icônes disponibles ── */
const ICON_OPTIONS = [
  { name: 'Network', icon: <Network size={16} /> },
  { name: 'Server',  icon: <Server  size={16} /> },
  { name: 'Shield',  icon: <Shield  size={16} /> },
  { name: 'Code2',   icon: <Code2   size={16} /> },
  { name: 'Globe',   icon: <Globe   size={16} /> },
  { name: 'Wrench',  icon: <Wrench  size={16} /> },
  { name: 'Users',   icon: <Users   size={16} /> },
];

const BADGE_COLORS = [
  { label: 'En cours (violet)', value: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  { label: 'Obtenu (vert)',     value: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  { label: 'Obtenu (ambre)',    value: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
];

/* ════════════════════════════════════════════ */
const AdminProfileForm: React.FC = () => {
  const {
    profile, loading, updateProfile, uploadAvatar, DEFAULT_AVATAR,
    certifications, certsLoading,
    addCertification, updateCertification, deleteCertification, moveCertification,
    skills, skillsLoading,
    addSkill, updateSkill, deleteSkill,
    timeline, timelineLoading,
    addTimeline, updateTimeline, deleteTimeline,
    tags, tagsLoading,
    addTag, deleteTag,
  } = useAdminProfile();

  /* ── Profil ── */
  const [name, setName]       = useState('');
  const [avatar, setAvatar]   = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving]   = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);

  useEffect(() => { if (profile) setName(profile.name ?? ''); }, [profile]);

  /* ── Contenu de la page À propos (sous-titre, bio, citation) ── */
  const [subtitle, setSubtitle]         = useState('');
  const [bio, setBio]                   = useState('');
  const [motto, setMotto]               = useState('');
  const [mottoAuthor, setMottoAuthor]   = useState('');
  const [contentSaving, setContentSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSubtitle(profile.subtitle ?? '');
      setBio(profile.bio ?? '');
      setMotto(profile.motto ?? '');
      setMottoAuthor(profile.motto_author ?? '');
    }
  }, [profile]);

  /* ── Tags ── */
  const [newTag, setNewTag]           = useState('');
  const [tagAdding, setTagAdding]     = useState(false);
  const [tagToDelete, setTagToDelete] = useState<{ id: string; label: string } | null>(null);
  const [deletingTag, setDeletingTag] = useState(false);

  /* ── Analytics (Google Analytics + Microsoft Clarity) ── */
  const [gaId, setGaId]                       = useState('');
  const [clarityId, setClarityId]             = useState('');
  const [analyticsSaving, setAnalyticsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setGaId(profile.ga_measurement_id ?? '');
      setClarityId(profile.clarity_project_id ?? '');
    }
  }, [profile]);

  /* ── Certifications ── */
  const [certTitle,    setCertTitle]    = useState('');
  const [certIssuer,   setCertIssuer]   = useState('');
  const [certBadgeUrl, setCertBadgeUrl] = useState('');
  const [certLinkUrl,  setCertLinkUrl]  = useState('');
  const [certAdding,   setCertAdding]   = useState(false);
  const [editingCert,  setEditingCert]  = useState<Certification | null>(null);

  /* Confirmation suppression certification */
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [deletingCert, setDeletingCert] = useState(false);

  /* ── Skills ── */
  const [skillTitle,   setSkillTitle]   = useState('');
  const [skillText,    setSkillText]    = useState('');
  const [skillIcon,    setSkillIcon]    = useState('Wrench');
  const [skillOrder,   setSkillOrder]   = useState(0);
  const [skillAdding,  setSkillAdding]  = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  /* Confirmation suppression compétence */
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState(false);

  /* ── Timeline ── */
  const [tlYear,    setTlYear]    = useState('');
  const [tlDegree,  setTlDegree]  = useState('');
  const [tlSchool,  setTlSchool]  = useState('');
  const [tlBadge,   setTlBadge]   = useState('Obtenu');
  const [tlColor,   setTlColor]   = useState(BADGE_COLORS[1].value);
  const [tlActive,  setTlActive]  = useState(false);
  const [tlOrder,   setTlOrder]   = useState(0);
  const [tlAdding,  setTlAdding]  = useState(false);
  const [editingTl, setEditingTl] = useState<TimelineItem | null>(null);

  /* Confirmation suppression parcours */
  const [tlToDelete, setTlToDelete] = useState<TimelineItem | null>(null);
  const [deletingTl, setDeletingTl] = useState(false);

  if (loading) return <p className="text-[var(--muted)]">Chargement...</p>;
  if (!profile) return <p className="text-[var(--muted)]">Profil non trouvé</p>;

  /* ── Avatar ── */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      let avatarUrl = profile.avatar;
      if (avatar) avatarUrl = await uploadAvatar(avatar);
      const ok = await updateProfile({
        name: name.trim() || (profile.name ?? ''),
        avatar: avatarUrl || DEFAULT_AVATAR,
      });
      if (ok) {
        notify('Profil mis à jour ✓', 'success');
        setAvatar(null); setPreview('');
        if (fileRef.current) fileRef.current.value = '';
      } else {
        notify('Erreur lors de la mise à jour', 'error');
      }
    } catch {
      notify('Erreur upload avatar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const ok = await updateProfile({ avatar: DEFAULT_AVATAR });
    if (ok) {
      setAvatar(null); setPreview('');
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const currentAvatar = preview || profile.avatar;

  /* ── Contenu À propos (sous-titre / bio / citation) ── */
  const handleSaveContent = async () => {
    setContentSaving(true);
    const ok = await updateProfile({
      subtitle: subtitle.trim() || null,
      bio: bio.trim() || null,
      motto: motto.trim() || null,
      motto_author: mottoAuthor.trim() || null,
    });
    notify(ok ? 'Contenu mis à jour ✓' : 'Erreur lors de la mise à jour', ok ? 'success' : 'error');
    setContentSaving(false);
  };

  /* ── Tags ── */
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    setTagAdding(true);
    await addTag(newTag);
    setNewTag('');
    setTagAdding(false);
  };

  const handleConfirmDeleteTag = async () => {
    if (!tagToDelete) return;
    setDeletingTag(true);
    await deleteTag(tagToDelete.id);
    setDeletingTag(false);
    setTagToDelete(null);
  };

  /* ── Analytics ── */
  const handleSaveAnalytics = async () => {
    setAnalyticsSaving(true);
    const trimmedGa = gaId.trim();
    const trimmedClarity = clarityId.trim();
    const ok = await updateProfile({
      ga_measurement_id: trimmedGa || null,
      clarity_project_id: trimmedClarity || null,
    });
    if (ok) {
      notify('Paramètres analytics mis à jour ✓', 'success');
    } else {
      notify('Erreur lors de la mise à jour', 'error');
    }
    setAnalyticsSaving(false);
  };

  /* ── Certifications ── */
  const handleAddCert = async () => {
    if (!certTitle.trim() || !certIssuer.trim()) return;
    setCertAdding(true);
    await addCertification({
      title: certTitle.trim(), issuer: certIssuer.trim(),
      badge_url: certBadgeUrl.trim() || null,
      link_url:  certLinkUrl.trim()  || null,
      sort_order: certifications.length,
    });
    setCertTitle(''); setCertIssuer(''); setCertBadgeUrl(''); setCertLinkUrl('');
    setCertAdding(false);
  };

  const handleUpdateCert = async () => {
    if (!editingCert) return;
    await updateCertification(editingCert.id, {
      title: editingCert.title, issuer: editingCert.issuer,
      badge_url: editingCert.badge_url, link_url: editingCert.link_url,
    });
    setEditingCert(null);
  };

  /* Confirmation → suppression certification */
  const handleConfirmDeleteCert = async () => {
    if (!certToDelete) return;
    setDeletingCert(true);
    await deleteCertification(certToDelete.id);
    setDeletingCert(false);
    setCertToDelete(null);
  };

  /* ── Skills ── */
  const handleAddSkill = async () => {
    if (!skillTitle.trim() || !skillText.trim()) return;
    setSkillAdding(true);
    await addSkill({
      title: skillTitle.trim(), text: skillText.trim(),
      icon_name: skillIcon, sort_order: skillOrder,
    });
    setSkillTitle(''); setSkillText(''); setSkillIcon('Wrench'); setSkillOrder(0);
    setSkillAdding(false);
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill) return;
    await updateSkill(editingSkill.id, {
      title: editingSkill.title, text: editingSkill.text,
      icon_name: editingSkill.icon_name, sort_order: editingSkill.sort_order,
    });
    setEditingSkill(null);
  };

  /* Confirmation → suppression compétence */
  const handleConfirmDeleteSkill = async () => {
    if (!skillToDelete) return;
    setDeletingSkill(true);
    await deleteSkill(skillToDelete.id);
    setDeletingSkill(false);
    setSkillToDelete(null);
  };

  /* ── Timeline ── */
  const handleAddTl = async () => {
    if (!tlYear.trim() || !tlDegree.trim() || !tlSchool.trim()) return;
    setTlAdding(true);
    await addTimeline({
      year: tlYear.trim(), degree: tlDegree.trim(), school: tlSchool.trim(),
      badge: tlBadge.trim(), badge_color: tlColor,
      active: tlActive, sort_order: tlOrder,
    });
    setTlYear(''); setTlDegree(''); setTlSchool(''); setTlBadge('Obtenu');
    setTlActive(false); setTlOrder(0);
    setTlAdding(false);
  };

  const handleUpdateTl = async () => {
    if (!editingTl) return;
    await updateTimeline(editingTl.id, {
      year: editingTl.year, degree: editingTl.degree, school: editingTl.school,
      badge: editingTl.badge, badge_color: editingTl.badge_color,
      active: editingTl.active, sort_order: editingTl.sort_order,
    });
    setEditingTl(null);
  };

  /* Confirmation → suppression parcours */
  const handleConfirmDeleteTl = async () => {
    if (!tlToDelete) return;
    setDeletingTl(true);
    await deleteTimeline(tlToDelete.id);
    setDeletingTl(false);
    setTlToDelete(null);
  };

  /* ════════ RENDER ════════ */
  return (
    <div className="flex flex-col gap-6 mb-6">

      {/* ══ Modales de confirmation ══ */}
      <DeleteConfirmModal
        open={!!certToDelete}
        label="cette certification"
        itemName={certToDelete?.title}
        loading={deletingCert}
        onCancel={() => setCertToDelete(null)}
        onConfirm={handleConfirmDeleteCert}
      />
      <DeleteConfirmModal
        open={!!skillToDelete}
        label="cette compétence"
        itemName={skillToDelete?.title}
        loading={deletingSkill}
        onCancel={() => setSkillToDelete(null)}
        onConfirm={handleConfirmDeleteSkill}
      />
      <DeleteConfirmModal
        open={!!tlToDelete}
        label="ce parcours académique"
        itemName={tlToDelete?.degree}
        loading={deletingTl}
        onCancel={() => setTlToDelete(null)}
        onConfirm={handleConfirmDeleteTl}
      />
      <DeleteConfirmModal
        open={!!tagToDelete}
        label="ce tag"
        itemName={tagToDelete?.label}
        loading={deletingTag}
        onCancel={() => setTagToDelete(null)}
        onConfirm={handleConfirmDeleteTag}
      />

      {/* ══════════ Profil ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text)]">Profil Admin</h3>

        <div className="flex items-center gap-4 mb-4">
          <img
            key={currentAvatar}
            src={currentAvatar}
            alt="Avatar"
            width={80} height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-[var(--glass)]"
          />
          {avatar && (
            <button
              onClick={() => { setAvatar(null); setPreview(''); if (fileRef.current) fileRef.current.value = ''; }}
              className="text-xs text-red-400 flex items-center gap-1"
            >
              <X size={14} /> Annuler
            </button>
          )}
        </div>

        <input
          type="text" value={name}
          onChange={e => setName(e.target.value)}
          className="admin-input w-full mb-3"
          placeholder="Nom affiché"
        />
        <input
          ref={fileRef} type="file" accept="image/*"
          onChange={handleAvatarChange}
          className="admin-input mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit} disabled={saving}
            className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-60"
          >
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          <button
            onClick={handleRemoveAvatar}
            className="px-5 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            Supprimer l&apos;avatar
          </button>
        </div>
      </div>

      {/* ══════════ Contenu de la page À propos ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-2 text-[var(--text)] flex items-center gap-2">
          <Quote size={20} className="text-cyan-400" /> Contenu de la page À propos
        </h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          Sous-titre, présentation et citation personnelle affichés sur ton profil public.
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-[var(--muted)] mb-1 block">Sous-titre</label>
            <input
              className="admin-input w-full"
              placeholder="Ex : Étudiant en Master 1 · Systèmes, Réseaux & Sécurité"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-[var(--muted)] mb-1 block">Présentation (bio)</label>
            <textarea
              className="admin-input w-full"
              rows={4}
              placeholder="Le paragraphe qui te présente..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <div className="pt-2 border-t border-[var(--glass)]">
            <label className="text-xs text-[var(--muted)] mb-1 block">Citation personnelle</label>
            <textarea
              className="admin-input w-full mb-2"
              rows={3}
              placeholder="Ex : Le talent n'est pas un cadeau, c'est une responsabilité..."
              value={motto}
              onChange={e => setMotto(e.target.value)}
            />
            <input
              className="admin-input w-full"
              placeholder="Auteur (optionnel)"
              value={mottoAuthor}
              onChange={e => setMottoAuthor(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveContent}
            disabled={contentSaving}
            className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-60 self-start"
          >
            {contentSaving ? 'Sauvegarde…' : 'Sauvegarder le contenu'}
          </button>
        </div>
      </div>

      {/* ══════════ Tags / badges ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-2 text-[var(--text)] flex items-center gap-2">
          <TagIcon size={20} className="text-cyan-400" /> Tags <span className="text-sm font-normal text-[var(--muted)]">({tags.length})</span>
        </h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          Les petits badges affichés sous ta bio (ex : Cybersécurité, Linux, Python...).
        </p>

        <div className="flex gap-2 mb-4">
          <input
            className="admin-input flex-1"
            placeholder="Nouveau tag (ex : Docker)"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
          />
          <button
            onClick={handleAddTag}
            disabled={tagAdding || !newTag.trim()}
            className="flex items-center gap-2 bg-[var(--accent)] text-[#061019] font-bold px-4 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>

        {tagsLoading ? (
          <p className="text-sm text-[var(--muted)]">Chargement…</p>
        ) : tags.length === 0 ? (
          <p className="text-sm text-[var(--muted)] italic">Aucun tag pour l&apos;instant.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-[var(--glass)] bg-[var(--bg)] text-[var(--text)]"
              >
                {tag.label}
                <button
                  onClick={() => setTagToDelete({ id: tag.id, label: tag.label })}
                  className="text-[var(--muted)] hover:text-red-400 transition"
                  aria-label={`Supprimer ${tag.label}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ══════════ Analytics (Google Analytics + Microsoft Clarity) ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-2 text-[var(--text)] flex items-center gap-2">
          <BarChart3 size={20} className="text-cyan-400" /> Analytics
        </h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          Configure le suivi d&apos;audience du site public (visiteurs, pages vues, appareils, provenance...).
          Laisse un champ vide puis sauvegarde pour désactiver l&apos;outil correspondant.
        </p>

        <div className="flex flex-col gap-4">
          {/* Google Analytics 4 */}
          <div>
            <label className="text-xs text-[var(--muted)] mb-1 block">
              Google Analytics 4 — ID de mesure
            </label>
            <input
              className="admin-input"
              placeholder="G-XXXXXXXXXX"
              value={gaId}
              onChange={e => setGaId(e.target.value)}
            />
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Disponible dans Google Analytics → Admin → Flux de données.
            </p>
          </div>

          {/* Microsoft Clarity */}
          <div>
            <label className="text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
              <Eye size={12} /> Microsoft Clarity — ID de projet
            </label>
            <input
              className="admin-input"
              placeholder="ex: abcd1234ef"
              value={clarityId}
              onChange={e => setClarityId(e.target.value)}
            />
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Disponible dans Clarity → Paramètres → Configuration (Project ID).
            </p>
          </div>

          <button
            onClick={handleSaveAnalytics}
            disabled={analyticsSaving}
            className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-60 self-start"
          >
            {analyticsSaving ? 'Sauvegarde…' : 'Sauvegarder les paramètres analytics'}
          </button>
        </div>

        {(profile.ga_measurement_id || profile.clarity_project_id) && (
          <div className="mt-3 flex flex-col gap-1">
            {profile.ga_measurement_id && (
              <p className="text-xs text-emerald-400">✓ Google Analytics actif ({profile.ga_measurement_id})</p>
            )}
            {profile.clarity_project_id && (
              <p className="text-xs text-emerald-400">✓ Microsoft Clarity actif ({profile.clarity_project_id})</p>
            )}
          </div>
        )}
      </div>

      {/* ══════════ Certifications ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text)]">
          Certifications <span className="ml-2 text-sm font-normal text-[var(--muted)]">({certifications.length})</span>
        </h3>

        {/* Formulaire ajout */}
        <div className="flex flex-col gap-2 mb-4 p-4 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
          <p className="text-sm font-semibold text-[var(--muted)] mb-1">Ajouter une certification</p>
          <input className="admin-input" placeholder="Titre *"                    value={certTitle}    onChange={e => setCertTitle(e.target.value)} />
          <input className="admin-input" placeholder="Émetteur (ex : Cisco) *"   value={certIssuer}   onChange={e => setCertIssuer(e.target.value)} />
          <input className="admin-input" placeholder="URL badge/logo (optionnel)" value={certBadgeUrl} onChange={e => setCertBadgeUrl(e.target.value)} />
          <input className="admin-input" placeholder="Lien cliquable (optionnel)" value={certLinkUrl}  onChange={e => setCertLinkUrl(e.target.value)} />
          <button
            onClick={handleAddCert}
            disabled={certAdding || !certTitle.trim() || !certIssuer.trim()}
            className="flex items-center justify-center gap-2 bg-[var(--accent)] text-[#061019] font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Plus size={16} /> {certAdding ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>

        {/* Liste — déjà triée par sort_order via le hook */}
        {certsLoading
          ? <p className="text-sm text-[var(--muted)]">Chargement…</p>
          : certifications.length === 0
            ? <p className="text-sm text-[var(--muted)] italic">Aucune certification.</p>
            : (
              <div className="flex flex-col gap-2">
                {certifications.map((cert: Certification, index: number) => (
                  <div key={cert.id} className="flex flex-col gap-2 p-3 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
                    {editingCert?.id === cert.id ? (
                      <div className="flex flex-col gap-2">
                        <input className="admin-input" value={editingCert.title}          onChange={e => setEditingCert({ ...editingCert, title: e.target.value })}               placeholder="Titre" />
                        <input className="admin-input" value={editingCert.issuer}         onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })}              placeholder="Émetteur" />
                        <input className="admin-input" value={editingCert.badge_url ?? ''} onChange={e => setEditingCert({ ...editingCert, badge_url: e.target.value || null })} placeholder="URL badge" />
                        <input className="admin-input" value={editingCert.link_url  ?? ''} onChange={e => setEditingCert({ ...editingCert, link_url:  e.target.value || null })} placeholder="Lien cliquable" />
                        <div className="flex gap-2">
                          <button onClick={handleUpdateCert}        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"><Check size={14} /> Sauvegarder</button>
                          <button onClick={() => setEditingCert(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--glass)] text-[var(--muted)] text-xs"><X size={14} /> Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {cert.badge_url
                            ? <img src={cert.badge_url} alt={cert.title} width={36} height={36} className="w-9 h-9 rounded-lg object-contain border border-[var(--glass)]" />
                            : <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"><Award size={18} className="text-amber-400" /></div>
                          }
                          <div>
                            <p className="text-sm font-semibold text-[var(--text)]">{cert.title}</p>
                            <p className="text-xs text-[var(--muted)]">{cert.issuer}</p>
                            {cert.link_url && <p className="text-xs text-cyan-400 truncate max-w-[180px]">{cert.link_url}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Réordonnancement */}
                          <div className="flex flex-col">
                            <button
                              onClick={() => moveCertification(cert.id, 'up')}
                              disabled={index === 0}
                              className="text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Monter"
                            >
                              <ChevronUp size={15} />
                            </button>
                            <button
                              onClick={() => moveCertification(cert.id, 'down')}
                              disabled={index === certifications.length - 1}
                              className="text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Descendre"
                            >
                              <ChevronDown size={15} />
                            </button>
                          </div>
                          <button onClick={() => setEditingCert(cert)}  className="text-yellow-400 hover:text-yellow-500 p-1"><Pencil size={15} /></button>
                          <button onClick={() => setCertToDelete(cert)} className="text-red-400 hover:text-red-500 p-1"><Trash2 size={15} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* ══════════ Compétences ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text)]">
          Compétences <span className="ml-2 text-sm font-normal text-[var(--muted)]">({skills.length})</span>
        </h3>

        <div className="flex flex-col gap-2 mb-4 p-4 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
          <p className="text-sm font-semibold text-[var(--muted)] mb-1">Ajouter une compétence</p>
          <input className="admin-input" placeholder="Titre *"        value={skillTitle} onChange={e => setSkillTitle(e.target.value)} />
          <textarea className="admin-input" placeholder="Description *" rows={2} value={skillText} onChange={e => setSkillText(e.target.value)} />
          <div className="flex gap-2 flex-wrap">
            {ICON_OPTIONS.map(opt => (
              <button
                key={opt.name} type="button"
                onClick={() => setSkillIcon(opt.name)}
                className={`p-2 rounded-lg border text-[var(--text)] transition ${skillIcon === opt.name ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--glass)]'}`}
              >
                {opt.icon}
              </button>
            ))}
          </div>
          <input className="admin-input" type="number" placeholder="Ordre d'affichage" value={skillOrder} onChange={e => setSkillOrder(Number(e.target.value))} />
          <button
            onClick={handleAddSkill}
            disabled={skillAdding || !skillTitle.trim() || !skillText.trim()}
            className="flex items-center justify-center gap-2 bg-[var(--accent)] text-[#061019] font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Plus size={16} /> {skillAdding ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>

        {skillsLoading
          ? <p className="text-sm text-[var(--muted)]">Chargement…</p>
          : (
            <div className="flex flex-col gap-2">
              {skills.map(skill => (
                <div key={skill.id} className="p-3 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
                  {editingSkill?.id === skill.id ? (
                    <div className="flex flex-col gap-2">
                      <input className="admin-input" value={editingSkill.title} onChange={e => setEditingSkill({ ...editingSkill, title: e.target.value })} />
                      <textarea className="admin-input" rows={2} value={editingSkill.text} onChange={e => setEditingSkill({ ...editingSkill, text: e.target.value })} />
                      <div className="flex gap-2 flex-wrap">
                        {ICON_OPTIONS.map(opt => (
                          <button key={opt.name} type="button"
                            onClick={() => setEditingSkill({ ...editingSkill, icon_name: opt.name })}
                            className={`p-2 rounded-lg border text-[var(--text)] transition ${editingSkill.icon_name === opt.name ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--glass)]'}`}
                          >
                            {opt.icon}
                          </button>
                        ))}
                      </div>
                      <input className="admin-input" type="number" value={editingSkill.sort_order} onChange={e => setEditingSkill({ ...editingSkill, sort_order: Number(e.target.value) })} />
                      <div className="flex gap-2">
                        <button onClick={handleUpdateSkill}          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"><Check size={14} /> Sauvegarder</button>
                        <button onClick={() => setEditingSkill(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--glass)] text-[var(--muted)] text-xs"><X size={14} /> Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{skill.title}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-2">{skill.text}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setEditingSkill(skill)}  className="text-yellow-400 hover:text-yellow-500 p-1"><Pencil size={15} /></button>
                        <button onClick={() => setSkillToDelete(skill)} className="text-red-400 hover:text-red-500 p-1"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* ══════════ Parcours académique ══════════ */}
      <div className="p-5 border border-[var(--glass)] rounded-2xl bg-[var(--card)]">
        <h3 className="text-lg font-bold mb-2 text-[var(--text)]">
          Parcours académique <span className="ml-2 text-sm font-normal text-[var(--muted)]">({timeline.length})</span>
        </h3>
        <p className="text-xs text-[var(--muted)] mb-4">
          Le niveau « BAC+X » affiché sur le site public est calculé automatiquement à partir du nom du diplôme
          (ex : « Licence » → BAC+3, « Master 1 » → BAC+4, « Master 2 » → BAC+5) — rien à saisir manuellement.
        </p>

        <div className="flex flex-col gap-2 mb-4 p-4 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
          <p className="text-sm font-semibold text-[var(--muted)] mb-1">Ajouter une entrée</p>
          <input className="admin-input" placeholder="Période (ex: 2022 – 2025) *" value={tlYear}   onChange={e => setTlYear(e.target.value)} />
          <input className="admin-input" placeholder="Diplôme *"                   value={tlDegree} onChange={e => setTlDegree(e.target.value)} />
          <input className="admin-input" placeholder="École *"                     value={tlSchool} onChange={e => setTlSchool(e.target.value)} />
          <input className="admin-input" placeholder="Badge (ex: Obtenu, En cours)" value={tlBadge}  onChange={e => setTlBadge(e.target.value)} />
          <select className="admin-input" value={tlColor} onChange={e => setTlColor(e.target.value)}>
            {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <input className="admin-input" type="number" placeholder="Ordre d'affichage" value={tlOrder} onChange={e => setTlOrder(Number(e.target.value))} />
          <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
            <input type="checkbox" checked={tlActive} onChange={e => setTlActive(e.target.checked)} className="accent-purple-400" />
            Formation en cours (point animé)
          </label>
          <button
            onClick={handleAddTl}
            disabled={tlAdding || !tlYear.trim() || !tlDegree.trim() || !tlSchool.trim()}
            className="flex items-center justify-center gap-2 bg-[var(--accent)] text-[#061019] font-bold py-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            <Plus size={16} /> {tlAdding ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>

        {timelineLoading
          ? <p className="text-sm text-[var(--muted)]">Chargement…</p>
          : (
            <div className="flex flex-col gap-2">
              {timeline.map(item => (
                <div key={item.id} className="p-3 rounded-xl border border-[var(--glass)] bg-[var(--bg)]">
                  {editingTl?.id === item.id ? (
                    <div className="flex flex-col gap-2">
                      <input className="admin-input" value={editingTl.year}   onChange={e => setEditingTl({ ...editingTl, year:   e.target.value })} placeholder="Période" />
                      <input className="admin-input" value={editingTl.degree} onChange={e => setEditingTl({ ...editingTl, degree: e.target.value })} placeholder="Diplôme" />
                      <input className="admin-input" value={editingTl.school} onChange={e => setEditingTl({ ...editingTl, school: e.target.value })} placeholder="École" />
                      <input className="admin-input" value={editingTl.badge}  onChange={e => setEditingTl({ ...editingTl, badge:  e.target.value })} placeholder="Badge" />
                      <select className="admin-input" value={editingTl.badge_color} onChange={e => setEditingTl({ ...editingTl, badge_color: e.target.value })}>
                        {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      <input className="admin-input" type="number" value={editingTl.sort_order} onChange={e => setEditingTl({ ...editingTl, sort_order: Number(e.target.value) })} />
                      <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
                        <input type="checkbox" checked={editingTl.active} onChange={e => setEditingTl({ ...editingTl, active: e.target.checked })} className="accent-purple-400" />
                        En cours
                      </label>
                      <div className="flex gap-2">
                        <button onClick={handleUpdateTl}          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"><Check size={14} /> Sauvegarder</button>
                        <button onClick={() => setEditingTl(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--glass)] text-[var(--muted)] text-xs"><X size={14} /> Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{item.degree}</p>
                        <p className="text-xs text-[var(--muted)]">{item.year} · {item.school}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${item.badge_color}`}>{item.badge}</span>
                          {typeof item.bac_level === 'number' && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                              BAC+{item.bac_level}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setEditingTl(item)}      className="text-yellow-400 hover:text-yellow-500 p-1"><Pencil size={15} /></button>
                        <button onClick={() => setTlToDelete(item)}     className="text-red-400 hover:text-red-500 p-1"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AdminProfileForm;