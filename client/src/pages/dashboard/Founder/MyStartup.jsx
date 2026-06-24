import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiSave, FiX, FiCamera, FiDollarSign } from 'react-icons/fi';

export default function MyStartup() {
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
      toast.success('Startup created successfully!');
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
    if (!confirm('Are you sure you want to delete your startup? This action cannot be undone.')) return;
    try {
      await api.delete(`/startups/${startup._id}`);
      setStartup(null); setForm({ startup_name: '', logo: '', industry: '', description: '', funding_stage: '', team_size_needed: 1 });
      toast.success('Startup deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleBuyPremium = async () => {
    try {
      const { data } = await api.post('/payments/create-checkout');
      if (data.url) window.location.href = data.url;
    } catch { toast.error('Payment failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI', 'Blockchain', 'Other'];
  const fundingStages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

  const FormFields = ({ onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
            {form.logo ? <img src={form.logo} alt="logo" className="w-full h-full object-contain" />
              : <span className="text-3xl font-bold text-gray-300">{form.startup_name?.charAt(0) || '?'}</span>}
          </div>
          <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg">
            <FiCamera className="text-white" size={14} />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-medium text-gray-900">Startup Logo</p>
          <p className="text-sm text-gray-500">Upload your logo image</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Startup Name</label>
          <input type="text" required value={form.startup_name}
            onChange={(e) => setForm({ ...form, startup_name: e.target.value })} className="input-field" placeholder="e.g., TechFlow" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
          <select required value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })} className="input-field">
            <option value="">Select industry</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
        <textarea required value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field" placeholder="Tell us about your startup..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Funding Stage</label>
          <select required value={form.funding_stage}
            onChange={(e) => setForm({ ...form, funding_stage: e.target.value })} className="input-field">
            <option value="">Select stage</option>
            {fundingStages.map(fs => <option key={fs} value={fs}>{fs}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team Size Needed</label>
          <input type="number" min="1" value={form.team_size_needed}
            onChange={(e) => setForm({ ...form, team_size_needed: Number(e.target.value) })} className="input-field" />
        </div>
      </div>
      <button type="submit" className="btn-primary flex items-center">
        <FiSave className="mr-2" /> {buttonText}
      </button>
    </form>
  );

  if (!startup) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-extrabold mb-2">Create Your Startup</h1>
        <p className="text-gray-500 mb-8">Set up your startup profile to start hiring</p>
        <div className="card p-8 max-w-2xl">
          <FormFields onSubmit={handleCreate} buttonText="Create Startup" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">My Startup</h1>
          <p className="text-gray-500 mt-1">Manage your startup profile</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleBuyPremium} className="btn-secondary flex items-center text-sm">
            <FiDollarSign className="mr-1.5" /> Premium $19.99
          </button>
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn-primary flex items-center text-sm">
                <FiEdit2 className="mr-1.5" /> Edit
              </button>
              <button onClick={handleDelete} className="btn-danger flex items-center text-sm">
                <FiTrash2 className="mr-1.5" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="card p-8 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Edit Startup</h2>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
          </div>
          <FormFields onSubmit={handleUpdate} buttonText="Update Startup" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="h-48 md:h-56 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center relative">
            {startup.logo ? (
              <img src={startup.logo} alt={startup.startup_name} className="h-28 w-28 object-contain" />
            ) : (
              <span className="text-7xl font-extrabold text-white/80">{startup.startup_name?.charAt(0)}</span>
            )}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${
              startup.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {startup.status === 'approved' ? 'Approved' : 'Pending Approval'}
            </div>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-1">{startup.startup_name}</h2>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{startup.industry}</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">{startup.funding_stage}</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{startup.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Team Size Needed</p>
                <p className="text-xl font-bold text-gray-900">{startup.team_size_needed}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Status</p>
                <p className="text-xl font-bold text-gray-900 capitalize">{startup.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
