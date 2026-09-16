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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Manage Startups</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Approve or remove platform startup profiles</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Startup</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Founder Email</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Industry</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {startups.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {s.logo ? (
                        <img src={s.logo} alt={s.startup_name} className="w-9 h-9 rounded-xl object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                          {s.startup_name?.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold text-slate-900 dark:text-white">{s.startup_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{s.founder_email}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-sm">{s.industry}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        s.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : s.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {s.status !== 'approved' && (
                        <button
                          onClick={() => approve(s._id)}
                          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all"
                          title="Approve Startup"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => remove(s._id)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all"
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
