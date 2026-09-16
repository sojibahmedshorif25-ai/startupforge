import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiGrid, FiChevronLeft, FiChevronRight, FiBookmark, FiSearch, FiLayers, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const industries = ['All', 'AI & Data Science', 'HealthTech', 'ClimateTech', 'FinTech', 'EdTech', 'Cybersecurity', 'Robotics & Automation', 'SaaS & DevOps', 'AgriTech', 'Logistics', 'Real Estate Tech'];

export default function BrowseStartups() {
  const { bookmarks, toggleBookmark } = useAuth();
  const [startups, setStartups] = useState([]);
  const [industry, setIndustry] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (industry) params.industry = industry;
      const { data } = await api.get('/startups/all', { params });
      let filtered = data.startups || [];
      if (search.trim()) {
        filtered = filtered.filter(s =>
          s.startup_name.toLowerCase().includes(search.toLowerCase()) ||
          s.industry.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      setStartups(filtered);
      setTotalPages(data.pages || 1);
    } catch {
      toast.error('Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [page, industry, search]);

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
          <FiTrendingUp /> 15+ Verified Venture Backed Startups
        </span>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">
          Discover <span className="gradient-text">Next-Gen Startups</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Connect with visionary founders, explore high-impact ventures, and find your next founding role.
        </p>
      </motion.div>

      {/* Search & Category Tabs */}
      <div className="space-y-6 mb-10">
        <div className="relative max-w-xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by startup name, technology, or vision..."
            className="input-field pl-12 pr-4 py-3.5 shadow-lg shadow-indigo-500/5 text-base"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => {
                setIndustry(ind === 'All' ? '' : ind);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                (ind === 'All' && !industry) || industry === ind
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader loader-lg"></div>
        </div>
      ) : startups.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <FiGrid className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4 animate-bounce" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-semibold">No startups found matching your filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {startups.map((startup, i) => {
              const isBookmarked = bookmarks.includes(startup._id);
              return (
                <motion.div
                  key={startup._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card overflow-hidden card-hover group flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-950">
                    <img
                      src={startup.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}
                      alt={startup.startup_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      <button
                        onClick={() => {
                          toggleBookmark(startup._id);
                          toast.success(isBookmarked ? 'Bookmark removed' : 'Startup bookmarked!');
                        }}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                          isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title="Bookmark Startup"
                      >
                        <FiBookmark size={16} />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold text-white border border-white/20 shadow-sm">
                        {startup.industry}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-full">
                        {startup.funding_stage}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {startup.startup_name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-3">
                        Founded by <span className="font-semibold text-slate-700 dark:text-slate-200">{startup.founder_name || 'Visionary Founder'}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {startup.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center font-medium">
                          <FiUsers className="mr-1.5 text-indigo-500" size={15} />
                          {startup.team_size_needed} Roles Open
                        </span>
                        <span className="flex items-center font-medium text-indigo-600 dark:text-indigo-400">
                          <FiLayers className="mr-1" size={14} /> Verified Team
                        </span>
                      </div>
                      <Link
                        to={`/startups/${startup._id}`}
                        className="block w-full text-center py-3 btn-primary text-sm font-bold shadow-lg shadow-indigo-500/20"
                      >
                        Explore Startup
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-11 h-11 rounded-xl font-extrabold transition-all ${
                    page === p
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
