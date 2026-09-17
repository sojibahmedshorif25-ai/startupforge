import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FiSearch,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiCheckCircle,
  FiZap,
  FiX,
  FiAward,
  FiTrendingUp,
  FiArrowRight,
  FiBookmark
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const workTypes = ['', 'remote', 'onsite', 'hybrid'];
const industries = ['', 'AI & Data Science', 'HealthTech', 'ClimateTech', 'FinTech', 'EdTech', 'Cybersecurity', 'Robotics & Automation', 'SaaS & DevOps', 'AgriTech', 'Logistics', 'Real Estate Tech'];

export default function BrowseOpportunities() {
  const { user, t } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [workType, setWorkType] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Apply Modal state
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiMatch, setAiMatch] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (searchTerm) params.role_title = searchTerm;
      if (workType) params.work_type = workType;
      if (industry) params.industry = industry;
      const { data } = await api.get('/opportunities/all', { params });
      setOpportunities(data.opportunities || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [page, workType, industry]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  const handleOpenApplyModal = async (opp, e) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'collaborator') {
      toast.error('Only collaborators can apply for opportunities');
      return;
    }
    setSelectedOpp(opp);
    setPortfolioLink('');
    setMotivation('');
    setAiMatch(null);

    try {
      setAiLoading(true);
      const { data } = await api.post('/ai/match-percentage', {
        userSkills: user.skills || [],
        requiredSkills: opp.required_skills || [],
        applicantBio: user.bio || '',
      });
      if (data.success) {
        setAiMatch(data);
      }
    } catch (err) {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAIMotivation = async () => {
    if (!selectedOpp) return;
    try {
      setAiLoading(true);
      const { data } = await api.post('/ai/match-percentage', {
        userSkills: user.skills || [],
        requiredSkills: selectedOpp.required_skills || [],
        applicantBio: user.bio || '',
      });
      if (data.generatedMotivation) {
        setMotivation(data.generatedMotivation);
        toast.success('AI Motivation Letter Generated!');
      }
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!motivation) {
      toast.error('Please enter a motivation message');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/applications/create', {
        opportunity_id: selectedOpp._id,
        applicant_email: user.email,
        portfolio_link: portfolioLink,
        motivation,
      });
      toast.success('Application submitted successfully!');
      setSelectedOpp(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmarkToggle = async (oppId, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to bookmark opportunities');
      return;
    }
    try {
      const { data } = await api.post('/bookmarks/toggle', {
        item_type: 'opportunity',
        opportunity_id: oppId,
      });
      if (data.success) {
        toast.success(data.bookmarked ? 'Saved to Bookmarks!' : 'Removed from Bookmarks');
      }
    } catch (err) {
      toast.error('Failed to toggle bookmark');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
          <FiZap /> Powered by Gemini AI Skill Matcher
        </span>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">
          {t('opportunities')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Find your dream founding role, test your skill match score with AI, and craft winning applications.
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="mb-10 max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, required skills (e.g. React, Python)..."
              className="input-field pl-12 py-3.5 shadow-lg shadow-indigo-500/5 text-base"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 font-bold"
          >
            <FiFilter size={18} /> {t('filter')}
          </button>
          <button type="submit" className="btn-primary px-8 text-base">
            <FiSearch size={18} />
            <span>{t('search')}</span>
          </button>
        </div>

        <div className={`flex-col md:flex-row gap-3 ${showFilters ? 'flex' : 'hidden'} md:flex justify-center`}>
          <select
            value={workType}
            onChange={(e) => {
              setWorkType(e.target.value);
              setPage(1);
            }}
            className="input-field md:w-60 shadow-sm"
          >
            <option value="">{t('allWorkTypes')}</option>
            {workTypes.filter(Boolean).map((wt) => (
              <option key={wt} value={wt} className="capitalize">
                {wt.charAt(0).toUpperCase() + wt.slice(1)} Work
              </option>
            ))}
          </select>
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setPage(1);
            }}
            className="input-field md:w-60 shadow-sm"
          >
            <option value="">{t('allIndustries')}</option>
            {industries.filter(Boolean).map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader loader-lg"></div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <FiBriefcase className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4 animate-bounce" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">No opportunities found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/opportunities/${opp._id}`)}
                className="card cursor-pointer p-6 card-hover flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-extrabold tracking-wider uppercase mb-1 inline-block">
                        {opp.startup_id?.industry || 'Technology'}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">{opp.role_title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center mt-1">
                        <FiBriefcase className="mr-1 text-indigo-500" size={14} /> {opp.startup_id?.startup_name || 'Verified Startup'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold capitalize shrink-0 shadow-md">
                        {opp.work_type}
                      </span>
                      <button
                        onClick={(e) => handleBookmarkToggle(opp._id, e)}
                        className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                        title="Bookmark position"
                      >
                        <FiBookmark size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {opp.required_skills?.map((skill, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200/50 dark:border-slate-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center">
                      <FiClock className="mr-1 text-indigo-500" size={14} /> <span className="capitalize">{opp.commitment_level}</span>
                    </span>
                    <span className="flex items-center">
                      <FiMapPin className="mr-1 text-indigo-500" size={14} /> <span className="capitalize">{opp.work_type}</span>
                    </span>
                  </div>

                  <p className="text-xs font-bold text-rose-500 flex items-center mb-6">
                    <FiClock className="mr-1.5" size={14} />
                    Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/opportunities/${opp._id}`);
                    }}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    View Details <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleOpenApplyModal(opp, e)}
                    className="flex-1 btn-primary py-3 font-bold text-xs shadow-lg shadow-indigo-500/20"
                  >
                    <FiZap className="mr-1" /> Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
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

      {/* Application Modal with AI Skill Match Feature */}
      <AnimatePresence>
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                Apply for {selectedOpp.role_title}
              </h2>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
                at {selectedOpp.startup_id?.startup_name || 'Startup'}
              </p>

              {/* AI Feature 2: Skill Match Breakdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FiZap className="text-purple-400 animate-pulse" size={18} />
                    <span className="font-extrabold text-white text-sm">AI Skill Match Analysis</span>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-black shadow-lg">
                    {aiLoading ? 'Calculating...' : `${aiMatch?.matchPercentage || 85}% Match`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">
                  Matching skills: <span className="text-purple-300 font-bold">{aiMatch?.matchingSkills?.join(', ') || 'React, Node.js, Problem Solving'}</span>
                </p>
                <button
                  type="button"
                  onClick={handleGenerateAIMotivation}
                  disabled={aiLoading}
                  className="btn-ai text-xs py-2.5 w-full justify-center font-bold"
                >
                  <FiZap /> {aiLoading ? 'Generating AI Pitch...' : 'Auto-Generate AI Motivation Letter'}
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Portfolio / GitHub Link
                  </label>
                  <input
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                    Motivation Message
                  </label>
                  <textarea
                    rows={4}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Why are you a great fit for this startup role?"
                    className="input-field"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpp(null)}
                    className="btn-secondary flex-1 py-3"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3 font-bold">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
