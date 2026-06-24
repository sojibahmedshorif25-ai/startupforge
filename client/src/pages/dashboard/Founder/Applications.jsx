import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink, FiMail } from 'react-icons/fi';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try { const { data } = await api.get('/applications/founder'); setApplications(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try { await api.put(`/applications/${id}`, { status }); toast.success(`Application ${status}!`); fetchData(); }
    catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">Applications</h1>
      <p className="text-gray-500 mb-8">Review and manage applications for your opportunities</p>

      {applications.length === 0 ? (
        <div className="text-center py-20">
          <FiMail className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No applications received yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {app.applicant_name?.charAt(0) || app.applicant_email?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{app.applicant_name || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-500">{app.applicant_email}</p>
                    </div>
                  </div>
                  <p className="text-blue-600 text-sm font-medium mb-2">Applied for: {app.opportunity_id?.role_title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3 bg-gray-50 p-3 rounded-xl">{app.motivation}</p>
                  {app.portfolio_link && (
                    <a href={app.portfolio_link} target="_blank" rel="noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <FiExternalLink className="mr-1" /> View Portfolio
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Applied {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    app.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>{app.status.toUpperCase()}</span>
                  {app.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatus(app._id, 'accepted')}
                        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all hover:scale-105">
                        <FiCheck size={18} />
                      </button>
                      <button onClick={() => handleStatus(app._id, 'rejected')}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all hover:scale-105">
                        <FiX size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
