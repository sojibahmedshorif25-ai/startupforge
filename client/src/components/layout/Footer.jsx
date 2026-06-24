import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-lg">S</span>
              </div>
              <span className="text-xl font-extrabold text-white">Startup<span className="text-blue-400">Forge</span></span>
            </div>
            <p className="text-gray-400 leading-relaxed">Building bridges between visionary founders and talented collaborators. Turn your startup ideas into reality.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
              <Link to="/startups" className="text-gray-400 hover:text-white transition-colors text-sm">Browse Startups</Link>
              <Link to="/opportunities" className="text-gray-400 hover:text-white transition-colors text-sm">Opportunities</Link>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Sign In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">contact@startupforge.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
              <p className="text-gray-400">San Francisco, CA</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <div className="flex space-x-3">
              {[
                { icon: FaFacebook, href: '#' },
                { icon: FaTwitter, href: '#' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaGithub, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href}
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} StartupForge. All rights reserved.</p>
          <p className="text-gray-500 text-sm flex items-center gap-1">Made with <FaHeart className="text-red-500" /> by StartupForge Team</p>
        </div>
      </div>
    </footer>
  );
}
