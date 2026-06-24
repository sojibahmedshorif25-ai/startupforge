import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { FiCamera, FiSave, FiUser } from 'react-icons/fi';

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', image: user?.image || '',
    skills: user?.skills?.join(', ') || '', bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm({ ...form, image: data.data.url }); toast.success('Image uploaded!'); }
    } catch { toast.error('Upload failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', {
        ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      await checkAuth();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2">Profile</h1>
      <p className="text-gray-500 mb-8">Manage your personal information</p>

      <div className="card p-8">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden ring-4 ring-blue-50">
              {user?.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                : <FiUser className="text-gray-400" size={32} />}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg">
              <FiCamera className="text-white" size={14} />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
            <input type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills</label>
            <input type="text" value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Node.js, UI Design" />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="input-field" placeholder="Tell us about yourself..." />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary flex items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : <FiSave className="mr-2" />}
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
