import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/startups', label: 'Startups' },
  { to: '/opportunities', label: 'Opportunities' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'founder': return '/dashboard/founder';
      case 'collaborator': return '/dashboard/collaborator';
      case 'admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <span className="text-white font-extrabold text-lg">S</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900">Startup<span className="text-blue-600">Forge</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to={getDashboardLink()}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(getDashboardLink()) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  Dashboard
                </Link>
                <Link to="/dashboard/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg shadow-red-500/25 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-5 py-2.5 text-gray-700 font-medium hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium ${
                    isActive(link.to) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}>{link.label}</Link>
              ))}
              <hr className="my-2 border-gray-100" />
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/dashboard/profile" onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Profile</Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
