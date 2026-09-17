import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCompass, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-2xl"
        >
          <FiCompass size={48} className="animate-spin-slow" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl font-black gradient-text mb-2 tracking-tight"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-3"
        >
          Lost in Space?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-sm leading-relaxed mb-8"
        >
          The startup role or venture page you are looking for does not exist or has been relocated to another sector.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/" className="btn-ai text-sm px-8 py-3.5 inline-flex items-center gap-2 font-bold shadow-xl">
            <FiHome size={18} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
