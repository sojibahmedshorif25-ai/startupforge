import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import { FiBriefcase } from 'react-icons/fi';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApplications(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">My Applications</h1>
      <p className="text-gray-500 mb-8">Track the status of your applications</p>

      {applications.length === 0 ? (
        <div className="text-center py-20">
          <FiBriefcase className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">You haven't applied to any opportunities yet</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Opportunity</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Startup</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Applied Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{app.opportunity_id?.role_title || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{app.opportunity_id?.startup_id?.startup_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        app.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>{app.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
