import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiSave, FiX, FiCamera, FiDollarSign, FiZap, FiCheckCircle } from 'react-icons/fi';

export default function MyStartup() {
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 1
  });

  useEffect(() => {
    api.get('/startups').then(({ data }) => {
      if (data) { setStartup(data); setForm({ ...data, logo: data.logo || '' }); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm({ ...form, logo: data.data.url }); toast.success('Logo uploaded!'); }
    } catch { toast.error('Upload failed'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/startups', form);
      setStartup(data); setEditing(false);
      toast.success('Startup profile created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/startups/${startup._id}`, form);
      setStartup(data); setEditing(false);
      toast.success('Startup updated!');
    } catch (err) { toast.error('Failed to update'); }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your startup?')) return;
    try {
      await api.delete(`/startups/${startup._id}`);
      setStartup(null); setForm({ startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 1 });
      toast.success('Startup deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  const industries = ['AI & Data Science', 'HealthTech', 'ClimateTech', 'FinTech', 'EdTech', 'Cybersecurity', 'Robotics & Automation', 'SaaS & DevOps', 'AgriTech', 'Logistics', 'Real Estate Tech'];
  const fundingStages = ['Pre-Seed ($400K)', 'Seed ($1.5M)', 'Series A ($4.2M)', 'Series B ($10M+)', 'Growth'];

  const FormFields = ({ onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-[#07090F] border border-white/10 flex items-center justify-center overflow-hidden">
            {form.logo ? <img src={form.logo} alt="logo" className="w-full h-full object-cover" />
              : <span className="text-3xl font-black text-[#a855f7] drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">{form.startup_name?.charAt(0) || '?'}</span>}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 shadow-lg">
            <FiCamera className="text-white" size={12} />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-extrabold text-white text-sm">Startup Logo & Cover Image</p>
          <p className="text-xs text-slate-400">Upload high-res branding image</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Startup Name</label>
          <input type="text" required value={form.startup_name}
            onChange={(e) => setForm({ ...form, startup_name: e.target.value })} className="input-field" placeholder="e.g., NexusAI Synthetics" />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Industry Sector</label>
          <select required value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field">
            <option value="">Select industry</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Venture Description</label>
        <textarea required value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field" placeholder="Describe your startup mission..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Funding Stage</label>
          <select required value={form.funding_stage}
            onChange={(e) => setForm({ ...form, funding_stage: e.target.value })} className="input-field">
            <option value="">Select funding stage</option>
            {fundingStages.map(fs => <option key={fs} value={fs}>{fs}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Team Roles Needed</label>
          <input type="number" min="1" value={form.team_size_needed}
            onChange={(e) => setForm({ ...form, team_size_needed: Number(e.target.value) })} className="input-field" />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-4 font-extrabold text-base">
        <FiSave className="mr-2" /> {buttonText}
      </button>
    </form>
  );

  if (!startup) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2 text-white">Create Startup Profile</h1>
        <p className="text-slate-400 mb-8">Set up your venture profile to post open positions</p>
        <div className="p-8 rounded-3xl premium-glass">
          <FormFields onSubmit={handleCreate} buttonText="Create Startup Profile" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden rounded-3xl p-4 -m-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl premium-glass relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-colors duration-500"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black uppercase tracking-wider mb-2">
            <FiCheckCircle /> Verified Founder Profile
          </span>
          <h1 className="text-3xl font-black text-white">{startup.startup_name}</h1>
          <p className="text-slate-400 text-sm">Manage venture profile and funding information</p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button onClick={() => navigate('/pricing')} className="btn-ai text-xs py-3 px-5 font-bold">
            <FiDollarSign /> Upgrade Pro
          </button>
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn-secondary py-2.5 px-4 text-xs font-bold">
                <FiEdit2 /> Edit Profile
              </button>
              <button onClick={handleDelete} className="btn-danger text-xs py-2.5 px-4 font-bold">
                <FiTrash2 /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="p-8 rounded-3xl premium-glass max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Edit Startup Profile</h2>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white"><FiX size={20} /></button>
          </div>
          <FormFields onSubmit={handleUpdate} buttonText="Save Startup Updates" />
        </div>
      ) : (
        <div className="rounded-3xl premium-glass overflow-hidden border border-white/10">
          <div className="h-64 relative bg-[#07090F]">
            <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent"></div>
            
            <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              {startup.status === 'approved' ? '✓ Verified Active' : 'Pending Review'}
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
              <div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-black border border-purple-500/30 mb-2 inline-block">
                  {startup.industry}
                </span>
                <h2 className="text-3xl font-black text-white">{startup.startup_name}</h2>
              </div>
              <span className="px-3.5 py-1.5 bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-black">
                {startup.funding_stage}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-white mb-2">Venture Description</h3>
            <p className="text-slate-300 leading-relaxed text-sm mb-8">{startup.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Team Roles Open</p>
                <p className="text-2xl font-black text-white mt-1">{startup.team_size_needed} Members Needed</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Platform Status</p>
                <p className="text-2xl font-black text-emerald-400 mt-1 capitalize">{startup.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </motion.div>
    </div>
  );
}
