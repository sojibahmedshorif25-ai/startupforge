import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiCalendar, FiTag, FiZap, FiCreditCard } from 'react-icons/fi';

export default function AddOpportunity() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role_title: '',
    required_skills: '',
    work_type: 'remote',
    commitment_level: 'full-time',
    deadline: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [needsPremium, setNeedsPremium] = useState(false);

  const handleAIAssist = async () => {
    if (!form.role_title) {
      toast.error('Please enter a Role Title first to generate AI pitch!');
      return;
    }
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/generate-opportunity', {
        role_title: form.role_title,
        industry: 'Technology & Software',
      });
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          description: data.pitch,
          required_skills: data.suggestedSkills.join(', '),
        }));
        toast.success('AI Pitch & Requirements Generated!');
      }
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const { data } = await api.post('/payments/create-checkout-session');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error('Failed to initiate checkout');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/opportunities', {
        ...form,
        required_skills: form.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Opportunity created!');
      navigate('/dashboard/founder/manage-opportunities');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create opportunity';
      toast.error(msg);
      if (msg.includes('purchase premium')) {
        setNeedsPremium(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Add Opportunity</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Post a new position for your startup team</p>
        </div>
        <button type="button" onClick={handleAIAssist} disabled={aiLoading} className="btn-ai text-sm">
          <FiZap /> {aiLoading ? 'Generating Pitch...' : 'AI Pitch & Skills Assistant'}
        </button>
      </div>

      {needsPremium && (
        <div className="mb-8 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-200 text-lg">Opportunity Limit Reached (3 Max)</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Founders must upgrade to Premium ($10) to post unlimited opportunities.
            </p>
          </div>
          <button onClick={handleCheckout} className="btn-primary bg-amber-600 hover:bg-amber-700 text-sm">
            <FiCreditCard size={18} /> Upgrade with Stripe
          </button>
        </div>
      )}

      <div className="card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role Title</label>
            <input
              type="text"
              required
              value={form.role_title}
              onChange={(e) => setForm({ ...form, role_title: e.target.value })}
              className="input-field"
              placeholder="e.g., Senior React Developer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Required Skills</label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Comma separated</span>
            </div>
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={form.required_skills}
                onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                className="input-field pl-11"
                placeholder="React, Node.js, MongoDB, TypeScript"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Work Type</label>
              <select
                value={form.work_type}
                onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                className="input-field"
              >
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Commitment Level</label>
              <select
                value={form.commitment_level}
                onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                className="input-field"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Application Deadline</label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description & Pitch</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Describe role responsibilities or click AI Assistant to generate..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? <div className="loader mr-2"></div> : <FiPlus className="mr-2" size={18} />}
            {loading ? 'Creating Opportunity...' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
