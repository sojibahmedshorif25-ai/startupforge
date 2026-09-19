import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, logout, darkMode, toggleTheme, language, toggleLanguage, t } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/startups', label: t('startups') },
    { to: '/opportunities', label: t('opportunities') },
    { to: '/pricing', label: t('pricing') },
  ];

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
    <nav className="sticky top-0 z-50 transition-colors bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-indigo-500/20 shadow-md dark:shadow-lg">
      {/* Glowing Gradient Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"></div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Startup<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Forge</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl font-bold text-xs xl:text-sm transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-indigo-50 dark:bg-indigo-600/30 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-2 xl:space-x-3 shrink-0">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 shadow-xs"
              title="Switch Language (English / বাংলা)"
            >
              <span>🌐</span> {language === 'EN' ? 'EN' : 'বাংলা'}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700/60 shadow-xs"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <HiSun size={18} className="text-amber-400 animate-spin-slow" /> : <HiMoon size={18} className="text-slate-700" />}
            </button>

            {/* In-App Notifications Dropdown */}
            {user && <NotificationDropdown />}

            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs xl:text-sm transition-all duration-200 ${
                    isActive(getDashboardLink())
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {t('dashboard')}
                </Link>

                <Link
                  to="/dashboard/profile"
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700/50 max-w-[140px]"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-500/50 shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all duration-200 shadow-md text-[11px] uppercase tracking-wider"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs xl:text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              {language === 'EN' ? 'EN' : 'বাংলা'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {darkMode ? <HiSun size={20} className="text-amber-400" /> : <HiMoon size={20} />}
            </button>
            <button
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(!open)}
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-bold ${
                    isActive(link.to)
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-200 dark:border-slate-800" />
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('dashboard')}
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold text-center bg-indigo-600 text-white rounded-xl"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
