import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiUsers, FiCalendar, FiDollarSign, FiArrowLeft, FiBriefcase, FiMail, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function StartupDetails() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/startups/${id}`)
      .then(({ data }) => setStartup(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;
  if (!startup) return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-slate-500 text-lg mb-4 font-bold">Startup not found</p>
      <Link to="/startups" className="btn-primary">Browse Startups</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <Link to="/startups" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors group text-sm">
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to All Startups
      </Link>

      <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="h-72 md:h-96 relative overflow-hidden bg-slate-950">
          <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-white border border-white/20 mb-3 inline-block">
                {startup.industry}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{startup.startup_name}</h1>
              <p className="text-slate-300 text-sm font-semibold flex items-center mt-2">
                <FiMail className="mr-2 text-indigo-400" /> {startup.founder_email} (Founder: {startup.founder_name || 'Visionary Leader'})
              </p>
            </div>
            <span className="px-4 py-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 rounded-full text-sm font-black shadow-lg self-start md:self-auto">
              {startup.funding_stage}
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: FiUsers, label: 'Team Roles Open', value: `${startup.team_size_needed} Members Needed` },
              { icon: FiCalendar, label: 'Verified On', value: new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
              { icon: FiDollarSign, label: 'Funding Capital', value: startup.funding_stage },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                <item.icon className="mx-auto text-indigo-600 dark:text-indigo-400 text-3xl mb-2" />
                <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">About {startup.startup_name}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-10">{startup.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link to="/opportunities" className="btn-primary py-4 px-8 text-base font-bold shadow-xl shadow-indigo-600/30">
              <FiBriefcase className="mr-2" /> Explore Open Positions
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
