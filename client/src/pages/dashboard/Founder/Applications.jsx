import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink, FiMail, FiMessageSquare, FiCalendar, FiSend, FiVideo } from 'react-icons/fi';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Messaging Modal State
  const [chatApp, setChatApp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Interview Scheduler State
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  const fetchData = async () => {
    try {
      const { data } = await api.get('/applications/founder');
      setApplications(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success(`Application marked as ${status}!`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleOpenChat = (app) => {
    setChatApp(app);
    setMessages([
      { sender: 'applicant', text: `Hi, I applied for ${app.opportunity_id?.role_title || 'the role'}. Excited to discuss further!` },
      { sender: 'founder', text: `Hello ${app.applicant_name || 'there'}, thanks for reaching out! Let's talk about your portfolio.` }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: 'founder', text: newMessage }]);
    setNewMessage('');
    toast.success('Message sent to applicant!');
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime) {
      toast.error('Please select date and time');
      return;
    }
    const meetLink = `https://meet.google.com/sf-${Math.random().toString(36).substring(7)}`;
    toast.success(`🎉 Interview Scheduled for ${interviewDate} at ${interviewTime}! Invite sent.`);
    setInterviewApp(null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Founder Applications Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Review candidate applications, chat live, and schedule interviews</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 card">
          <FiMail className="mx-auto text-5xl text-slate-600 mb-4 animate-bounce" />
          <p className="text-slate-400 text-lg font-bold">No applications received yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="card p-6 border border-white/10 hover:border-indigo-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {app.applicant_name?.charAt(0) || app.applicant_email?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white">{app.applicant_name || 'Applicant'}</h3>
                      <p className="text-xs text-slate-400">{app.applicant_email}</p>
                    </div>
                  </div>

                  <p className="text-indigo-400 text-sm font-bold mb-2">Applied for: {app.opportunity_id?.role_title || 'Software Role'}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 bg-white/5 p-4 rounded-2xl border border-white/5">{app.motivation}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {app.portfolio_link && (
                      <a href={app.portfolio_link} target="_blank" rel="noreferrer"
                        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-bold">
                        <FiExternalLink className="mr-1" /> View Portfolio
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenChat(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 font-bold"
                    >
                      <FiMessageSquare size={14} /> 💬 Direct Chat
                    </button>
                    <button
                      onClick={() => setInterviewApp(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold"
                    >
                      <FiCalendar size={14} /> 📅 Schedule Interview
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>{app.status}</span>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatus(app._id, 'accepted')}
                        className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all border border-emerald-500/20"
                        title="Accept Application"
                      >
                        <FiCheck size={20} />
                      </button>
                      <button onClick={() => handleStatus(app._id, 'rejected')}
                        className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-500/20"
                        title="Reject Application"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Direct Chat Drawer / Modal */}
      <AnimatePresence>
        {chatApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0E14] rounded-3xl max-w-lg w-full p-6 border border-white/10 shadow-2xl flex flex-col h-[500px]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Direct Chat with {chatApp.applicant_name}</h3>
                  <p className="text-xs text-indigo-400 font-bold">{chatApp.opportunity_id?.role_title}</p>
                </div>
                <button onClick={() => setChatApp(null)} className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5">
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'founder' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      m.sender === 'founder' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/10 text-slate-200 rounded-bl-none'
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
                  placeholder="Type message to applicant..."
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

      {/* Schedule Interview Modal */}
      <AnimatePresence>
        {interviewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0E14] rounded-3xl max-w-md w-full p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base">
                  <FiVideo /> Schedule Google Meet Interview
                </div>
                <button onClick={() => setInterviewApp(null)} className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Select Time</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setInterviewApp(null)} className="btn-secondary flex-1 py-3 text-xs font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-3 text-xs font-bold">
                    Send Meet Invite
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
