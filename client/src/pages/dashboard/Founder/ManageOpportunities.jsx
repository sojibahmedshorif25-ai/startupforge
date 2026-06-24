import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiSave, FiX, FiClock, FiMapPin } from 'react-icons/fi';

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchData = async () => {
    try { const { data } = await api.get('/opportunities'); setOpportunities(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async (id) => {
    try {
      await api.put(`/opportunities/${id}`, {
        ...form, required_skills: form.required_skills?.split(',').map(s => s.trim()),
      });
      toast.success('Updated!'); setEditing(null); fetchData();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity?')) return;
    try { await api.delete(`/opportunities/${id}`); toast.success('Deleted!'); fetchData(); }
    catch { toast.error('Delete failed'); }
  };

  const startEdit = (opp) => {
    setEditing(opp._id);
    setForm({
      role_title: opp.role_title,
      required_skills: opp.required_skills.join(', '),
      work_type: opp.work_type,
      commitment_level: opp.commitment_level,
      deadline: opp.deadline?.split('T')[0],
      description: opp.description || '',
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">Manage Opportunities</h1>
      <p className="text-gray-500 mb-8">Edit or remove your posted opportunities</p>

      {opportunities.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No opportunities yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => (
            <div key={opp._id} className="card p-6">
              {editing === opp._id ? (
                <div className="space-y-4">
                  <input type="text" value={form.role_title}
                    onChange={(e) => setForm({ ...form, role_title: e.target.value })} className="input-field" />
                  <input type="text" value={form.required_skills}
                    onChange={(e) => setForm({ ...form, required_skills: e.target.value })} className="input-field" placeholder="Skills (comma separated)" />
                  <div className="grid grid-cols-3 gap-3">
                    <select value={form.work_type}
                      onChange={(e) => setForm({ ...form, work_type: e.target.value })} className="input-field">
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    <select value={form.commitment_level}
                      onChange={(e) => setForm({ ...form, commitment_level: e.target.value })} className="input-field">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                    <input type="date" value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input-field" />
                  </div>
                  <textarea value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field" />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(opp._id)} className="btn-success flex items-center text-sm"><FiSave className="mr-1.5" /> Save</button>
                    <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center text-sm"><FiX className="mr-1.5" /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{opp.role_title}</h3>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium capitalize">{opp.work_type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center"><FiClock className="mr-1" size={14} /> <span className="capitalize">{opp.commitment_level}</span></span>
                      <span className="flex items-center"><FiMapPin className="mr-1" size={14} /> <span className="capitalize">{opp.work_type}</span></span>
                      <span className="text-red-500">Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {opp.required_skills?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(opp)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 text-sm font-medium flex items-center"><FiEdit2 className="mr-1.5" /> Edit</button>
                    <button onClick={() => handleDelete(opp._id)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 text-sm font-medium flex items-center"><FiTrash2 className="mr-1.5" /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
