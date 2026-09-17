import { useState, useEffect } from 'react';
import { FiActivity, FiClock, FiShield, FiUserCheck, FiDollarSign, FiLayers } from 'react-icons/fi';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/activity');
        if (res.data.success) {
          setLogs(res.data.logs || []);
        }
      } catch (err) {
        toast.error('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
          <FiActivity className="w-3.5 h-3.5" /> Platform Governance
        </span>
        <h1 className="text-3xl font-black text-white">System Activity & Audit Logs</h1>
        <p className="text-slate-300 text-xs mt-1">Real-time log of security events, administrative actions, applications, and startup registrations.</p>
      </div>

      {/* Activity Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <FiClock className="text-indigo-500" /> System Audit Log Timeline
        </h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit logs...</div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{log.action}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
