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
    { name: 'Pending', value: stats.pending || 1 },
    { name: 'Accepted', value: stats.accepted || 1 },
  ];
  const COLORS = ['#f59e0b', '#22c55e'];

  const cards = [
    { label: 'Total Applications', value: stats.totalApplications, icon: FiBriefcase, bg: 'bg-blue-50 text-blue-600' },
    { label: 'Accepted', value: stats.accepted, icon: FiCheckCircle, bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending', value: stats.pending, icon: FiClock, bg: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Collaborator Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your applications and find opportunities</p>
        </div>
        <Link to="/opportunities" className="btn-primary inline-flex items-center">
          <FiShoppingBag className="mr-2" /> Browse Opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {cards.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-6 card-hover">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}><item.icon size={22} /></div>
            <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Application Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={5}>
                {chartData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/opportunities', label: 'Browse Opportunities', icon: FiShoppingBag, color: 'text-blue-600 bg-blue-50' },
              { to: '/dashboard/collaborator/applications', label: 'View My Applications', icon: FiList, color: 'text-purple-600 bg-purple-50' },
              { to: '/dashboard/profile', label: 'Update Profile', icon: FiUser, color: 'text-emerald-600 bg-emerald-50' },
            ].map((link, i) => (
              <Link key={i} to={link.to}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center`}><link.icon size={18} /></div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
