import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FiUsers, FiGrid, FiChevronLeft, FiChevronRight, FiBookmark,
  FiSearch, FiLayers, FiTrendingUp, FiThumbsUp, FiArrowRight,
  FiX, FiCheck, FiBarChart2, FiShield, FiExternalLink, FiSliders
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const industries = ['All', 'AI & Data Science', 'HealthTech', 'ClimateTech', 'FinTech', 'EdTech', 'Cybersecurity', 'Robotics & Automation', 'SaaS & DevOps', 'AgriTech', 'Logistics', 'Real Estate Tech'];

export default function BrowseStartups() {
  const { bookmarks, toggleBookmark, t } = useAuth();
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [industry, setIndustry] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleCompare = (startup, e) => {
    e.stopPropagation();
    if (compareList.some(s => s._id === startup._id)) {
      setCompareList(prev => prev.filter(s => s._id !== startup._id));
      toast.success(`Removed ${startup.startup_name} from comparison`);
    } else {
      if (compareList.length >= 3) {
        toast.error('You can compare a maximum of 3 startups at once');
        return;
      }
      setCompareList(prev => [...prev, startup]);
      toast.success(`Added ${startup.startup_name} to comparison`);
    }
  };

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (industry) params.industry = industry;
      const { data } = await api.get('/startups/all', { params });
      let filtered = Array.isArray(data) ? data : (data?.startups || []);
      if (search.trim()) {
        filtered = filtered.filter(s =>
          s.startup_name.toLowerCase().includes(search.toLowerCase()) ||
          s.industry.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      setStartups(filtered);
      setTotalPages(data?.pages || 1);
    } catch {
      toast.error('Failed to load startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [page, industry, search]);

  const handleUpvote = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/startups/${id}/upvote`);
      setStartups(prev => (Array.isArray(prev) ? prev : []).map(s => s._id === id ? { ...s, upvotes: data.upvotes } : s));
      toast.success(data.upvoted ? '🔥 Upvoted Startup!' : 'Upvote removed');
    } catch {
      toast.error('Could not register upvote');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
          <FiTrendingUp /> 20+ Verified Venture Backed Startups

        </span>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('startups')}
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
                  onClick={() => navigate(`/startups/${startup._id}`)}
                  className="card cursor-pointer overflow-hidden card-hover group flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-300"
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
                        onClick={(e) => toggleCompare(startup, e)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black backdrop-blur-md transition-all shadow-md ${
                          compareList.some(s => s._id === startup._id)
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-black/60 text-indigo-300 hover:text-white border border-indigo-500/30'
                        }`}
                        title="Add to Comparison Matrix"
                      >
                        <FiSliders size={13} />
                        <span>{compareList.some(s => s._id === startup._id) ? 'Selected' : 'Compare'}</span>
                      </button>
                      <button
                        onClick={(e) => handleUpvote(startup._id, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md text-amber-400 hover:text-white border border-amber-500/30 hover:bg-amber-500 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                      >
                        <FiThumbsUp size={14} />
                        <span>{startup.upvotes || 42}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/startups/${startup._id}`);
                        }}
                        className="w-full text-center py-3 btn-primary text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5"
                      >
                        Explore Startup Details <FiArrowRight className="w-4 h-4" />
                      </button>
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

      {/* Floating Compare Action Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white border border-indigo-500/40 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xl w-full justify-between ring-1 ring-indigo-500/20"
          >
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 shrink-0 flex items-center gap-1">
                <FiSliders /> Compare:
              </span>
              {compareList.map(s => (
                <div key={s._id} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl text-xs font-bold shrink-0 border border-white/10">
                  <span className="truncate max-w-[90px]">{s.startup_name}</span>
                  <button onClick={(e) => toggleCompare(s, e)} className="text-slate-400 hover:text-rose-400">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareList([])}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => setShowCompareModal(true)}
                className="btn-primary py-2 px-4 text-xs font-extrabold shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 whitespace-nowrap"
              >
                <FiBarChart2 size={14} /> Compare ({compareList.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Startup Comparison Matrix Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-indigo-500/30 rounded-3xl max-w-5xl w-full p-6 md:p-8 shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">
                    <FiBarChart2 /> Venture Due Diligence Matrix
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Side-by-Side Startup Comparison</h2>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Matrix Grid */}
              <div className="overflow-x-auto pt-6">
                <div className={`grid grid-cols-${compareList.length} gap-6 min-w-[600px]`}>
                  {compareList.map(s => (
                    <div key={s._id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="h-32 rounded-xl overflow-hidden mb-4 relative bg-slate-950">
                          <img src={s.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'} alt={s.startup_name} className="w-full h-full object-cover opacity-90" />
                          <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-black text-white">
                            {s.industry}
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{s.startup_name}</h3>
                        <p className="text-xs text-slate-500 mb-4 font-medium">Founder: {s.founder_name || 'Visionary'}</p>

                        <div className="space-y-3 text-xs mb-6">
                          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">Funding Stage:</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400">{s.funding_stage}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">Roles Open:</span>
                            <span className="font-black text-indigo-600 dark:text-indigo-400">{s.team_size_needed} Roles</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">Community Upvotes:</span>
                            <span className="font-black text-amber-500">🔥 {s.upvotes || 42}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">Venture Status:</span>
                            <span className="font-black text-emerald-500 flex items-center gap-1"><FiCheck size={12} /> Verified</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed mb-6 font-normal">
                          {s.description}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowCompareModal(false);
                          navigate(`/startups/${s._id}`);
                        }}
                        className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                      >
                        Open Full Pitch <FiExternalLink size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
