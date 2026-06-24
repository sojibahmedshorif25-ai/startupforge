import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FiHome, FiBriefcase, FiPlusCircle, FiList, FiUsers,
  FiUser, FiDollarSign, FiLogOut, FiShoppingBag, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const founderLinks = [
  { to: '/dashboard/founder', label: 'Overview', icon: FiHome },
  { to: '/dashboard/founder/my-startup', label: 'My Startup', icon: FiBriefcase },
  { to: '/dashboard/founder/add-opportunity', label: 'Add Opportunity', icon: FiPlusCircle },
  { to: '/dashboard/founder/manage-opportunities', label: 'Manage Opportunities', icon: FiList },
  { to: '/dashboard/founder/applications', label: 'Applications', icon: FiUsers },
];

const collaboratorLinks = [
  { to: '/dashboard/collaborator', label: 'Overview', icon: FiHome },
  { to: '/opportunities', label: 'Browse Opportunities', icon: FiShoppingBag },
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
        animate={{ width: collapsed ? 72 : 256 }}
        className="fixed left-0 top-0 h-full bg-gray-900 text-white z-40 hidden md:flex flex-col shadow-2xl shadow-gray-900/20"
      >
        <div className={`p-4 flex items-center border-b border-gray-800 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-sm">StartupForge</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {!collapsed && (
            <div className="flex items-center space-x-3 px-3 py-3 mb-4 bg-gray-800/50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          )}

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                title={collapsed ? link.label : ''}
              >
                <Icon size={collapsed ? 22 : 20} />
                {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-800 p-3 space-y-1">
          <Link to="/dashboard/profile"
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
              location.pathname === '/dashboard/profile'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            title={collapsed ? 'Profile' : ''}>
            <FiUser size={collapsed ? 22 : 20} />
            {!collapsed && <span className="text-sm font-medium">Profile</span>}
          </Link>
          <button onClick={logout}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full`}
            title={collapsed ? 'Logout' : ''}>
            <FiLogOut size={collapsed ? 22 : 20} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-800 w-full transition-all">
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>
      </motion.div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-40 flex justify-around py-2 border-t border-gray-800">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}
              className={`flex flex-col items-center text-[10px] ${isActive ? 'text-blue-400' : 'text-gray-500'} transition-colors px-2`}>
              <Icon size={18} />
              <span className="mt-0.5 truncate max-w-[50px]">{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
