import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import { FiZap, FiShield, FiStar, FiCode } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative bg-[#05070D] border-t border-purple-500/20 text-slate-400 overflow-hidden">
      {/* Startup Tech Team Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070D]/90 via-[#05070D]/95 to-[#05070D] pointer-events-none"></div>

      {/* Silky Glowing Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/40 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-2xl">S</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Startup<span className="gradient-text">Forge</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Building bridges between visionary founders and talented co-builders. Supercharged with Google Gemini AI co-pilots.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-black shadow-lg">
              <FiZap className="text-amber-400 animate-pulse" /> Powered by Gemini 1.5 AI Engine
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-indigo-400">Navigation</h4>
            <div className="flex flex-col space-y-3 font-semibold text-sm">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-purple-500">›</span> Home</Link>
              <Link to="/startups" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-purple-500">›</span> Browse 15+ Startups</Link>
              <Link to="/opportunities" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-purple-500">›</span> Open Roles & Opportunities</Link>
              <Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-1.5"><span className="text-purple-500">›</span> Pricing & Pro Upgrade</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-indigo-400">AI Platform Features</h4>
            <div className="flex flex-col space-y-3 font-medium text-sm">
              <Link to="/dashboard/founder/add-opportunity" className="hover:text-white transition-colors flex items-center gap-1.5"><FiStar className="text-indigo-400" /> AI Pitch Generator</Link>
              <Link to="/opportunities" className="hover:text-white transition-colors flex items-center gap-1.5"><FiZap className="text-purple-400" /> AI Skill Match Score %</Link>
              <Link to="/dashboard/profile" className="hover:text-white transition-colors flex items-center gap-1.5"><FiCode className="text-emerald-400" /> AI Executive Bio Assistant</Link>
              <Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-1.5"><FiShield className="text-amber-400" /> Stripe 256-Bit Encrypted Payments</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-indigo-400">Connect & Social</h4>
            <div className="flex space-x-3 mb-6">
              {[
                { icon: FaFacebook, href: 'https://facebook.com' },
                { icon: FaTwitter, href: 'https://twitter.com' },
                { icon: FaLinkedin, href: 'https://linkedin.com' },
                { icon: FaGithub, href: 'https://github.com/sojibahmedshorif25-ai/startupforge' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:scale-110"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-bold bg-white/5 px-3 py-2 rounded-xl border border-white/5 inline-block">
              🌐 San Francisco, CA & Global
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold">
          <p className="text-slate-400">&copy; {new Date().getFullYear()} StartupForge AI. All rights reserved.</p>
          
          {/* Explicitly Requested: Crafted by Sojib Ahmed */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-full shadow-lg">
            <span className="text-slate-300">Crafted with</span>
            <FaHeart className="text-rose-500 animate-pulse" />
            <span className="text-slate-300">by</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 font-black text-sm tracking-wide">
              Sojib Ahmed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
