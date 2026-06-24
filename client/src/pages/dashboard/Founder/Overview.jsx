import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import { FiBriefcase, FiUsers, FiCheckCircle, FiDollarSign, FiAlertCircle, FiPlus, FiList, FiMail } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FounderOverview() {
  const [stats, setStats] = useState({
    totalOpportunities: 0, totalApplications: 0, acceptedMembers: 0,
    isPremium: false, opportunityCount: 0
  });

  useEffect(() => {
    api.get('/users/founder-stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const chartData = [
    { name: 'Opportunities', value: stats.totalOpportunities, fill: '#3b82f6' },
    { name: 'Applications', value: stats.totalApplications, fill: '#8b5cf6' },
    { name: 'Accepted', value: stats.acceptedMembers, fill: '#22c55e' },
  ];

  const cards = [
    { label: 'Total Opportunities', value: stats.totalOpportunities, icon: FiBriefcase, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FiUsers, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 text-purple-600' },
    { label: 'Accepted Members', value: stats.acceptedMembers, icon: FiCheckCircle, color: 'from-green-500 to-green-600', bg: 'bg-green-50 text-green-600' },
    { label: 'Status', value: stats.isPremium ? 'Premium' : 'Free', icon: FiDollarSign, color: stats.isPremium ? 'from-amber-500 to-amber-600' : 'from-gray-500 to-gray-600', bg: stats.isPremium ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Founder Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your startup and opportunities</p>
        </div>
        <Link to="/dashboard/founder/add-opportunity" className="btn-primary inline-flex items-center">
          <FiPlus className="mr-2" /> Post Opportunity
        </Link>
      </div>

      {!stats.isPremium && stats.opportunityCount >= 3 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <FiAlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-amber-800">Free limit reached</p>
            <p className="text-amber-700 text-sm">You've used all 3 free opportunity slots. <Link to="/dashboard/founder/my-startup" className="font-semibold underline">Purchase premium</Link> to post unlimited opportunities.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-6 card-hover"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
              <item.icon size={22} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            <p className="text-gray-500 text-sm font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-xl font-bold mb-6">Analytics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 13 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 13 }} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-3">
            {[
              { to: '/dashboard/founder/my-startup', label: 'My Startup', icon: FiBriefcase, color: 'text-blue-600 bg-blue-50' },
              { to: '/dashboard/founder/manage-opportunities', label: 'Manage Opportunities', icon: FiList, color: 'text-purple-600 bg-purple-50' },
              { to: '/dashboard/founder/applications', label: 'View Applications', icon: FiMail, color: 'text-green-600 bg-green-50' },
            ].map((link, i) => (
              <Link key={i} to={link.to}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center`}>
                  <link.icon size={18} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
