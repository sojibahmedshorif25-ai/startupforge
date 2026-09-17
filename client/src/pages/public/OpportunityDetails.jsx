import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiBriefcase, FiMapPin, FiClock, FiCalendar, FiCheckCircle,
  FiZap, FiBookmark, FiArrowLeft, FiSend, FiX, FiLayers, FiUser
} from 'react-icons/fi';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState(user?.portfolio || '');
  const [motivation, setMotivation] = useState('');
  const [generatingMotivation, setGeneratingMotivation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // AI Fit widget state
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/opportunities/${id}`);
        setOpportunity(res.data);

        // Calculate AI fit if user is logged in
        if (user && res.data) {
          try {
            const matchRes = await api.post('/ai/match-percentage', {
              userSkills: user.skills || [],
              requiredSkills: res.data.required_skills || [],
              applicantBio: user.bio || '',
            });
            if (matchRes.data.success) {
              setMatchData(matchRes.data);
            }
          } catch (e) {
            // silent catch
          }
        }
      } catch (err) {
        toast.error('Opportunity not found');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user) {
      toast.error('Please login to save bookmarks');
      return;
    }
    try {
      const res = await api.post('/bookmarks/toggle', {
        item_type: 'opportunity',
        opportunity_id: id,
      });
      if (res.data.success) {
        setIsSaved(res.data.bookmarked);
        toast.success(res.data.bookmarked ? 'Opportunity saved!' : 'Bookmark removed!');
      }
    } catch (e) {
      toast.error('Failed to toggle bookmark');
    }
  };

  const handleGenerateMotivation = async () => {
    try {
      setGeneratingMotivation(true);
      const res = await api.post('/ai/match-percentage', {
        userSkills: user?.skills || ['React', 'JavaScript'],
        requiredSkills: opportunity?.required_skills || [],
        applicantBio: user?.bio || '',
      });
      if (res.data.success && res.data.generatedMotivation) {
        setMotivation(res.data.generatedMotivation);
        toast.success('AI motivation text generated!');
      }
    } catch (err) {
      toast.error('Failed to generate motivation text');
    } finally {
      setGeneratingMotivation(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (!motivation.trim()) {
      toast.error('Please provide a short motivation statement');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/applications/create', {
        opportunity_id: id,
        applicant_email: user.email,
        portfolio_link: portfolioLink,
        motivation,
      });

      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setMotivation('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Opportunity Not Found</h2>
        <Link to="/opportunities" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm">
          <FiArrowLeft /> Back to Browse Positions
        </Link>
      </div>
    );
  }

  // Calculate deadline status
  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  let deadlineBadge = { text: 'Open Position', bg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' };
  if (diffDays <= 0) {
    deadlineBadge = { text: 'Closed', bg: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' };
  } else if (diffDays <= 3) {
    deadlineBadge = { text: `Closing Soon (${diffDays} days left)`, bg: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400' };
  }

  const startup = opportunity.startup_id || {};
  const startupName = startup.startup_name || 'Innovate AI';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link to="/opportunities" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Browse Opportunities
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Opportunity Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {startup.logo ? (
                  <img src={startup.logo} alt={startupName} className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-2xl shadow-lg">
                    {startupName.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {opportunity.role_title}
                  </h1>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">{startupName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-2xl border transition-all ${
                    isSaved
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Save bookmark"
                >
                  <FiBookmark className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowApplyModal(true)}
                  disabled={diffDays <= 0}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-xl hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {diffDays <= 0 ? 'Applications Closed' : 'Apply For Position'}
                </button>
              </div>
            </div>

            {/* Badges bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${deadlineBadge.bg}`}>
                {deadlineBadge.text}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold capitalize flex items-center gap-1.5">
                <FiBriefcase className="w-3.5 h-3.5 text-indigo-500" /> {opportunity.work_type}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold capitalize flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5 text-indigo-500" /> {opportunity.commitment_level}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-indigo-500" /> Deadline: {deadlineDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* AI Fit Widget */}
          {matchData && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <FiZap className="w-4 h-4 text-indigo-400 animate-pulse" /> Why This Fits Your Profile
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs">
                  {matchData.matchPercentage}% AI Fit Score
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {matchData.generatedMotivation}
              </p>
            </div>
          )}

          {/* Detailed Job Description */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Role & Responsibilities</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {opportunity.description || 'No additional description provided.'}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Required Skills & Stack</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              About The Startup
            </h3>

            <div className="flex items-center gap-3">
              {startup.logo ? (
                <img src={startup.logo} alt={startupName} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-lg">
                  {startupName.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{startupName}</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{startup.industry || 'Technology'}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Funding Stage:</span>
                <span className="font-bold text-slate-900 dark:text-white">{startup.funding_stage || 'Seed'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Founder Email:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{startup.founder_email || 'founder@startup.io'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Target Team Size:</span>
                <span className="font-bold text-slate-900 dark:text-white">{startup.team_size_needed || 4} members</span>
              </div>
            </div>

            {startup._id && (
              <Link
                to={`/startups/${startup._id}`}
                className="w-full block text-center py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                View Startup Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">Apply for {opportunity.role_title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{startupName}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Motivation Statement *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateMotivation}
                    disabled={generatingMotivation}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <FiZap className="w-3 h-3" /> Auto-Generate with AI
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Explain why your technical background and experience make you a great fit..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'} <FiSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
