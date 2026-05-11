import React, { useState } from 'react';
import { useAdminProfile } from '../hooks/useAdminProfile';

const AdminProfileForm: React.FC = () => {
  const {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    DEFAULT_AVATAR,
  } = useAdminProfile();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);

  if (loading) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Profil non trouvé</p>;

  const handleSubmit = async () => {
    let avatarUrl = profile.avatar;

    if (avatar) {
      avatarUrl = await uploadAvatar(avatar);
    }

    await updateProfile({
      name: name || profile.name,
      avatar: avatarUrl || DEFAULT_AVATAR,
    });

    alert('Profil mis à jour');
    setAvatar(null);
  };

  const handleRemoveAvatar = async () => {
    await updateProfile({ avatar: DEFAULT_AVATAR });
    setAvatar(null);
  };

  return (
    <div className="p-4 border rounded-xl mb-6">
      <h3 className="text-xl font-bold mb-4">Profil Admin</h3>

      <img
        src={avatar ? URL.createObjectURL(avatar) : profile.avatar}
        alt="Avatar admin"
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />

      <input
        type="text"
        value={name || profile.name || ''}
        onChange={e => setName(e.target.value)}
        className="admin-input w-full mb-2"
        placeholder="Nom"
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => e.target.files && setAvatar(e.target.files[0])}
        className="admin-input mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-[var(--accent)] text-[#061019] font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Sauvegarder
        </button>

        <button
          onClick={handleRemoveAvatar}
          className="px-6 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
        >
          Supprimer l’avatar
        </button>
      </div>
    </div>
  );
};

export default AdminProfileForm;
