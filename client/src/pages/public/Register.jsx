import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

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
        toast.error('Image upload failed. Using default.');
      }
    } catch {
      toast.error('Image upload failed. You can skip this.');
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
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-gray-200/60 w-full max-w-lg border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25">
            <span className="text-white font-extrabold text-2xl">S</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join StartupForge and start building</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-gray-400" size={28} />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <FiCamera className="text-white" size={14} />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-11" placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-11" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPwd ? 'text' : 'password'} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-11 pr-11" placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Min 6 chars, 1 uppercase, 1 lowercase</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'collaborator', label: 'Collaborator', desc: 'Join startups' },
                { value: 'founder', label: 'Founder', desc: 'Hire talent' },
              ].map(opt => (
                <button type="button" key={opt.value}
                  onClick={() => setForm({ ...form, role: opt.value })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    form.role === opt.value
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <p className={`font-semibold ${form.role === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</p>
                  <p className={`text-xs mt-0.5 ${form.role === opt.value ? 'text-blue-500' : 'text-gray-400'}`}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center py-3.5 mt-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Create Account <FiArrowRight className="ml-2" /></>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
