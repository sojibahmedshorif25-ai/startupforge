import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import { FiUsers, FiBriefcase, FiList, FiDollarSign } from 'react-icons/fi';

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStartups: 0, totalOpportunities: 0, totalRevenue: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { label: 'Total Startups', value: stats.totalStartups, icon: FiBriefcase, bg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { label: 'Total Opportunities', value: stats.totalOpportunities, icon: FiList, bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: FiDollarSign, bg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview and platform metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
              <item.icon size={22} />
            </div>
            <p className="text-4xl font-black text-white mb-1">{item.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
