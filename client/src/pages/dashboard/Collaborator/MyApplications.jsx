import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/axios';
import { FiBriefcase, FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat drawer state
  const [chatApp, setChatApp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApplications(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleOpenChat = (app) => {
    setChatApp(app);
    setMessages([
      { sender: 'founder', text: `Hi! Thank you for applying to ${app.opportunity_id?.role_title || 'our startup role'}. We are reviewing your profile.` },
      { sender: 'applicant', text: `Hello! Happy to answer any questions about my portfolio or skills.` }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: 'applicant', text: newMessage }]);
    setNewMessage('');
    toast.success('Message sent to founder!');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-black mb-2 text-white">My Applications Tracker</h1>
      <p className="text-slate-400 mb-8 text-sm">Track your venture applications and chat live with founders</p>

      {applications.length === 0 ? (
        <div className="text-center py-20 card">
          <FiBriefcase className="mx-auto text-5xl text-slate-600 mb-4 animate-bounce" />
          <p className="text-slate-400 text-lg font-bold">You haven't applied to any opportunities yet</p>
        </div>
      ) : (
        <div className="card overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-left">
                  <th className="px-6 py-4 font-extrabold text-slate-300 text-xs uppercase tracking-wider">Opportunity</th>
                  <th className="px-6 py-4 font-extrabold text-slate-300 text-xs uppercase tracking-wider">Startup</th>
                  <th className="px-6 py-4 font-extrabold text-slate-300 text-xs uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-4 font-extrabold text-slate-300 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-extrabold text-slate-300 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">{app.opportunity_id?.role_title || 'Software Role'}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm font-semibold">{app.opportunity_id?.startup_id?.startup_name || 'Verified Startup'}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>{app.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenChat(app)}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-bold flex items-center gap-1.5"
                      >
                        <FiMessageSquare size={14} /> 💬 Founder Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Direct Founder Chat Modal */}
      <AnimatePresence>
        {chatApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0E14] rounded-3xl max-w-lg w-full p-6 border border-white/10 shadow-2xl flex flex-col h-[500px]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Chat with Founder</h3>
                  <p className="text-xs text-indigo-400 font-bold">{chatApp.opportunity_id?.startup_id?.startup_name || 'Startup'}</p>
                </div>
                <button onClick={() => setChatApp(null)} className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5">
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'applicant' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      m.sender === 'applicant' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/10 text-slate-200 rounded-bl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message to founder..."
                  className="input-field text-xs flex-1"
                />
                <button type="submit" className="btn-ai px-4 text-xs font-bold shrink-0">
                  <FiSend /> Send
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
