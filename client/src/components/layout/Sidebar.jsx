import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome, FiBriefcase, FiPlusCircle, FiList, FiUsers,
  FiUser, FiDollarSign, FiLogOut, FiShoppingBag, FiChevronLeft, FiChevronRight, FiZap
} from 'react-icons/fi';

const founderLinks = [
  { to: '/dashboard/founder', label: 'Overview', icon: FiHome },
  { to: '/dashboard/founder/my-startup', label: 'My Startup', icon: FiBriefcase },
  { to: '/dashboard/founder/add-opportunity', label: 'Add Opportunity', icon: FiPlusCircle },
  { to: '/dashboard/founder/manage-opportunities', label: 'Manage Positions', icon: FiList },
  { to: '/dashboard/founder/applications', label: 'Applications', icon: FiUsers },
];

const collaboratorLinks = [
  { to: '/dashboard/collaborator', label: 'Overview', icon: FiHome },
  { to: '/opportunities', label: 'Browse Positions', icon: FiShoppingBag },
  { to: '/dashboard/collaborator/applications', label: 'My Applications', icon: FiList },
];

const adminLinks = [
  { to: '/dashboard/admin', label: 'Overview', icon: FiHome },
  { to: '/dashboard/admin/users', label: 'Manage Users', icon: FiUsers },
  { to: '/dashboard/admin/startups', label: 'Manage Startups', icon: FiBriefcase },
  { to: '/dashboard/admin/transactions', label: 'Transactions', icon: FiDollarSign },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
      <motion.div
        animate={{ width: collapsed ? 80 : 260 }}
        className="fixed left-0 top-0 h-full bg-[#0c0d14] border-r border-[#1e1f30] text-white z-40 hidden md:flex flex-col shadow-2xl"
      >
        {/* Brand Header */}
        <div className={`p-5 flex items-center border-b border-[#1e1f30] ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed ? (
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight">
                  Startup<span className="gradient-text">Forge</span>
                </span>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">AI Venture OS</p>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
              <span className="text-white font-black text-xl">S</span>
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="p-3">
          {!collapsed && (
            <div className="flex items-center space-x-3 p-3 bg-[#151624] border border-[#23253b] rounded-2xl shadow-inner">
              <div className="relative shrink-0">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0c0d14] rounded-full" title="Online Status"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white truncate">{user?.name}</p>
                <span className="inline-block px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl font-extrabold text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-purple-600/35 scale-[1.02]'
                    : 'text-slate-400 hover:bg-[#181928] hover:text-white'
                }`}
                title={collapsed ? link.label : ''}
              >
                <Icon size={collapsed ? 22 : 18} className={isActive ? 'text-white' : 'text-purple-400'} />
                {!collapsed && <span className="tracking-wide">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-[#1e1f30] p-3 space-y-1.5">
          <Link
            to="/dashboard/profile"
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl font-extrabold text-xs transition-all duration-300 ${
              location.pathname === '/dashboard/profile'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-purple-600/35'
                : 'text-slate-400 hover:bg-[#181928] hover:text-white'
            }`}
            title={collapsed ? 'Profile' : ''}
          >
            <FiUser size={collapsed ? 22 : 18} />
            {!collapsed && <span className="tracking-wide">Profile Settings</span>}
          </Link>
          <button
            onClick={logout}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3.5'} px-3.5 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all duration-300 w-full font-extrabold text-xs`}
            title={collapsed ? 'Logout' : ''}
          >
            <FiLogOut size={collapsed ? 22 : 18} />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-2.5 rounded-2xl text-slate-500 hover:bg-[#181928] hover:text-slate-300 w-full transition-all"
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c0d14] text-white z-40 flex justify-around py-3 border-t border-[#1e1f30]">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center text-[10px] font-bold ${isActive ? 'text-purple-400' : 'text-slate-500'} transition-colors px-2`}
            >
              <Icon size={18} />
              <span className="mt-1 truncate max-w-[60px]">{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
