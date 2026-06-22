import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Video,
  FileText,
  Compass,
  BarChart3,
  Bookmark,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// InterviewAI logo SVG mark matching the reference image
const LogoMark: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0"
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="14" height="14" rx="3" stroke="white" strokeWidth="1.5" />
      <path d="M6 9 L9 6 L12 9 L9 12 Z" fill="white" />
    </svg>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'user' },
    { name: 'Interviews', path: '/roles', icon: Video, role: 'user' },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText, role: 'user' },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, role: 'user' },
    { name: 'Roadmap', path: '/roadmap', icon: Compass, role: 'user' },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark, role: 'user' },
    { name: 'Admin Control', path: '/admin', icon: ShieldAlert, role: 'admin' },
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  const currentPage = menuItems.find(item => isActive(item.path))?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex">

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 sticky top-0 h-screen z-20"
        style={{ background: 'linear-gradient(180deg, #0d0f1a 0%, #0a0c15 100%)', borderRight: '1px solid #1a1f35' }}>

        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid #1a1f35' }}>
          <LogoMark size={34} />
          <span className="text-lg font-extrabold tracking-tight logo-text font-display">
            InterviewAI
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.role === 'admin' && user?.role !== 'admin') return null;
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(124,58,237,0.65) 100%)',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                } : {}}
              >
                <Icon
                  style={{ width: '17px', height: '17px' }}
                  className={active ? 'text-white' : 'text-slate-600'}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Settings + Logout */}
        <div className="px-3 pb-5 pt-3 space-y-0.5" style={{ borderTop: '1px solid #1a1f35' }}>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(124,58,237,0.65) 100%)',
                } : {}}
              >
                <Icon style={{ width: '17px', height: '17px' }} className="shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm w-full text-slate-500 hover:text-rose-400 transition-all duration-150 group"
            style={{ transition: 'color 0.15s ease' }}
          >
            <LogOut style={{ width: '17px', height: '17px' }} className="shrink-0 group-hover:text-rose-400 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">

        {/* MOBILE HEADER */}
        <header
          className="md:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-30"
          style={{ background: '#0d0f1a', borderBottom: '1px solid #1a1f35' }}
        >
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span className="text-base font-extrabold tracking-tight logo-text font-display">InterviewAI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* MOBILE MENU OVERLAY */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-x-0 top-[61px] bottom-0 z-25 flex flex-col p-4 animate-fade-in"
            style={{ background: '#0d0f1a', borderTop: '1px solid #1a1f35' }}
          >
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                if (item.role === 'admin' && user?.role !== 'admin') return null;
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(124,58,237,0.65) 100%)',
                    } : {}}
                  >
                    <Icon style={{ width: '17px', height: '17px' }} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 mt-4 space-y-1" style={{ borderTop: '1px solid #1a1f35' }}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm w-full text-rose-400 transition-all"
              >
                <LogOut style={{ width: '17px', height: '17px' }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP TOP BAR */}
        <header
          className="hidden md:flex items-center justify-between px-8 py-3 sticky top-0 z-10"
          style={{ background: 'rgba(9,10,15,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1f35' }}
        >
          <h2 className="text-sm font-bold text-slate-300 tracking-wide">
            {currentPage}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
            </button>
            <div className="h-5 w-px" style={{ background: '#1f2538' }} />
            {/* User Avatar */}
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'user'}`}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: '2px solid #1f2538', background: '#1a1f35' }}
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
