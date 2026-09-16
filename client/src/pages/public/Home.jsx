import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiUsers, FiBriefcase, FiTarget, FiAward, FiArrowRight, FiStar, FiClock, FiMapPin, FiZap, FiCheckCircle, FiShield, FiTrendingUp } from 'react-icons/fi';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    api.get('/startups/featured').then(({ data }) => setStartups(data)).catch(() => {});
    api.get('/opportunities/featured').then(({ data }) => setOpportunities(data)).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-24 md:py-36 border-b border-indigo-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/10 backdrop-blur-md rounded-full text-xs md:text-sm font-bold text-indigo-300 border border-indigo-500/20 mb-8 shadow-xl"
            >
              <FiStar className="text-amber-400 animate-spin" size={16} />
              <span>Next-Generation Startup Forge & AI Matchmaking Engine</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight"
            >
              Build & Scale Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Dream Tech Team
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              Connect with top founders, hire elite co-builders, and accelerate venture growth powered by 3 intelligent AI co-pilots.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/register" className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl font-extrabold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300">
                Start Building Free
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/opportunities" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Browse 15+ Open Positions
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Metrics Grid */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '15+', label: 'Active Seeded Startups' },
              { value: '15+', label: 'High-Growth Roles' },
              { value: '$28M+', label: 'Total Venture Funding' },
              { value: '98.5%', label: 'AI Match Accuracy' },
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <p className="text-3xl md:text-5xl font-black gradient-text mb-1">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 AI Features Showcase */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
              <FiZap /> Powered by Gemini AI Engine
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-4">3 Intelligent AI Features</h2>
            <p className="text-slate-400 text-lg">Supercharge your startup application, hiring process, and profile creation with Gemini AI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Opportunity Pitch Generator',
                tag: 'Feature #1',
                desc: 'Founders enter basic startup info and AI drafts a high-converting pitch and extracts required skills instantly.',
                badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                btnText: 'Try Pitch Generator',
                link: '/dashboard/founder/add-opportunity'
              },
              {
                title: 'AI Skill Match & Motivation Letter',
                tag: 'Feature #2',
                desc: 'Applicants receive a dynamic % fit score between their skills and job requirements, plus a custom cover letter.',
                badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                btnText: 'Test Skill Matcher',
                link: '/opportunities'
              },
              {
                title: 'AI Bio & Skill Extraction',
                tag: 'Feature #3',
                desc: 'Collaborators input raw experience notes and AI generates an executive bio and tags top technical skills.',
                badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                btnText: 'Enhance Your Bio',
                link: '/dashboard/profile'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 shadow-2xl"
              >
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${feature.badgeColor} mb-6`}>
                    {feature.tag}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{feature.desc}</p>
                </div>
                <Link
                  to={feature.link}
                  className="btn-ai w-full text-sm py-3 justify-center font-bold"
                >
                  <FiZap /> {feature.btnText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Handpicked Ventures</span>
              <h2 className="section-title mt-2">Featured Startups</h2>
            </div>
            <Link to="/startups" className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold hover:underline group">
              Explore All 15 Startups <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {startups.slice(0, 3).map((startup, i) => (
              <motion.div
                key={startup._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card overflow-hidden card-hover group border border-slate-200 dark:border-slate-800"
              >
                <div className="h-48 relative overflow-hidden bg-slate-950">
                  <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">{startup.industry}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{startup.startup_name}</h3>
                  <p className="text-slate-500 text-xs mb-3">Founded by {startup.founder_name}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">{startup.description}</p>
                  <Link to={`/startups/${startup._id}`} className="block w-full text-center py-3 btn-primary text-sm font-bold">
                    View Startup Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Build Something Great?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join founders, engineers, and designers collaborating on high-impact projects.</p>
          <Link to="/register" className="inline-flex items-center px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-2xl hover:scale-105">
            Create Free Account <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
