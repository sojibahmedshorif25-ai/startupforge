import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiZap, FiShield, FiUsers, FiBriefcase, FiUserCheck } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  const [activeTab, setActiveTab] = useState('user'); // 'user' (Founder/Collaborator) or 'admin'
  const [userRole, setUserRole] = useState('founder'); // 'founder' or 'collaborator'
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleGoogleOAuthLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await userInfoRes.json();
        
        const res = await googleLogin({
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: userRole,
        });
        toast.success(`Successfully logged in with Google as ${userRole.toUpperCase()}!`);
        const assignedRole = res?.user?.role || userRole;
        const defaultDashboard = assignedRole === 'admin' 
          ? '/dashboard/admin' 
          : assignedRole === 'founder' 
          ? '/dashboard/founder' 
          : '/dashboard/collaborator';
        const targetPath = (from && from !== '/') ? from : defaultDashboard;
        navigate(targetPath, { replace: true });
      } catch (err) {
        toast.error('Google Auth Failed: ' + (err.message || 'Login error'));
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign-In blocked. Ensure domain is authorized in Google Cloud Console.');
    },
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      toast.success('Welcome back to StartupForge!');
      const assignedRole = res?.user?.role || 'collaborator';
      const targetPath = (from && from !== '/') ? from : (assignedRole === 'admin' ? '/dashboard/admin' : assignedRole === 'founder' ? '/dashboard/founder' : '/dashboard/collaborator');
      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-slate-950 text-white">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side Branding Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 p-8 lg:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-full"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-6">
              <FiZap /> Role-Based Secure Auth
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Welcome to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                StartupForge
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              The premier AI-driven ecosystem connecting high-impact founders with elite co-builders.
            </p>

            <div className="space-y-4">
              {[
                { icon: FiShield, title: 'Admin Master Access', desc: 'Full system management for platform admin (sojibahmedshorif25@gmail.com).' },
                { icon: FiBriefcase, title: 'Founders Portal', desc: 'Post ventures, list open roles, and manage candidate pipelines.' },
                { icon: FiUsers, title: 'Collaborators Hub', desc: 'Browse 20+ verified startup roles & calculate AI match scores.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>© 2026 StartupForge AI Inc.</span>
            <span className="text-indigo-400 font-semibold">Production Ready</span>
          </div>
        </motion.div>

        {/* Right Side Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl"
        >
          {/* Top Role Mode Switcher */}
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'user'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiUserCheck size={16} /> Founder & Collaborator
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setForm({ email: '', password: '' });
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiShield size={16} /> Admin Portal
            </button>
          </div>

          {activeTab === 'user' ? (
            <div>
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-white mb-1">Founder & Collaborator Sign In</h2>
                <p className="text-slate-400 text-xs">Sign in with your Real Google Account to proceed</p>
              </div>

              {/* Founder vs Collaborator selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setUserRole('founder')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    userRole === 'founder'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-extrabold text-xs flex items-center gap-1.5">
                    🚀 Founder
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Post ventures & hire team</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('collaborator')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    userRole === 'collaborator'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-extrabold text-xs flex items-center gap-1.5">
                    🤝 Collaborator
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Apply & join startups</p>
                </button>
              </div>

              {/* 1-Click Real Google Login Button */}
              <button
                type="button"
                onClick={() => handleGoogleOAuthLogin()}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white text-slate-900 border border-slate-300 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-lg active:scale-98 mb-6 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google ({userRole.toUpperCase()})</span>
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <span className="relative px-3 bg-slate-900 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Or Login with Password</span>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-5">
                <p className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <FiShield className="text-purple-400" /> Platform Admin Sign In
                </p>
                <p className="text-xs text-slate-400">Enter master email (sojibahmedshorif25@gmail.com) and password below to access the Admin Panel.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-11 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* ⚡ Recruiter & Hiring Manager 1-Click Demo Sandbox */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <FiZap className="text-amber-400" /> Recruiter & Demo 1-Click Access
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Instant Sandbox
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await login('sojibahmedshorif25@gmail.com', 'Sojibboss@231946##');
                      toast.success('⚡ Logged in as Admin Sandbox!');
                      navigate('/dashboard/admin');
                    } catch (e) {
                      toast.error('Admin sandbox login error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="py-2 px-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5"
                >
                  <FiShield className="text-purple-400" size={14} />
                  <span>Admin Role</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await login('alex.founder@techvision.io', 'Founder123!');
                      toast.success('🚀 Logged in as Founder Sandbox!');
                      navigate('/dashboard/founder');
                    } catch (e) {
                      toast.error('Founder sandbox login error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="py-2 px-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5"
                >
                  <FiBriefcase className="text-blue-400" size={14} />
                  <span>Founder Role</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await login('dev.john@gmail.com', 'User123!');
                      toast.success('🤝 Logged in as Collaborator Sandbox!');
                      navigate('/dashboard/collaborator');
                    } catch (e) {
                      toast.error('Collaborator sandbox login error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="py-2 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-all text-center flex flex-col items-center gap-0.5"
                >
                  <FiUsers className="text-emerald-400" size={14} />
                  <span>Collaborator</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-extrabold shadow-xl shadow-indigo-600/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Dashboard <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-bold hover:underline">
              Create free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
