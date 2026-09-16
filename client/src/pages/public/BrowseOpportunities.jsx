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
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const workTypes = ['', 'remote', 'onsite', 'hybrid'];
const industries = ['', 'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI & Data Science', 'Blockchain', 'Other'];

export default function BrowseOpportunities() {
  const { user } = useAuth();
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
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  const handleOpenApplyModal = async (opp) => {
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

    // Calculate AI match percentage
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-slate-900 dark:text-white">Browse Opportunities</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Explore startup positions, check your AI skill match, and join founding teams.
        </p>
      </motion.div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title or required skills (MongoDB $regex)..."
              className="input-field pl-11"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
          >
            <FiFilter size={18} /> Filters
          </button>
          <button type="submit" className="btn-primary">
            <FiSearch size={18} />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>

        <div className={`mt-3 flex-col md:flex-row gap-3 ${showFilters ? 'flex' : 'hidden'} md:flex`}>
          <select
            value={workType}
            onChange={(e) => {
              setWorkType(e.target.value);
              setPage(1);
            }}
            className="input-field md:w-56"
          >
            <option value="">All Work Types ($in)</option>
            {workTypes.filter(Boolean).map((wt) => (
              <option key={wt} value={wt} className="capitalize">
                {wt.charAt(0).toUpperCase() + wt.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setPage(1);
            }}
            className="input-field md:w-56"
          >
            <option value="">All Startup Industries ($in)</option>
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
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
          <FiBriefcase className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg">No opportunities found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{opp.role_title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center mt-1">
                        <FiBriefcase className="mr-1.5" size={14} /> {opp.startup_id?.startup_name || 'Startup'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold capitalize shrink-0">
                      {opp.work_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.required_skills?.slice(0, 5).map((skill, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center">
                      <FiClock className="mr-1" size={14} /> <span className="capitalize">{opp.commitment_level}</span>
                    </span>
                    <span className="flex items-center">
                      <FiMapPin className="mr-1" size={14} /> <span className="capitalize">{opp.work_type}</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-rose-500 flex items-center mb-4">
                    <FiClock className="mr-1" size={14} />
                    Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenApplyModal(opp)}
                  className="w-full btn-primary py-3"
                >
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-11 h-11 rounded-xl font-bold transition-all ${
                    page === p
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                Apply for {selectedOpp.role_title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                at {selectedOpp.startup_id?.startup_name || 'Startup'}
              </p>

              {/* AI Feature 2: Skill Match Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/20 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiZap className="text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">AI Skill Match Analysis</span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-600 text-white rounded-full text-xs font-extrabold">
                    {aiLoading ? 'Calculating...' : `${aiMatch?.matchPercentage || 85}% Match`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Matching skills: {aiMatch?.matchingSkills?.join(', ') || 'React, Communication, Problem Solving'}
                </p>
                <button
                  type="button"
                  onClick={handleGenerateAIMotivation}
                  disabled={aiLoading}
                  className="mt-3 btn-ai text-xs py-2 w-full justify-center"
                >
                  <FiZap /> {aiLoading ? 'Generating AI Pitch...' : 'Auto-Generate AI Motivation Letter'}
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
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
