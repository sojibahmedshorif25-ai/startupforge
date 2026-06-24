import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiUsers, FiCalendar, FiDollarSign, FiArrowLeft, FiBriefcase, FiMail } from 'react-icons/fi';

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
      <p className="text-gray-500 text-lg mb-4">Startup not found</p>
      <Link to="/startups" className="btn-primary">Browse Startups</Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/startups" className="inline-flex items-center text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors group">
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Startups
      </Link>

      <div className="card overflow-hidden">
        <div className="h-64 md:h-80 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          {startup.logo ? (
            <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-contain p-12 relative z-10" />
          ) : (
            <div className="flex items-center justify-center h-full relative z-10">
              <span className="text-8xl font-extrabold text-white/80">{startup.startup_name?.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{startup.startup_name}</h1>
              <p className="text-gray-500 flex items-center"><FiMail className="mr-2" size={16} /> {startup.founder_email}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">{startup.industry}</span>
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">{startup.funding_stage}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: FiUsers, label: 'Team Members', value: startup.team_size_needed },
              { icon: FiCalendar, label: 'Founded', value: new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
              { icon: FiDollarSign, label: 'Funding', value: startup.funding_stage },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-5 rounded-2xl text-center">
                <item.icon className="mx-auto text-blue-600 text-2xl mb-2" />
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">{startup.description}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/opportunities"
              className="btn-primary inline-flex items-center justify-center">
              <FiBriefcase className="mr-2" /> View Open Positions
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
