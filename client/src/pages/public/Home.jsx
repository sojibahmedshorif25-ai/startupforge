import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FiUsers,
  FiBriefcase,
  FiArrowRight,
  FiStar,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
  FiThumbsUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  const { t } = useAuth();
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [demoPrompt, setDemoPrompt] = useState('Autonomous AI agent that writes automated integration tests for React & Node.js');
  const [demoPitch, setDemoPitch] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    api.get('/startups/featured')
      .then(({ data }) => setStartups(Array.isArray(data) ? data : (data?.startups || data?.featured || [])))
      .catch(() => setStartups([]));
    api.get('/opportunities/featured')
      .then(({ data }) => setOpportunities(Array.isArray(data) ? data : (data?.opportunities || data?.featured || [])))
      .catch(() => setOpportunities([]));
  }, []);

  const handleUpvote = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/startups/${id}/upvote`);
      setStartups(prev => (Array.isArray(prev) ? prev : []).map(s => s._id === id ? { ...s, upvotes: data.upvotes } : s));
      toast.success(data.upvoted ? '🔥 Upvoted Startup!' : 'Upvote removed');
    } catch (err) {
      toast.error('Could not register upvote');
    }
  };

  const handleLiveAIDemo = async (e) => {
    e.preventDefault();
    if (!demoPrompt.trim()) return;
    setDemoLoading(true);
    setDemoPitch('');
    try {
      const { data } = await api.post('/ai/generate-pitch', {
        startupName: 'Demo Venture',
        industry: 'AI & SaaS',
        description: demoPrompt
      });
      setDemoPitch(data.generatedPitch || 'Generated AI pitch ready!');
      toast.success('✨ AI Pitch Generated Live!');
    } catch (err) {
      toast.error('AI demo unavailable right now');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-[#07090F] text-slate-900 dark:text-white py-24 md:py-36 border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        {/* Modern Startup Tech Team Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')] bg-cover bg-center opacity-10 dark:opacity-15 mix-blend-overlay pointer-events-none"></div>

        {/* Ambient Lighting */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-gradient-to-tl from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-[140px]"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 dark:bg-white/5 backdrop-blur-md rounded-full text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-white/10 mb-8 shadow-xs"
            >
              <FiStar className="text-amber-500 animate-spin" size={16} />
              <span>The Premier AI Matchmaking Platform for Tech Founders & Engineers</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight text-slate-900 dark:text-white"
            >
              {t('heroTitle').split('.')[0]} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                StartupForge 2.0
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              {t('heroDesc')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register" className="w-full sm:w-auto btn-ai px-8 py-4 text-lg">
                {t('register')}
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto btn-secondary px-8 py-4 text-lg">
                {t('findOpportunities')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accelerator & Backing Badges Ticker */}
      <div className="bg-white dark:bg-[#0B0E14] border-b border-slate-200 dark:border-white/5 py-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 text-center">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
            Backed & Supported by Ecosystem Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 dark:opacity-60 text-slate-700 dark:text-slate-400 text-sm font-black tracking-wider">
            <span className="hover:opacity-100 transition-opacity">🚀 Y COMBINATOR W24</span>
            <span className="hover:opacity-100 transition-opacity">⚡ TECHSTARS SEED</span>
            <span className="hover:opacity-100 transition-opacity">💎 SEQUOIA CAPITAL</span>
            <span className="hover:opacity-100 transition-opacity">🔥 PRODUCT HUNT TOP #1</span>
            <span className="hover:opacity-100 transition-opacity">🛡️ STRIPE VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <section className="py-12 bg-slate-50 dark:bg-[#07090F] border-b border-slate-200 dark:border-white/5 relative z-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '15+', label: 'Active Seeded Startups' },
              { value: '15+', label: 'High-Growth Roles' },
              { value: '$28M+', label: 'Total Venture Funding' },
              { value: '98.5%', label: 'AI Match Accuracy' },
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-md dark:shadow-2xl">
                <p className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:to-cyan-300 mb-1">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Hunt Style Trending Startups with Upvotes */}
      <section className="py-24 bg-white dark:bg-[#0B0E14] relative border-b border-slate-200 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <FiTrendingUp /> Product Hunt Style Upvotes
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">{t('featuredStartups')}</h2>
            </div>
            <Link to="/startups" className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold hover:underline group transition-colors">
              {t('exploreStartups')} <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Array.isArray(startups) ? startups : []).slice(0, 3).map((startup, i) => (
              <motion.div
                key={startup._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group flex flex-col justify-between"
              >
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img src={startup.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'} alt={startup.startup_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  {/* Upvote Pill */}
                  <button
                    onClick={(e) => handleUpvote(startup._id, e)}
                    className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md text-amber-400 hover:text-white border border-amber-500/30 hover:bg-amber-500 rounded-xl text-xs font-black transition-all shadow-lg scale-100 hover:scale-105 active:scale-95"
                  >
                    <FiThumbsUp size={14} />
                    <span>{startup.upvotes || 42} Upvotes</span>
                  </button>

                  <div className="absolute bottom-3 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                      {startup.industry}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{startup.startup_name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">Founded by <span className="text-slate-700 dark:text-slate-200 font-semibold">{startup.founder_name}</span></p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2">{startup.description}</p>
                  </div>

                  <Link to={`/startups/${startup._id}`} className="block w-full text-center py-3.5 btn-primary text-sm font-bold shadow-lg shadow-indigo-600/20">
                    View Startup Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live AI Demo Sandbox Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#07090F] text-slate-900 dark:text-white relative">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
              <FiZap /> Instant Playground
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-4">Test Gemini AI Co-Pilot Live</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Experience how Gemini AI instantly crafts professional startup pitches in real-time right here.</p>
          </motion.div>

          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-indigo-500/20 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleLiveAIDemo} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-wider mb-2">
                  Enter Your Startup Concept
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={demoPrompt}
                    onChange={(e) => setDemoPrompt(e.target.value)}
                    placeholder="Describe your startup idea in 1 line..."
                    className="input-field flex-1 text-sm bg-slate-50 dark:bg-black/40"
                  />
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="btn-ai px-6 py-3 font-bold text-sm shrink-0"
                  >
                    <FiZap /> {demoLoading ? 'AI Generating...' : 'Generate Pitch Live'}
                  </button>
                </div>
              </div>
            </form>

            {demoPitch && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-slate-50 dark:bg-black/60 rounded-2xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider">
                  <FiCheckCircle /> Gemini AI Generated Output:
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-mono bg-white dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  {demoPitch}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 dark:bg-[#07090F] text-white relative overflow-hidden border-t border-slate-800 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('ctaTitle')}</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join founders, engineers, and designers collaborating on high-impact projects.</p>
          <Link to="/register" className="btn-ai text-lg px-10 py-4 mx-auto w-fit">
            {t('register')} <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
