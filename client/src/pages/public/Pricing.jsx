import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiZap, FiShield, FiCreditCard, FiStar, FiArrowRight } from 'react-icons/fi';

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!user) {
      toast.error('Please login first to upgrade to Pro!');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-checkout-session');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate Stripe checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoUpgrade = async () => {
    if (!user) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/profile', { isPremium: true });
      toast.success('🎉 Account Upgraded to PRO (Demo Payment Complete)!');
    } catch (err) {
      toast.error('Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
          <FiStar className="text-amber-400" /> Flexible Pricing for Founders & Teams
        </span>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent <span className="gradient-text">Pricing Plans</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Scale your startup recruitment with AI-driven co-pilot tools, unlimited job postings, and Stripe-powered payments.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 md:p-10 flex flex-col justify-between border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <div>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 inline-block">
              Free Collaborator
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Free Starter</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Perfect for collaborators, engineers, and early-stage researchers.</p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-500 text-sm font-semibold">/ forever</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-8">
              {[
                'Browse 15+ verified tech startups',
                'Apply to unlimited open positions',
                'AI Skill Match Analysis (% score)',
                'AI Profile Bio Generator',
                'Up to 3 free job opportunity postings',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <FiCheck className="text-emerald-500 shrink-0" size={18} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/register" className="btn-secondary py-4 w-full text-center font-bold">
            Get Started Free
          </Link>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 md:p-10 flex flex-col justify-between border-2 border-indigo-500 shadow-2xl relative overflow-hidden bg-slate-950 text-white"
        >
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider rounded-bl-2xl shadow-lg">
            Most Popular
          </div>

          <div>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 inline-block border border-indigo-500/30">
              Pro Founder Plan
            </span>
            <h3 className="text-3xl font-black text-white mb-2">Pro Founder & Unlimited</h3>
            <p className="text-slate-400 text-sm mb-6">Built for ambitious founders scaling their founding teams rapidly.</p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black text-white">$19.99</span>
              <span className="text-slate-400 text-sm font-semibold">/ one-time</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-300 mb-8">
              {[
                'Unlimited opportunity job postings',
                'Gemini AI Pitch & Requirement Generator',
                'Instant AI Motivation Letter autocompletion',
                'Featured Startup Gold Badge on browse views',
                'Priority applicant candidate matching',
                'Stripe Secure Instant Payment Guarantee',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <FiCheck className="text-indigo-400 shrink-0" size={18} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="btn-primary py-4 w-full justify-center font-black text-base shadow-xl shadow-indigo-600/40"
            >
              <FiCreditCard className="mr-2" size={18} /> Pay $19.99 via Stripe
            </button>
            <button
              onClick={handleDemoUpgrade}
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              ⚡ 1-Click Instant Demo Payment Simulation
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust & Guarantee */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <FiShield size={28} />
          </div>
          <div>
            <h4 className="text-lg font-bold">Stripe 256-Bit Encrypted Payments</h4>
            <p className="text-xs text-slate-400">All transactions are processed through Stripe with end-to-end encryption.</p>
          </div>
        </div>
        <Link to="/opportunities" className="btn-ai text-sm px-6 py-3 font-bold shrink-0">
          Explore Positions <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
