import { useState, useEffect } from 'react';
import { FiZap, FiCheckCircle, FiBriefcase, FiMapPin, FiClock, FiArrowRight, FiBookmark } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

export default function AIMatch() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.post('/ai/match', {
        skills: user?.skills || ['React', 'JavaScript', 'Node.js'],
        bio: user?.bio || '',
      });
      if (res.data.success) {
        setRecommendations(res.data.recommendations || []);
      }
    } catch (err) {
      toast.error('Failed to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const toggleSaveBookmark = async (oppId) => {
    try {
      const res = await api.post('/bookmarks/toggle', {
        item_type: 'opportunity',
        opportunity_id: oppId,
      });
      if (res.data.success) {
        toast.success(res.data.bookmarked ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
      }
    } catch (e) {
      toast.error('Login required to bookmark');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30 mb-4">
            <FiZap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI Feature #1 — AI Job & Startup Matcher
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Recommended Positions For You
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Our AI continuously evaluates open startup opportunities against your skills, experience, and profile background to give you precision fit scores.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <FiZap className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matched Opportunities Found</h3>
          <p className="text-slate-500 text-xs mt-1">Try adding more skills to your profile to generate recommendations.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(({ opportunity, matchScore, reasons }) => {
            const oppId = opportunity._id;
            const startupName = opportunity.startup_id?.startup_name || 'InnovateLab';
            const startupLogo = opportunity.startup_id?.logo;

            return (
              <div
                key={oppId}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {startupLogo ? (
                        <img src={startupLogo} alt={startupName} className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-lg">
                          {startupName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {opportunity.role_title}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{startupName}</p>
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1">
                        <FiZap className="w-3.5 h-3.5" /> {matchScore}% Match
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-semibold">AI Calculated Fit</span>
                    </div>
                  </div>

                  {/* Reasons Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Why this fits you:</p>
                    {reasons.map((reason, idx) => (
                      <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </p>
                    ))}
                  </div>

                  {/* Required Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opportunity.required_skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="capitalize flex items-center gap-1"><FiBriefcase className="w-3.5 h-3.5 text-slate-400" /> {opportunity.work_type}</span>
                    <span>•</span>
                    <span className="capitalize">{opportunity.commitment_level}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveBookmark(oppId)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Bookmark opportunity"
                    >
                      <FiBookmark className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/opportunities/${oppId}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      View & Apply <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
