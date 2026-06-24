import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { FiUsers, FiBriefcase, FiTarget, FiAward, FiArrowRight, FiStar, FiClock, FiMapPin } from 'react-icons/fi';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    api.get('/startups/featured').then(({ data }) => setStartups(data)).catch(() => {});
    api.get('/opportunities/featured').then(({ data }) => setOpportunities(data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 md:py-36">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200 border border-white/10 mb-8"
            >
              <FiStar className="mr-2 text-yellow-400" size={14} />
              Connecting Founders & Collaborators Worldwide
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              Build Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Dream Team
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect with talented collaborators, publish your startup ideas, and build the next big thing together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50">
                Get Started Free
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/opportunities" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                Browse Opportunities
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Startups' },
              { value: '2000+', label: 'Collaborators' },
              { value: '1000+', label: 'Opportunities' },
              { value: '95%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-gray-500 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Why Join</span>
            <h2 className="section-title mt-2">Why StartupForge?</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Everything you need to build your startup dream team in one place.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiTarget, title: 'Find Your Match', desc: 'Connect with founders and collaborators who share your vision and passion.', color: 'from-blue-500 to-cyan-500' },
              { icon: FiBriefcase, title: 'Build Together', desc: 'Work on exciting startups from day one with dedicated team members.', color: 'from-purple-500 to-pink-500' },
              { icon: FiUsers, title: 'Grow Network', desc: 'Expand your professional network in the startup ecosystem globally.', color: 'from-orange-500 to-red-500' },
              { icon: FiAward, title: 'Get Recognized', desc: 'Showcase your skills, earn recognition, and build your portfolio.', color: 'from-green-500 to-emerald-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group card p-8 card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Featured</span>
              <h2 className="section-title mt-2">Featured Startups</h2>
            </div>
            <Link to="/startups" className="hidden sm:flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group">
              View All <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.slice(0, 3).map((startup, i) => (
              <motion.div
                key={startup._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card overflow-hidden card-hover group"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  {startup.logo ? (
                    <img src={startup.logo} alt={startup.startup_name} className="w-full h-full object-contain p-8 relative z-10" />
                  ) : (
                    <div className="flex items-center justify-center h-full relative z-10">
                      <span className="text-6xl font-extrabold text-white/80">{startup.startup_name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">{startup.industry}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{startup.startup_name}</h3>
                  <p className="text-gray-500 text-sm mb-3">by {startup.founder_name}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{startup.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiUsers className="mr-1.5" size={14} />
                      {startup.team_size_needed} members needed
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{startup.funding_stage}</span>
                  </div>
                  <Link to={`/startups/${startup._id}`}
                    className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-600/25">
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/startups" className="inline-flex items-center text-blue-600 font-medium">View All Startups <FiArrowRight className="ml-1" /></Link>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Open Positions</span>
              <h2 className="section-title mt-2">Featured Opportunities</h2>
            </div>
            <Link to="/opportunities" className="hidden sm:flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group">
              View All <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.slice(0, 3).map((opp, i) => (
              <motion.div
                key={opp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 card-hover flex flex-col"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold">{opp.role_title}</h3>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium capitalize">{opp.work_type}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 flex items-center"><FiBriefcase className="mr-1.5" size={14} /> {opp.startup_id?.startup_name}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {opp.required_skills?.slice(0, 4).map((skill, j) => (
                      <span key={j} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center"><FiClock className="mr-1" size={14} /> {opp.commitment_level}</span>
                    <span className="flex items-center"><FiMapPin className="mr-1" size={14} /> {opp.work_type}</span>
                  </div>
                  <p className="text-sm text-red-500 font-medium flex items-center">
                    <FiClock className="mr-1.5" size={14} />
                    Deadline: {new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <Link to="/login" className="mt-4 block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-600/25">
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/opportunities" className="inline-flex items-center text-blue-600 font-medium">View All Opportunities <FiArrowRight className="ml-1" /></Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="section-title mt-2">Success Stories</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Hear from founders and collaborators who found their perfect match.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'Founder, TechFlow', story: 'StartupForge helped me find my CTO within a week. Now we have 10k+ users and growing!', color: 'from-blue-500 to-cyan-500' },
              { name: 'Mike Johnson', role: 'Senior Developer', story: 'Joined an early-stage startup as a developer. Best career decision I ever made.', color: 'from-purple-500 to-pink-500' },
              { name: 'Priya Patel', role: 'UI/UX Designer', story: 'The platform matched me with projects that perfectly align with my design philosophy.', color: 'from-orange-500 to-red-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-8 card-hover text-center relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-4">{item.role}</p>
                <p className="text-gray-600 leading-relaxed">"{item.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Ready to Build Your Dream Team?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of founders and collaborators already building together on StartupForge.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/register"
              className="group inline-flex items-center px-10 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl shadow-black/20">
              Start Your Journey
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
