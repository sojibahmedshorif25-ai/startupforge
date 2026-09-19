import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { FiCamera, FiSave, FiUser, FiZap } from 'react-icons/fi';

import { uploadImageToCloud } from '../../utils/imageUpload';

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    image: user?.image || '',
    skills: user?.skills?.join(', ') || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImageToCloud(file);
      if (url) {
        setForm((prev) => ({ ...prev, image: url }));
        toast.success('Image uploaded!');
      } else {
        toast.error('Image upload failed');
      }
    } catch {
      toast.error('Upload failed');
    }
  };

  const handleAIBioGenerate = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/generate-bio', {
        name: form.name,
        role: user?.role,
        primarySkills: form.skills,
        rawNotes: form.bio,
      });
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          bio: data.bio,
          skills: data.extractedSkills.join(', '),
        }));
        toast.success('AI Bio & Skills Generated!');
      }
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      await checkAuth();
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account information and AI bio</p>
        </div>
        <button type="button" onClick={handleAIBioGenerate} disabled={aiLoading} className="btn-ai text-sm">
          <FiZap /> {aiLoading ? 'Generating...' : 'AI Bio & Skill Assistant'}
        </button>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950 flex items-center justify-center overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-900/30">
              {form.image ? (
                <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-slate-400" size={32} />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 shadow-lg">
              <FiCamera className="text-white" size={14} />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Skills</label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Comma separated</span>
            </div>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="input-field"
              placeholder="React, Node.js, UI/UX Design, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Tell founders and collaborators about your passion and expertise..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? <div className="loader mr-2"></div> : <FiSave className="mr-2" size={18} />}
            {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
