import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiSearch, FiBriefcase, FiClock, FiMapPin, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';

const workTypes = ['', 'remote', 'onsite', 'hybrid'];
const industries = ['', 'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI', 'Blockchain', 'Other'];

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [workType, setWorkType] = useState('');
  const [industry, setIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (searchTerm) params.role_title = searchTerm;
      if (workType) params.work_type = workType;
      if (industry) params.industry = industry;
      const { data } = await api.get('/opportunities/all', { params });
      setOpportunities(data.opportunities);
      setTotalPages(data.pages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOpportunities(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchOpportunities(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Opportunities</h1>
        <p className="text-gray-500 text-lg">Find your next role in an exciting startup</p>
      </motion.div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title..." 
              className="input-field pl-11" />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-600 hover:border-blue-300 transition-all flex items-center justify-center gap-2">
            <FiFilter size={18} /> Filters
          </button>
          <button type="submit" className="btn-primary">
            <FiSearch className="md:hidden" size={18} />
            <span className="hidden md:inline">Search Opportunities</span>
          </button>
        </div>

        <div className={`mt-3 flex-col md:flex-row gap-3 ${showFilters ? 'flex' : 'hidden'} md:flex`}>
          <select value={workType} onChange={(e) => { setWorkType(e.target.value); setPage(1); }}
            className="input-field md:w-48">
            <option value="">All Work Types</option>
            {workTypes.filter(Boolean).map(wt => (
              <option key={wt} value={wt} className="capitalize">{wt.charAt(0).toUpperCase() + wt.slice(1)}</option>
            ))}
          </select>
          <select value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
            className="input-field md:w-48">
            <option value="">All Industries</option>
            {industries.filter(Boolean).map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-20"><div className="loader loader-lg"></div></div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20">
          <FiBriefcase className="mx-auto text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No opportunities found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 card-hover flex flex-col"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{opp.role_title}</h3>
                      <p className="text-gray-500 text-sm flex items-center mt-1">
                        <FiBriefcase className="mr-1.5" size={14} /> {opp.startup_id?.startup_name || 'Startup'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium capitalize shrink-0">{opp.work_type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.required_skills?.slice(0, 5).map((skill, j) => (
                      <span key={j} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center"><FiClock className="mr-1.5" size={14} /> <span className="capitalize">{opp.commitment_level}</span></span>
                    <span className="flex items-center"><FiMapPin className="mr-1.5" size={14} /> <span className="capitalize">{opp.work_type}</span></span>
                  </div>
                  <p className="text-sm font-medium flex items-center text-red-500">
                    <FiClock className="mr-1.5" size={14} />
                    Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <Link to="/login"
                  className="mt-4 block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-600/25">
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    page === p
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
