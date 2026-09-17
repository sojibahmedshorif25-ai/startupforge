import { useState, useEffect } from 'react';
import { FiList, FiTrash2, FiSearch, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

export default function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/opportunities?limit=50');
      const items = res.data.opportunities || res.data || [];
      setOpportunities(items);
    } catch (err) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter((o) =>
    o.role_title?.toLowerCase().includes(search.toLowerCase()) ||
    o.startup_id?.startup_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
          <FiList className="w-3.5 h-3.5" /> Admin Audit Console
        </span>
        <h1 className="text-3xl font-black text-white">Platform Opportunities Moderation</h1>
        <p className="text-slate-300 text-xs mt-1">Audit, inspect, and moderate all posted startup opportunities across the platform.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by position title or startup..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Opportunities Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading opportunities audit log...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No opportunities found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-4">Role Title</th>
                  <th className="pb-3 px-4">Startup</th>
                  <th className="pb-3 px-4">Work Type</th>
                  <th className="pb-3 px-4">Commitment</th>
                  <th className="pb-3 px-4">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {filtered.map((opp) => (
                  <tr key={opp._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{opp.role_title}</td>
                    <td className="py-4 px-4 text-indigo-600 dark:text-indigo-400">{opp.startup_id?.startup_name || 'Startup'}</td>
                    <td className="py-4 px-4 capitalize">{opp.work_type}</td>
                    <td className="py-4 px-4 capitalize">{opp.commitment_level}</td>
                    <td className="py-4 px-4 text-slate-400">{new Date(opp.deadline).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
