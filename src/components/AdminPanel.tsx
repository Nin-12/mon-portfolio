import { logout } from '../utils/auth';
import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useStorage } from '../hooks/useStorage';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase';


const AdminPanel: React.FC = () => {
  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) {
      window.location.href = '/';
    }
  });
}, []);

  const { projects, saveProject, deleteProject, uploadFile } = useStorage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !category) {
      alert('Titre et catégorie obligatoires');
      return;
    }

    const thumbnailUrl = thumbnail
      ? await uploadFile(thumbnail)
      : undefined;

    const imagesUrls: string[] = [];
    for (const img of images) {
      imagesUrls.push(await uploadFile(img));
    }

    const pdfUrl = pdf ? await uploadFile(pdf) : undefined;

    // ⚠️ IMPORTANT : on n’utilise PAS le type Project complet
    await saveProject({
      title,
      category,
      description,
      thumbnail: thumbnailUrl,
      images: imagesUrls,
      pdf: pdfUrl,
    });

    alert('Projet ajouté !');

    // Reset form
    setTitle('');
    setCategory('');
    setDescription('');
    setThumbnail(null);
    setImages([]);
    setPdf(null);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Admin Panel - Ajouter un projet
      </h2>

      <button
          onClick={async () => {
            await logout();
            window.location.href = '/';
          }}
          className="mb-4 px-4 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
        >
          Se déconnecter
      </button>

      <form className="flex flex-col gap-3 mb-6" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="p-2 rounded bg-[var(--glass)] border border-[var(--accent)]"
        />

        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="p-2 rounded bg-[var(--glass)] border border-[var(--accent)]"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="p-2 rounded bg-[var(--glass)] border border-[var(--accent)]"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            e.target.files && setThumbnail(e.target.files[0])
          }
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            e.target.files && setImages(Array.from(e.target.files))
          }
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            e.target.files && setPdf(e.target.files[0])
          }
        />

        <button
          type="submit"
          className="bg-[var(--accent)] px-4 py-2 rounded text-[#061019] font-bold hover:bg-yellow-500 transition"
        >
          Ajouter
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Projets existants</h3>
      <ul className="space-y-2">
        {projects.map(p => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 bg-[var(--card)] rounded"
          >
            <span>{p.title}</span>
            <button
              className="text-red-500"
              onClick={() => deleteProject(p.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPanel;
