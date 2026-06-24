import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    try { const { data } = await api.get('/startups/admin/all'); setStartups(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchStartups(); }, []);

  const approve = async (id) => {
    try { await api.put(`/startups/admin/approve/${id}`); toast.success('Startup approved!'); fetchStartups(); }
    catch { toast.error('Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this startup?')) return;
    try { await api.delete(`/startups/admin/remove/${id}`); toast.success('Startup removed'); fetchStartups(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">Manage Startups</h1>
      <p className="text-gray-500 mb-8">Approve or remove startup listings</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Startup</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Founder</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Industry</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {startups.map(s => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {s.startup_name?.charAt(0)}
                      </div>
                      <span className="font-medium">{s.startup_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{s.founder_email}</td>
                  <td className="px-6 py-4">{s.industry}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      s.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                      s.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {s.status !== 'approved' && (
                        <button onClick={() => approve(s._id)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all">
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button onClick={() => remove(s._id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all">
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
