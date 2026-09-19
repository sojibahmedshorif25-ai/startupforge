import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import { FiDollarSign } from 'react-icons/fi';

export default function Transactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/all').then(({ data }) => setPayments(data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Transactions</h1>
        <p className="text-slate-400 text-sm">View all platform payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900 border border-slate-800">
          <FiDollarSign className="mx-auto text-5xl text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg font-bold">No transactions logged yet</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-medium">
                {payments.map(p => (
                  <tr key={p._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-200 text-xs">{p.user_email}</td>
                    <td className="px-6 py-4 font-black text-white text-sm">${p.amount}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.payment_status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>{p.payment_status}</span>
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
