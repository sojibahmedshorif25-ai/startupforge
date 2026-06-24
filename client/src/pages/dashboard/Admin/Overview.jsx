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
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Startups', value: stats.totalStartups, icon: FiBriefcase, bg: 'bg-purple-50 text-purple-600' },
    { label: 'Total Opportunities', value: stats.totalOpportunities, icon: FiList, bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: FiDollarSign, bg: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of the platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-6 card-hover">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}><item.icon size={22} /></div>
            <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
