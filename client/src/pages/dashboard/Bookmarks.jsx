import { useState, useEffect } from 'react';
import { FiBookmark, FiTrash2, FiBriefcase, FiLayers, FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function Bookmarks() {
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarks, setBookmarks] = useState({ startups: [], opportunities: [] });
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      if (res.data.success) {
        setBookmarks({
          startups: res.data.startups || [],
          opportunities: res.data.opportunities || [],
        });
      }
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const removeBookmark = async (type, id) => {
    try {
      const payload = type === 'startup' ? { item_type: 'startup', startup_id: id } : { item_type: 'opportunity', opportunity_id: id };
      const res = await api.post('/bookmarks/toggle', payload);
      if (res.data.success) {
        toast.success('Bookmark removed');
        if (type === 'startup') {
          setBookmarks((prev) => ({ ...prev, startups: prev.startups.filter((s) => s._id !== id) }));
        } else {
          setBookmarks((prev) => ({ ...prev, opportunities: prev.opportunities.filter((o) => o._id !== id) }));
        }
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  const totalCount = bookmarks.startups.length + bookmarks.opportunities.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
              <FiBookmark className="w-3.5 h-3.5" /> Bookmarks Hub
            </span>
            <h1 className="text-3xl font-black text-white">Your Saved Bookmarks</h1>
            <p className="text-slate-300 text-xs mt-1">Manage all your saved startups and bookmarked opportunities in one place.</p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 font-bold text-sm text-indigo-400">
            {totalCount} Items Saved
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {['all', 'startups', 'opportunities'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading saved bookmarks...</div>
      ) : totalCount === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <FiBookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse startups or positions and click the bookmark icon to save them for quick access.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/startups" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200">
              Browse Startups
            </Link>
            <Link to="/opportunities" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">
              Browse Opportunities
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Startups Section */}
          {(activeTab === 'all' || activeTab === 'startups') && bookmarks.startups.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiLayers className="text-indigo-500" /> Saved Startups ({bookmarks.startups.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.startups.map((startup) => (
                  <div key={startup._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                          {startup.industry}
                        </span>
                        <button
                          onClick={() => removeBookmark('startup', startup._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{startup.startup_name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{startup.description}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Stage: {startup.funding_stage}</span>
                      <Link to={`/startups/${startup._id}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                        View Startup <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities Section */}
          {(activeTab === 'all' || activeTab === 'opportunities') && bookmarks.opportunities.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiBriefcase className="text-indigo-500" /> Saved Opportunities ({bookmarks.opportunities.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.opportunities.map((opp) => (
                  <div key={opp._id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 capitalize">
                          {opp.work_type} • {opp.commitment_level}
                        </span>
                        <button
                          onClick={() => removeBookmark('opportunity', opp._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Remove bookmark"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{opp.role_title}</h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{opp.startup_id?.startup_name || 'Startup'}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                      <Link to={`/opportunities/${opp._id}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                        Apply Now <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
