import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../../lib/axios';
import { FiBriefcase, FiCheckCircle, FiClock, FiShoppingBag, FiUser, FiList } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CollaboratorOverview() {
  const [stats, setStats] = useState({ totalApplications: 0, accepted: 0, pending: 0 });

  useEffect(() => {
    api.get('/users/collaborator-stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const chartData = [
    { name: 'Pending', value: stats.pending || 0 },
    { name: 'Accepted', value: stats.accepted || 0 },
  ];
  const COLORS = ['#f59e0b', '#22c55e'];

  const cards = [
    { label: 'Total Applications', value: stats.totalApplications || 0, icon: FiBriefcase, bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { label: 'Accepted', value: stats.accepted || 0, icon: FiCheckCircle, bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { label: 'Pending', value: stats.pending || 0, icon: FiClock, bg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <h1 className="text-3xl font-black text-white">Collaborator Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Track your applications and find founding opportunities</p>
        </div>
        <Link to="/opportunities" className="btn-primary inline-flex items-center shadow-xl shadow-indigo-600/30 font-bold">
          <FiShoppingBag className="mr-2" /> Browse Opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}><item.icon size={22} /></div>
            <p className="text-4xl font-black text-white mb-1">{item.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-black text-white mb-6">Application Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={5}>
                {chartData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', background: '#090d16', border: '1px solid #334155', color: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/opportunities', label: 'Browse Opportunities', icon: FiShoppingBag, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { to: '/dashboard/collaborator/applications', label: 'View My Applications', icon: FiList, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { to: '/dashboard/profile', label: 'Update Profile', icon: FiUser, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            ].map((link, i) => (
              <Link key={i} to={link.to}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center shrink-0 border`}><link.icon size={18} /></div>
                <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
