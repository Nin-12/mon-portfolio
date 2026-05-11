import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { logout } from '../utils/auth';
import { useStorage } from '../hooks/useStorage';
import { supabase } from '../utils/supabase';
import AdminProfileForm from './AdminProfileForm';
import type { Project } from '../data/projects';
import { notify } from '../utils/notify';
import RichTextEditor from './RichTextEditor';
import DeleteProjectModal from '../hooks/DeleteProjectModal';

type LinkItem = {
  id: string;
  label: string;
  url: string;
};

const AdminPanel: React.FC = () => {
  const {
    projects,
    saveProject,
    updateProject,
    deleteProject,
    uploadFile,
  } = useStorage();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [links, setLinks] = useState<LinkItem[]>([]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= SESSION ================= */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) window.location.replace('/admin');
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  /* ================= RESET ================= */
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setDetails('');
    setGithubUrl('');
    setLinks([]);

    setThumbnail(null);
    setImages([]);
    setPdf(null);
    setError(null);
  };

  /* ================= EDIT ================= */
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category ?? '');
    setDescription(project.description ?? '');
    setDetails(project.details ?? '');
    setGithubUrl(project.github_url ?? '');

    setLinks(
      Array.isArray(project.links)
        ? project.links.map(l => ({
            id: crypto.randomUUID(),
            label: l.label,
            url: l.url,
          }))
        : []
    );

    setThumbnail(null);
    setImages([]);
    setPdf(null);
    setError(null);
  };

  /* ================= LINKS ================= */
  const addLink = () => {
    setLinks(prev => [
      ...prev,
      { id: crypto.randomUUID(), label: '', url: '' }
    ]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const removeLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const cleanLinks = (): LinkItem[] => {
    return links.filter(
      l => l.label.trim() !== '' && l.url.trim() !== ''
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !category.trim()) {
      setError('Titre et catégorie sont obligatoires');
      return;
    }

    if (!editingId && !thumbnail) {
      setError('La miniature est obligatoire pour un nouveau projet');
      return;
    }

    try {
      setSubmitting(true);

      const thumbnailUrl = thumbnail
        ? await uploadFile(thumbnail)
        : undefined;

      let imagesUrls: string[] | undefined;

      if (images.length > 0) {
        imagesUrls = await Promise.all(images.map(uploadFile));
        imagesUrls = imagesUrls.slice(0, 6);
      }

      const pdfUrl = pdf ? await uploadFile(pdf) : undefined;

      const formattedLinks = cleanLinks();

      /* ================= UPDATE ================= */
      if (editingId) {
        await updateProject(editingId, {
          title,
          category,
          description,
          details,
          github_url: githubUrl || undefined,

          // 🔥 FIX IMPORTANT : jamais undefined
          links: formattedLinks,

          ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
          ...(imagesUrls ? { images: imagesUrls } : {}),
          ...(pdfUrl ? { pdf: pdfUrl } : {}),
        });

        notify('Projet modifié avec succès', 'success');
      }

      /* ================= CREATE ================= */
      else {
        await saveProject({
          title,
          category,
          description,
          details,
          github_url: githubUrl || undefined,
          links: formattedLinks,
          thumbnail: thumbnailUrl!,
          images: imagesUrls ?? [],
          pdf: pdfUrl,
        });

        notify('Projet ajouté avec succès', 'success');
      }

      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
      notify('Erreur lors de l’enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteProject(deleteTarget.id);
      notify('Projet supprimé', 'success');
      setDeleteTarget(null);
    } catch {
      notify('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="p-6 text-[var(--text)]">

      <button
        onClick={async () => {
          await logout();
          window.location.href = '/';
        }}
        className="mb-4 px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
      >
        Se déconnecter
      </button>

      <AdminProfileForm />

      <div className="p-4 border border-[var(--glass)] rounded-xl mb-6 bg-[var(--card)]">

        <h3 className="text-lg font-bold mb-4">
          {editingId ? 'Modifier le projet' : 'Ajouter un projet'}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input className="admin-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre *" />
          <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Catégorie *" />
          <textarea className="admin-input" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" />

          <RichTextEditor content={details} onChange={setDetails} placeholder="Détails du projet…" />

          <input className="admin-input" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="GitHub" />

          {/* LINKS */}
          <div className="flex flex-col gap-2">
            <button type="button" onClick={addLink} className="text-sm text-[var(--accent)] font-bold">
              + Ajouter un lien
            </button>

            {links.map(link => (
              <div key={link.id} className="flex gap-2">
                <input
                  className="admin-input"
                  value={link.label}
                  onChange={e => updateLink(link.id, 'label', e.target.value)}
                  placeholder="Label"
                />
                <input
                  className="admin-input"
                  value={link.url}
                  onChange={e => updateLink(link.id, 'url', e.target.value)}
                  placeholder="URL"
                />
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <input type="file" accept="image/*" className="admin-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setThumbnail(e.target.files?.[0] ?? null)
            }
          />

          <input type="file" multiple accept="image/*" className="admin-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImages(Array.from(e.target.files ?? []).slice(0, 6))
            }
          />

          <input type="file" accept="application/pdf" className="admin-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPdf(e.target.files?.[0] ?? null)
            }
          />

          <button disabled={submitting} className="bg-[var(--accent)] text-black font-bold py-3 rounded-lg">
            {submitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>

        </form>
      </div>

      {projects.map(project => (
        <div key={project.id} className="flex justify-between items-center p-2 mb-2 border border-[var(--glass)] rounded bg-[var(--card)]">
          <span className="text-sm font-semibold">{project.title}</span>
          <div className="flex gap-2">
            <button onClick={() => handleEdit(project)} className="text-yellow-500 text-sm">Modifier</button>
            <button onClick={() => setDeleteTarget(project)} className="text-red-500 text-sm">Supprimer</button>
          </div>
        </div>
      ))}

      <DeleteProjectModal
        open={!!deleteTarget}
        title={deleteTarget?.title || ''}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

    </section>
  );
};

export default AdminPanel;