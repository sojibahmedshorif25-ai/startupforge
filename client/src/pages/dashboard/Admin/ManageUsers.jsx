import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { FiUser, FiShield, FiShieldOff } from 'react-icons/fi';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try { const { data } = await api.get('/admin/users'); setUsers(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBlock = async (id) => {
    try { await api.put(`/admin/users/${id}/toggle-block`); toast.success('User status updated'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-extrabold mb-2">Manage Users</h1>
      <p className="text-gray-500 mb-8">View and manage platform users</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">User</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold capitalize">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      user.isBlocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>{user.isBlocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleBlock(user._id)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        user.isBlocked
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}>
                      {user.isBlocked ? <FiShield className="mr-1.5" size={14} /> : <FiShieldOff className="mr-1.5" size={14} />}
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
