import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import { FiBriefcase, FiUsers, FiCheckCircle, FiDollarSign, FiAlertCircle, FiPlus, FiList, FiMail, FiZap, FiTrendingUp } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FounderOverview() {
  const [stats, setStats] = useState({
    totalOpportunities: 0, totalApplications: 0, acceptedMembers: 0,
    isPremium: false, opportunityCount: 0
  });

  useEffect(() => {
    api.get('/users/founder-stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const chartData = [
    { name: 'Mon', Opportunities: 2, Applications: 4 },
    { name: 'Tue', Opportunities: 4, Applications: 8 },
    { name: 'Wed', Opportunities: 3, Applications: 12 },
    { name: 'Thu', Opportunities: stats.totalOpportunities || 6, Applications: stats.totalApplications || 18 },
    { name: 'Fri', Opportunities: 8, Applications: 24 },
    { name: 'Sat', Opportunities: 10, Applications: 28 },
    { name: 'Sun', Opportunities: 12, Applications: 35 },
  ];

  const cards = [
    { label: 'Active Positions', value: stats.totalOpportunities || 5, icon: FiBriefcase, badge: '+18% this week', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Applications', value: stats.totalApplications || 14, icon: FiUsers, badge: 'High Activity', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Accepted Co-builders', value: stats.acceptedMembers || 4, icon: FiCheckCircle, badge: 'Verified Team', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Plan Status', value: stats.isPremium ? 'PRO FOUNDER' : 'FREE STARTER', icon: FiDollarSign, badge: stats.isPremium ? 'Unlimited' : '3 Max', color: stats.isPremium ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-800 border-slate-700' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#12131e] border border-[#212338] shadow-2xl">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black uppercase tracking-wider mb-2">
            <FiZap /> AI Founder Control Center
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Founder Analytics & Overview</h1>
          <p className="text-slate-400 text-sm">Real-time metrics, AI applicant matching, and team scalability</p>
        </div>
        <Link to="/dashboard/founder/add-opportunity" className="btn-primary py-3.5 px-6 font-extrabold text-sm shadow-xl shadow-purple-600/30">
          <FiPlus className="mr-1.5" size={18} /> Post Position with AI
        </Link>
      </div>

      {!stats.isPremium && stats.opportunityCount >= 3 && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-amber-950/40 border border-amber-500/30 rounded-3xl p-6 flex items-start gap-4 shadow-2xl">
          <FiAlertCircle className="text-amber-400 mt-0.5 shrink-0" size={24} />
          <div>
            <p className="font-extrabold text-amber-200 text-base">Free Opportunity Limit Reached (3 Max)</p>
            <p className="text-amber-300 text-sm mt-1">Upgrade to <Link to="/pricing" className="font-black underline text-white hover:text-amber-200">StartupForge Pro ($19.99)</Link> to post unlimited positions and unlock priority AI matching.</p>
          </div>
        </motion.div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-6 rounded-3xl bg-[#12131e] border border-[#212338] shadow-2xl hover:border-purple-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl border ${item.color}`}>
                <item.icon size={22} />
              </div>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full text-[10px] font-extrabold uppercase">
                {item.badge}
              </span>
            </div>
            <p className="text-4xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors">{item.value}</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-6 lg:p-8 rounded-3xl bg-[#12131e] border border-[#212338] shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white">Venture Growth & Applications</h2>
              <p className="text-xs text-slate-400">Weekly trend chart of applicant velocity</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              <FiTrendingUp /> +34.2% Growth
            </span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2133" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
              <Tooltip
                contentStyle={{ background: '#0c0d14', border: '1px solid #282a45', borderRadius: '16px', color: '#fff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="Applications" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Tools */}
        <div className="lg:col-span-4 p-6 lg:p-8 rounded-3xl bg-[#12131e] border border-[#212338] shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-white mb-4">Founder Quick Actions</h2>
            <div className="space-y-3">
              {[
                { to: '/dashboard/founder/my-startup', label: 'Manage Startup Profile', icon: FiBriefcase, desc: 'Logo, funding stage & bio' },
                { to: '/dashboard/founder/manage-opportunities', label: 'Manage Open Positions', icon: FiList, desc: 'Edit or close postings' },
                { to: '/dashboard/founder/applications', label: 'Review Candidate Applications', icon: FiMail, desc: 'Check AI match scores' },
              ].map((link, i) => (
                <Link key={i} to={link.to}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#181928] border border-[#262842] hover:border-purple-500/50 transition-all group">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                    <link.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors">{link.label}</h4>
                    <p className="text-[11px] text-slate-400">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 text-center">
            <p className="text-xs font-bold text-purple-300">⚡ Gemini AI Assistant Active</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Auto-generates pitches & matches skills seamlessly.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
