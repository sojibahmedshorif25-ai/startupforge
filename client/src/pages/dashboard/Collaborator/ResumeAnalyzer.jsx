import { useState } from 'react';
import { FiFileText, FiZap, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiCheck, FiArrowRight } from 'react-icons/fi';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(user?.portfolio || '');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText || resumeText.length < 20) {
      toast.error('Please paste or enter at least 20 characters of resume text');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/ai/resume', { resumeText, portfolioLink });
      if (res.data.success) {
        setAnalysis(res.data);
        toast.success('Resume analysis completed!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-purple-500/30">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30 mb-4">
            <FiZap className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> AI Feature #2 — AI Resume & Portfolio Analyzer
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Optimize Your Resume For Startup Founders
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Get instant AI insights into detected technical skills, key strengths, skill gaps, readiness score, and actionable profile improvement tips.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Portfolio or GitHub URL (Optional)
            </label>
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://github.com/yourusername or portfolio link"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Paste Resume Content / Work History *
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text, bio summary, project experience, and technical achievements here..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-sm shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiZap className="w-4 h-4 animate-spin" /> Analyzing Resume with AI...
              </>
            ) : (
              <>
                <FiZap className="w-4 h-4" /> Run AI Resume Analysis
              </>
            )}
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Readiness Score Box */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                Profile Match Readiness
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Readiness Evaluation
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs max-w-xl leading-relaxed">
                {analysis.readinessExplanation}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 min-w-[180px]">
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 flex items-center gap-1">
                {analysis.profileMatchReadiness}%
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Readiness Score</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Skills */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500 w-5 h-5" /> Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skillsDetected?.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Strengths */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500 w-5 h-5" /> Key Candidate Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.topStrengths?.map((st, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <FiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FiAlertCircle className="text-amber-500 w-5 h-5" /> Skill Gaps to Boost Profile
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills?.map((ms, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                    + {ms}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Roles */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FiZap className="text-purple-500 w-5 h-5" /> Best Matching Startup Roles
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedRoles?.map((r, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                    🎯 {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Improvement Suggestions */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Suggested Profile Improvements
            </h3>
            <div className="space-y-3">
              {analysis.improvementSuggestions?.map((tip, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
