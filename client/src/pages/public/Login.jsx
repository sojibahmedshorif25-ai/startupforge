import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiZap, FiShield, FiUsers, FiBriefcase, FiKey, FiUserCheck } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await googleLogin({
        credential: credentialResponse.credential,
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
      toast.error('Google Auth Error: ' + (err.message || 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign In failed or popup closed');
  };

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

  const fillAdminCredentials = () => {
    setForm({
      email: 'sojibahmedshorif25@gmail.com',
      password: 'Sojibboss@231946##',
    });
    toast.success('Admin credentials filled!');
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

              {/* 1-Click Real Google Login */}
              <div className="mb-6 flex justify-center w-full overflow-hidden rounded-2xl shadow-xl border border-slate-700 bg-slate-950 p-1.5">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

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
