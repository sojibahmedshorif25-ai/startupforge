import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiUsers, FiGrid, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const industries = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI', 'Blockchain', 'Other'];

export default function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (industry) params.industry = industry;
      const { data } = await api.get('/startups/all', { params });
      setStartups(data.startups);
      setTotalPages(data.pages);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchStartups(); }, [page, industry]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Browse Startups</h1>
        <p className="text-gray-500 text-lg">Discover innovative startups looking for talented collaborators</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8">
        {industries.map(ind => (
          <button key={ind} onClick={() => { setIndustry(ind === 'All' ? '' : ind); setPage(1); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              (ind === 'All' && !industry) || industry === ind
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
            }`}>{ind}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>
      ) : startups.length === 0 ? (
        <div className="text-center py-20">
          <FiGrid className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No startups found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup, i) => (
              <motion.div
                key={startup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden card-hover group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  {startup.logo ? (
                    <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-contain p-8 relative z-10" />
                  ) : (
                    <div className="flex items-center justify-center h-full relative z-10">
                      <span className="text-6xl font-extrabold text-white/80">{startup.startup_name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">{startup.industry}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{startup.startup_name}</h3>
                  <p className="text-gray-500 text-sm mb-3">by {startup.founder_name}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{startup.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiUsers className="mr-1.5" size={14} />
                      {startup.team_size_needed} needed
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{startup.funding_stage}</span>
                  </div>
                  <Link to={`/startups/${startup._id}`}
                    className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-600/25">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    page === p
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
