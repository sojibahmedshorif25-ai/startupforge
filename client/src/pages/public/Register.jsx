import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight, FiEye, FiEyeOff, FiCheck, FiBriefcase, FiZap } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', image: '', password: '', role: 'collaborator'
  });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, {
        method: 'POST', body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.data.url });
        toast.success('Image uploaded!');
      } else {
        toast.error('Image upload failed.');
      }
    } catch {
      toast.error('Image upload failed.');
    }
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return 'Minimum 6 characters required';
    if (!/[A-Z]/.test(pwd)) return 'At least one uppercase letter required';
    if (!/[a-z]/.test(pwd)) return 'At least one lowercase letter required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) return toast.error(pwdError);
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-slate-950 text-white">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 p-8 lg:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-full"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-extrabold uppercase tracking-wider mb-6">
              <FiZap /> Join StartupForge Today
            </span>
            <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
              Create Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Founder or Collaborator
              </span> Profile
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connect with 15+ verified ventures or build your founding team with intelligent Gemini AI co-pilots.
            </p>

            <div className="space-y-3">
              {[
                'Post unlimited opportunities with AI Pitch Generator',
                'Calculate candidacy fit score with AI Skill Matcher',
                'Auto-generate executive bio & skill tags with AI',
                '100% Free registration for collaborators & founders'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <FiCheck size={12} />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
          </div>
        </motion.div>

        {/* Right Side Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">Fill in your details to start collaborating</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                  {form.image ? (
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="text-slate-400" size={24} />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
                  <FiCamera className="text-white" size={11} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Profile Photo (Optional)</p>
                <p className="text-[11px] text-slate-400">Upload high-res avatar or skip to use default</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-11 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                    placeholder="Alex Rivera"
                  />
                </div>
              </div>

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
                    placeholder="alex@techvision.io"
                  />
                </div>
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
                  placeholder="Password123!"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Min 6 chars, 1 uppercase (A-Z), 1 lowercase (a-z)</p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'collaborator', label: 'Collaborator', desc: 'Apply & join startup teams' },
                  { value: 'founder', label: 'Founder', desc: 'Post opportunities & hire' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      form.role === opt.value
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <p className={`font-extrabold text-sm ${form.role === opt.value ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base font-extrabold mt-2 shadow-xl shadow-indigo-600/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
