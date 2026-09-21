import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { FiCheck, FiX, FiExternalLink, FiMail, FiMessageSquare, FiCalendar, FiVideo, FiGrid, FiList, FiZap } from 'react-icons/fi';
import LiveChatModal from '../../../components/chat/LiveChatModal';
import VideoCallModal from '../../../components/chat/VideoCallModal';
import AIPitchGeneratorModal from '../../../components/ai/AIPitchGeneratorModal';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Modal States
  const [activeChatApp, setActiveChatApp] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  const fetchData = async () => {
    try {
      const { data } = await api.get('/applications/founder');
      setApplications(data || []);
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
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime) {
      toast.error('Please select date and time');
      return;
    }
    toast.success(`🎉 Interview Scheduled for ${interviewDate} at ${interviewTime}! WebRTC Video Invite Sent.`);
    setInterviewApp(null);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="loader loader-lg"></div>
      </div>
    );

  const pendingApps = applications.filter((a) => !a.status || a.status === 'pending');
  const acceptedApps = applications.filter((a) => a.status === 'accepted');
  const rejectedApps = applications.filter((a) => a.status === 'rejected');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">ATS Applicant Tracking & Interview Console</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Review candidates with AI Kanban pipeline, Socket.IO live chat, and WebRTC video calls</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPitchOpen(true)}
            className="btn-ai px-4 py-2.5 text-xs font-bold shadow-lg"
          >
            <FiZap size={14} /> AI Pitch Generator
          </button>

          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiGrid size={14} /> Kanban ATS
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiList size={14} /> List View
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {applications.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <FiMail className="mx-auto text-5xl text-slate-600 mb-4 animate-bounce" />
          <p className="text-slate-400 text-lg font-bold">No candidate applications received yet</p>
        </div>
      ) : viewMode === 'kanban' ? (
        /* ATS Kanban Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending / Screening Column */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-amber-400 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Applied & Screening
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                {pendingApps.length}
              </span>
            </div>

            <div className="space-y-3">
              {pendingApps.map((app) => (
                <div key={app._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {app.applicant_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{app.applicant_name || 'Applicant'}</h4>
                      <p className="text-[11px] text-slate-400">{app.applicant_email}</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-indigo-400">{app.opportunity_id?.role_title || 'Role Opportunity'}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">{app.motivation}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveChatApp(app)}
                        className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-indigo-500/30"
                        title="Live Chat"
                      >
                        <FiMessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => setIsVideoOpen(true)}
                        className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all border border-purple-500/30"
                        title="Start WebRTC Video Interview"
                      >
                        <FiVideo size={14} />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleStatus(app._id, 'accepted')}
                        className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all border border-emerald-500/30"
                        title="Accept & Advance"
                      >
                        <FiCheck size={14} />
                      </button>
                      <button
                        onClick={() => handleStatus(app._id, 'rejected')}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all border border-rose-500/30"
                        title="Reject Candidate"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accepted / Hired Column */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-emerald-400 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Accepted & Team Member
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                {acceptedApps.length}
              </span>
            </div>

            <div className="space-y-3">
              {acceptedApps.map((app) => (
                <div key={app._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                      {app.applicant_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{app.applicant_name || 'Accepted Member'}</h4>
                      <p className="text-[11px] text-slate-400">{app.applicant_email}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-emerald-400">{app.opportunity_id?.role_title || 'Software Specialist'}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setActiveChatApp(app)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center gap-1.5"
                    >
                      <FiMessageSquare size={13} /> Direct Chat
                    </button>
                    <button
                      onClick={() => setIsVideoOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5"
                    >
                      <FiVideo size={13} /> Video Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Column */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-rose-400 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Archived / Declined
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30">
                {rejectedApps.length}
              </span>
            </div>

            <div className="space-y-3">
              {rejectedApps.map((app) => (
                <div key={app._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 opacity-60 hover:opacity-100 transition-opacity space-y-2">
                  <h4 className="font-bold text-white text-sm">{app.applicant_name}</h4>
                  <p className="text-xs text-slate-400">{app.applicant_email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standard List View */
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {app.applicant_name?.charAt(0) || app.applicant_email?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{app.applicant_name || 'Applicant'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.applicant_email}</p>
                    </div>
                  </div>

                  <p className="text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-2">Applied for: {app.opportunity_id?.role_title || 'Software Role'}</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">{app.motivation}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {app.portfolio_link && (
                      <a href={app.portfolio_link} target="_blank" rel="noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold">
                        <FiExternalLink className="mr-1" /> View Portfolio
                      </a>
                    )}
                    <button
                      onClick={() => setActiveChatApp(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 font-bold"
                    >
                      <FiMessageSquare size={14} /> 💬 Direct Chat
                    </button>
                    <button
                      onClick={() => setIsVideoOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold"
                    >
                      <FiVideo size={14} /> 🎥 HD Video Interview
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>{app.status || 'pending'}</span>

                  {app.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatus(app._id, 'accepted')} className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all border border-emerald-500/20">
                        <FiCheck size={20} />
                      </button>
                      <button onClick={() => handleStatus(app._id, 'rejected')} className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all border border-rose-500/20">
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

      {/* Socket.IO Live Chat Drawer */}
      <LiveChatModal
        isOpen={!!activeChatApp}
        onClose={() => setActiveChatApp(null)}
        app={activeChatApp}
        currentUser={user}
        onStartVideoCall={() => setIsVideoOpen(true)}
      />

      {/* WebRTC Video Call Overlay */}
      <VideoCallModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        partnerName={activeChatApp?.applicant_name || 'Candidate'}
      />

      {/* AI Pitch Deck & Agreement Modal */}
      <AIPitchGeneratorModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </motion.div>
  );
}
