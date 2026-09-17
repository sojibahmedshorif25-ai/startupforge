import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/axios';
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiArrowLeft,
  FiBriefcase,
  FiMail,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiPieChart,
  FiLayers,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StartupDetails() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pitch Deck Modal state
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Equity Calculator Modal state
  const [showEquityCalc, setShowEquityCalc] = useState(false);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [fundingAmount, setFundingAmount] = useState(250000);
  const [techImportance, setTechImportance] = useState('High');

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

  const pitchDeckSlides = [
    { title: '1. The Problem', content: `Legacy processes in ${startup.industry} are slow, error-prone, and fragmented. Existing solutions lack automated AI capabilities.` },
    { title: '2. The AI Solution', content: `${startup.startup_name} introduces an autonomous AI platform that automates core workflows, saving teams over 70% of engineering hours.` },
    { title: '3. Market Opportunity & Traction', content: `Addressing a $14.2B TAM with 450+ early beta users, 15 active pilot ventures, and $28M+ ecosystem deal volume.` },
    { title: '4. Business & Revenue Model', content: `Tiered SaaS Subscription ($19.99/mo Pro Plan, $99/mo Enterprise) with API usage fees and premium team matching commissions.` },
    { title: '5. Founding Team & Vision', content: `Led by ${startup.founder_name || 'Visionary Founder'} (${startup.founder_email}) with deep AI, Fullstack, and Venture building expertise.` }
  ];

  // Calculated equity share formula
  const calculatedEquity = Math.min(25, Math.max(5, Math.round((hoursPerWeek / 40) * 12 + (techImportance === 'High' ? 6 : 3))));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <Link to="/startups" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 transition-colors group text-sm">
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to All Startups
      </Link>

      <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="h-72 md:h-96 relative overflow-hidden bg-slate-950">
          <img src={startup.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'} alt={startup.startup_name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-white border border-white/20">
                  {startup.industry}
                </span>
                {/* 🏅 Golden Venture Verified Badge */}
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                  👑 Venture Verified
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{startup.startup_name}</h1>
              <p className="text-slate-300 text-sm font-semibold flex items-center mt-2">
                <FiMail className="mr-2 text-indigo-400" /> {startup.founder_email} (Founder: <span className="text-amber-300 font-bold ml-1">{startup.founder_name || 'Visionary Leader'}</span>)
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
              { icon: FiUsers, label: 'Team Roles Open', value: `${startup.team_size_needed} Roles Open` },
              { icon: FiCalendar, label: 'Verified On', value: new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
              { icon: FiDollarSign, label: 'Funding Stage', value: startup.funding_stage },
            ].map((item, i) => (
              <div key={i} className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 text-center shadow-xs">
                <item.icon className="mx-auto text-indigo-600 dark:text-indigo-400 text-3xl mb-2" />
                <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">About {startup.startup_name}</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-10">{startup.description}</p>

          {/* Interactive Feature Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
            <Link to="/opportunities" className="btn-primary py-4 px-8 text-base font-bold shadow-xl">
              <FiBriefcase className="mr-2" /> Explore Open Roles
            </Link>

            <button
              onClick={() => { setShowPitchDeck(true); setCurrentSlide(0); }}
              className="px-6 py-4 rounded-2xl bg-indigo-50 dark:bg-purple-500/20 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/30 font-bold hover:bg-indigo-100 dark:hover:bg-purple-500/30 transition-all flex items-center gap-2"
            >
              <FiLayers /> 📊 View 5-Slide Pitch Deck
            </button>

            <button
              onClick={() => setShowEquityCalc(true)}
              className="px-6 py-4 rounded-2xl bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-bold hover:bg-amber-100 dark:hover:bg-amber-500/30 transition-all flex items-center gap-2"
            >
              <FiPieChart /> 🧮 Equity Split Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Pitch Deck Slide Viewer Modal */}
      <AnimatePresence>
        {showPitchDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#0B0E14] rounded-3xl max-w-2xl w-full p-8 border border-slate-200 dark:border-purple-500/30 shadow-2xl relative"
            >
              <button onClick={() => setShowPitchDeck(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5">
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-purple-400 font-extrabold text-xs uppercase tracking-widest mb-6">
                <FiLayers /> {startup.startup_name} Pitch Presentation ({currentSlide + 1} / {pitchDeckSlides.length})
              </div>

              <div className="min-h-[220px] p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col justify-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{pitchDeckSlides[currentSlide].title}</h3>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-medium">
                  {pitchDeckSlides[currentSlide].content}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="btn-secondary px-5 py-2.5 text-xs font-bold disabled:opacity-30"
                >
                  <FiChevronLeft /> Previous
                </button>

                <div className="flex gap-1.5">
                  {pitchDeckSlides.map((_, idx) => (
                    <div key={idx} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-purple-600 dark:bg-purple-500 scale-125' : 'bg-slate-300 dark:bg-white/20'}`}></div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide(Math.min(pitchDeckSlides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === pitchDeckSlides.length - 1}
                  className="btn-primary px-5 py-2.5 text-xs font-bold disabled:opacity-30"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Equity Split Calculator Modal */}
      <AnimatePresence>
        {showEquityCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#0B0E14] rounded-3xl max-w-lg w-full p-8 border border-amber-200 dark:border-amber-500/30 shadow-2xl relative"
            >
              <button onClick={() => setShowEquityCalc(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5">
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-widest mb-4">
                <FiPieChart /> Co-Founder Equity Calculator
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Calculate Fair Equity Split</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Commitment (Hours / Week): <span className="text-amber-600 dark:text-amber-400">{hoursPerWeek} hrs</span>
                  </label>
                  <input
                    type="range" min="10" max="60" step="5"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Technical Stack Importance</label>
                  <select
                    value={techImportance}
                    onChange={(e) => setTechImportance(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="High">High (Core AI & Architecture)</option>
                    <option value="Medium">Medium (Standard Stack)</option>
                  </select>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-center mb-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest mb-1">Recommended Co-Founder Equity Share</p>
                <p className="text-4xl font-black text-amber-600 dark:text-amber-400">{calculatedEquity}% Equity</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">Estimated 4-year vesting with 1-year cliff based on YC benchmarks.</p>
              </div>

              <button onClick={() => { toast.success('Equity Model Applied to Application!'); setShowEquityCalc(false); }} className="btn-ai w-full py-3 text-sm font-bold">
                Apply Equity Estimate to Role
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
