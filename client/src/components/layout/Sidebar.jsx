import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome, FiBriefcase, FiPlusCircle, FiList, FiUsers,
  FiUser, FiDollarSign, FiLogOut, FiShoppingBag, FiChevronLeft, FiChevronRight,
  FiBookmark, FiFileText, FiMessageCircle, FiTrendingUp, FiActivity, FiStar, FiZap
} from 'react-icons/fi';

export default function Sidebar() {
  const { user, logout, t } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const founderLinks = [
    { to: '/dashboard/founder', label: t('overview'), shortLabel: t('overview'), icon: FiHome },
    { to: '/dashboard/founder/my-startup', label: t('myStartup'), shortLabel: t('startups'), icon: FiBriefcase },
    { to: '/dashboard/founder/add-opportunity', label: t('addPosition'), shortLabel: t('addPosition'), icon: FiPlusCircle },
    { to: '/dashboard/founder/manage-opportunities', label: t('managePositions'), shortLabel: t('positions'), icon: FiList },
    { to: '/dashboard/founder/applications', label: t('applications'), shortLabel: t('applications'), icon: FiUsers },
    { to: '/dashboard/founder/cap-table', label: 'Cap Table Calculator', shortLabel: 'Cap Table', icon: FiTrendingUp },
    { to: '/dashboard/founder/analytics', label: t('analytics'), shortLabel: t('analytics'), icon: FiActivity },
    { to: '/pricing', label: t('pricing'), shortLabel: t('pricing'), icon: FiStar },
  ];

  const collaboratorLinks = [
    { to: '/dashboard/collaborator', label: t('overview'), shortLabel: t('overview'), icon: FiHome },
    { to: '/opportunities', label: t('findOpportunities'), shortLabel: t('positions'), icon: FiShoppingBag },
    { to: '/dashboard/ai-match', label: t('aiMatcher'), shortLabel: 'AI Match', icon: FiZap },
    { to: '/dashboard/code-sandbox', label: 'Live Code Sandbox', shortLabel: 'Sandbox', icon: FiFileText },
    { to: '/dashboard/ai-interview', label: 'AI Voice Interviewer', shortLabel: 'AI Voice', icon: FiMessageCircle },
    { to: '/dashboard/resume-analyzer', label: t('resumeAnalyzer'), shortLabel: 'Resume', icon: FiFileText },
    { to: '/dashboard/collaborator/applications', label: t('applications'), shortLabel: t('applications'), icon: FiList },
    { to: '/dashboard/bookmarks', label: t('bookmarks'), shortLabel: t('bookmarks'), icon: FiBookmark },
  ];

  const adminLinks = [
    { to: '/dashboard/admin', label: t('overview'), shortLabel: t('overview'), icon: FiHome },
    { to: '/dashboard/admin/users', label: t('users'), shortLabel: t('users'), icon: FiUsers },
    { to: '/dashboard/admin/startups', label: t('startups'), shortLabel: t('startups'), icon: FiBriefcase },
    { to: '/dashboard/admin/opportunities', label: t('positions'), shortLabel: t('positions'), icon: FiList },
    { to: '/dashboard/admin/transactions', label: t('payments'), shortLabel: t('payments'), icon: FiDollarSign },
    { to: '/dashboard/admin/activity', label: 'Activity Logs', shortLabel: 'Logs', icon: FiActivity },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'founder': return founderLinks;
      case 'collaborator': return collaboratorLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40">
        <motion.div
          animate={{ width: collapsed ? 80 : 260 }}
          className="h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col shadow-2xl transition-all duration-300"
        >
        {/* Brand Header */}
        <div className={`p-5 flex items-center border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed ? (
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                  Startup<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Forge</span>
                </span>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">AI Platform 2.0</p>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl">S</span>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="p-3">
          {!collapsed && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
              <div className="relative shrink-0">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="Online Status"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <span className="inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5 no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={collapsed ? link.label : ''}
              >
                <Icon size={collapsed ? 22 : 18} className={isActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'} />
                {!collapsed && <span className="tracking-wide">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-1.5">
          <Link
            to="/dashboard/profile"
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-300 ${
              location.pathname === '/dashboard/profile'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={collapsed ? t('profileSettings') : ''}
          >
            <FiUser size={collapsed ? 22 : 18} />
            {!collapsed && <span className="tracking-wide">{t('profileSettings')}</span>}
          </Link>
          <button
            onClick={logout}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 w-full font-bold text-xs`}
            title={collapsed ? t('logout') : ''}
          >
            <FiLogOut size={collapsed ? 22 : 18} />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-2.5 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-200 w-full transition-all"
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>
      </motion.div>
    </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-800 dark:text-white z-50 grid grid-cols-5 py-2 px-1 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center py-1 px-0.5 font-bold ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
              } transition-colors min-w-0`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="mt-0.5 text-[9px] sm:text-[10px] tracking-tight truncate w-full text-center block font-semibold">
                {link.shortLabel || link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
