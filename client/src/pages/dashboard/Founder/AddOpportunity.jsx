import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiCalendar, FiTag } from 'react-icons/fi';

export default function AddOpportunity() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role_title: '', required_skills: '', work_type: 'remote',
    commitment_level: 'full-time', deadline: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/opportunities', {
        ...form,
        required_skills: form.required_skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Opportunity created!');
      navigate('/dashboard/founder/manage-opportunities');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Add Opportunity</h1>
        <p className="text-gray-500 mt-1">Post a new position for your startup</p>
      </div>

      <div className="card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Title</label>
            <input type="text" required value={form.role_title}
              onChange={(e) => setForm({ ...form, role_title: e.target.value })}
              className="input-field" placeholder="e.g., Senior React Developer" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Skills</label>
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" required value={form.required_skills}
                onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                className="input-field pl-11" placeholder="React, Node.js, MongoDB" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Work Type</label>
              <select value={form.work_type}
                onChange={(e) => setForm({ ...form, work_type: e.target.value })}
                className="input-field">
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Commitment Level</label>
              <select value={form.commitment_level}
                onChange={(e) => setForm({ ...form, commitment_level: e.target.value })}
                className="input-field">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Application Deadline</label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="date" required value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="input-field" placeholder="Describe the role, responsibilities, and what you're looking for..." />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary flex items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : <FiPlus className="mr-2" />}
            {loading ? 'Creating...' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
