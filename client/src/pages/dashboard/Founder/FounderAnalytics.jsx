import { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiClock, FiStar, FiBarChart2 } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

export default function FounderAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    conversionRate: '0%',
  });

  const [timelineData, setTimelineData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/founder');
        const apps = Array.isArray(res.data) ? res.data : [];

        const total = apps.length;
        const accepted = apps.filter((a) => a.status === 'accepted').length;
        const rejected = apps.filter((a) => a.status === 'rejected').length;
        const pending = apps.filter((a) => a.status === 'pending' || !a.status).length;
        const conversion = total > 0 ? `${Math.round((accepted / total) * 100)}%` : '0%';

        setStats({ totalApplications: total, accepted, rejected, pending, conversionRate: conversion });

        setStatusData([
          { name: 'Accepted', value: accepted, color: '#10B981' },
          { name: 'Pending', value: pending, color: '#6366F1' },
          { name: 'Rejected', value: rejected, color: '#EF4444' },
        ]);

        // Mock timeline trend data
        setTimelineData([
          { date: 'Mon', applications: Math.max(1, Math.round(total * 0.1)) },
          { date: 'Tue', applications: Math.max(2, Math.round(total * 0.2)) },
          { date: 'Wed', applications: Math.max(1, Math.round(total * 0.15)) },
          { date: 'Thu', applications: Math.max(4, Math.round(total * 0.35)) },
          { date: 'Fri', applications: Math.max(2, Math.round(total * 0.2)) },
        ]);

        // Mock top skills data
        setSkillsData([
          { skill: 'React', count: 12 },
          { skill: 'Node.js', count: 9 },
          { skill: 'TypeScript', count: 8 },
          { skill: 'Python', count: 5 },
          { skill: 'Tailwind CSS', count: 7 },
        ]);
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
          <FiBarChart2 className="w-3.5 h-3.5" /> Founder Intelligence Suite
        </span>
        <h1 className="text-3xl font-black text-white">Startup Recruitment Analytics</h1>
        <p className="text-slate-300 text-xs mt-1">Real-time metrics on application velocity, conversion rates, and applicant skill distribution.</p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalApplications}</h3>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted Collaborators</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.accepted}</h3>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.pending}</h3>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acceptance Conversion</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400">{stats.conversionRate}</h3>
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Velocity Area Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Application Velocity Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Application Status Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Applicant Skill Distribution */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">Top Skills Represented By Applicants</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData}>
              <XAxis dataKey="skill" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
