import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    try {
      const { data } = await api.get('/admin/startups');
      setStartups(data || []);
    } catch (err) {
      toast.error('Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/admin/startups/${id}/approve`);
      toast.success('Startup approved!');
      fetchStartups();
    } catch {
      toast.error('Failed to approve startup');
    }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to remove this startup?')) return;
    try {
      await api.delete(`/admin/startups/${id}`);
      toast.success('Startup removed');
      fetchStartups();
    } catch {
      toast.error('Failed to remove startup');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="loader loader-lg"></div>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Manage Startups</h1>
        <p className="text-slate-400 text-sm">Approve or remove platform startup profiles</p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Startup</th>
                <th className="px-6 py-4">Founder Email</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium">
              {startups.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {s.logo ? (
                        <img src={s.logo} alt={s.startup_name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-black">
                          {s.startup_name?.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-white text-sm">{s.startup_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-mono text-xs">{s.founder_email}</td>
                  <td className="px-6 py-4 text-slate-300 font-semibold">{s.industry}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        s.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {s.status !== 'approved' && (
                        <button
                          onClick={() => approve(s._id)}
                          className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                          title="Approve Startup"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(s._id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors border border-rose-500/30"
                        title="Remove Startup"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
