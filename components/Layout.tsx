import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Logo } from './ui';
import { User, Globe, Library, Youtube, Linkedin, Github, Instagram, Bookmark, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={{ width: 18, height: 18 }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h.001Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  
  const isGate = location.pathname === '/gate';

  const handleLogout = () => {
    logout();
    navigate('/gate');
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans text-slate-200 selection:bg-gemini-pro/30 selection:text-white flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-navy-950 -z-20" />
      <div className="fixed inset-0 bg-glow-radial -z-10 opacity-40 pointer-events-none" />
      
      {/* Dynamic Stars */}
      <div className="fixed inset-0 -z-15 pointer-events-none opacity-60">
        <div className="absolute top-10 left-[10%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_white] animate-pulse" />
        <div className="absolute top-40 right-[20%] w-0.5 h-0.5 bg-gemini-ultra rounded-full opacity-50" />
        <div className="absolute bottom-20 left-[30%] w-1 h-1 bg-gemini-pro rounded-full opacity-40 blur-[1px]" />
        <div className="absolute top-1/2 left-[5%] w-0.5 h-0.5 bg-gemini-nano rounded-full shadow-[0_0_6px_rgba(244,180,0,0.8)]" />
      </div>

      {!isGate && (
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Logo />

            <div className="flex items-center gap-2">
              <Link
                to="/library"
                className="flex items-center gap-2 text-sm font-medium text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 transition-colors px-3 py-2 sm:px-4 rounded-full"
              >
                <Library size={16} />
                <span className="hidden sm:inline">{t('resources')}</span>
              </Link>
              
              <button
                onClick={toggleLang}
                title="Toggle Language"
                className="w-9 h-9 flex items-center justify-center bg-slate-800/60 hover:bg-slate-700/60 rounded-full transition-colors"
              >
                <Globe size={16} />
              </button>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    className="w-9 h-9 flex items-center justify-center bg-slate-800/60 hover:bg-slate-700/60 rounded-full transition-colors"
                  >
                    <User size={16} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 w-48">
                     <div className="bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                        <button className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                           <User size={14} /> {t('account')}
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                           <Bookmark size={14} /> {t('bookmarks')}
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                           <Settings size={14} /> {t('settings')}
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 hover:bg-red-500/10 flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                           <LogOut size={14} /> {t('logout')}
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/gate"
                  title={t('login')}
                  className="w-9 h-9 flex items-center justify-center bg-slate-800/60 hover:bg-slate-700/60 rounded-full transition-colors"
                >
                  <User size={16} />
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`relative z-0 flex-grow ${!isGate ? 'pt-16' : ''}`}>
        {children}
      </main>

      {!isGate && (
        <footer className="border-t border-white/5 bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
               
               {/* Left: Social Icons */}
               <div className="flex items-center gap-6 text-slate-500 z-10">
                  <a href="#" className="hover:text-slate-300 transition-colors"><XIcon className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-slate-300 transition-colors"><Youtube size={18} /></a>
                  <a href="#" className="hover:text-slate-300 transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="hover:text-slate-300 transition-colors"><Github size={18} /></a>
                  <a href="#" className="hover:text-slate-300 transition-colors"><Instagram size={18} /></a>
               </div>

               {/* Center: Copyright */}
               <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase md:absolute md:left-1/2 md:-translate-x-1/2">
                  &copy; 2026 TEZIGN.
               </div>

               {/* Right: Cookies & Language */}
               <div className="flex items-center gap-6 z-10">
                  <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium">
                     <button className="hover:text-slate-300 transition-colors">Manage Cookies</button>
                  </div>
                  
                  <button 
                    onClick={toggleLang}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all border border-white/5 hover:border-white/10"
                  >
                     <Globe size={14} />
                     <span>{lang === 'en' ? 'English (US)' : '中文 (CN)'}</span>
                  </button>
               </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;