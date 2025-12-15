import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { logout } from '../utils/auth';
import { useStorage } from '../hooks/useStorage';
import { supabase } from '../utils/supabase';
import AdminProfileForm from './AdminProfileForm';
import type { Project } from '../data/projects';
import { notify } from '../utils/notify';

const AdminPanel: React.FC = () => {
  useEffect(() => {
  let mounted = true;

  const guard = async () => {
    const { data } = await supabase.auth.getUser();

    if (!mounted) return;

    if (!data.user) {
      window.location.href = '/admin';
    }
  };

  guard();

  return () => {
    mounted = false;
  };
}, []);


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
  const [githubUrl, setGithubUrl] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ===================== EDIT ===================== */
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category ?? '');
    setDescription(project.description ?? '');
    setGithubUrl(project.github_url ?? '');
  };

  /* ===================== RESET ===================== */
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setGithubUrl('');
    setThumbnail(null);
    setImages([]);
    setPdf(null);
    setError(null);
  };

  /* ===================== SUBMIT ===================== */
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

      const imagesUrls =
        images.length > 0
          ? (await Promise.all(images.map(uploadFile))).slice(0, 6)
          : [];

      const pdfUrl = pdf ? await uploadFile(pdf) : undefined;

      if (editingId) {
        await updateProject(editingId, {
          title,
          category,
          description,
          github_url: githubUrl || undefined,
          thumbnail: thumbnailUrl,
          images: imagesUrls,
          pdf: pdfUrl,
        });
        notify('Projet modifié avec succès');
      } else {
        await saveProject({
          title,
          category,
          description,
          github_url: githubUrl || undefined,
          thumbnail: thumbnailUrl!,
          images: imagesUrls,
          pdf: pdfUrl,
        });
        notify('Projet ajouté avec succès');
      }

      resetForm();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de l’enregistrement');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6">
      <button
        onClick={async () => {
          await logout();
          window.location.href = '/';
        }}
        className="mb-4 px-4 py-2 rounded bg-red-500 text-white font-bold"
      >
        Se déconnecter
      </button>

      {/* PROFIL ADMIN */}
      <AdminProfileForm />

      {/* FORM PROJET */}
      <div className="p-4 border rounded-xl mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
          {error && (
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          )}

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre *"
            className="admin-input"
          />

          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="Catégorie *"
            className="admin-input"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            className="admin-input"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.files && setThumbnail(e.target.files[0])
            }
            className="admin-input"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                setImages(Array.from(e.target.files).slice(0, 6));
              }
            }}
            className="admin-input"
          />

          <input
            value={githubUrl}
            onChange={e => setGithubUrl(e.target.value)}
            placeholder="Lien GitHub (optionnel)"
            className="admin-input"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              e.target.files && setPdf(e.target.files[0])
            }
            className="admin-input"
          />

          <button
            disabled={submitting}
            className={`bg-[var(--accent)] text-[#061019] font-bold px-6 py-3 rounded-lg shadow-lg transition
              ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
          >
            {submitting
              ? 'Enregistrement…'
              : editingId
              ? 'Mettre à jour'
              : 'Ajouter'}
          </button>
        </form>
      </div>

      {/* LISTE PROJETS */}
      <h3 className="text-xl font-bold mb-2">Projets existants</h3>

      {projects.map(project => (
        <div
          key={project.id}
          className="flex justify-between items-center mb-2"
        >
          <span>{project.title}</span>

          <div className="flex gap-2">
            <button
              className="text-yellow-500"
              onClick={() => handleEdit(project)}
            >
              Modifier
            </button>

            <button
              className="text-red-500"
              onClick={async () => {
                await deleteProject(project.id);
                notify('Projet supprimé');
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AdminPanel;
