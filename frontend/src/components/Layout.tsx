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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-darkBg dark:text-slate-100 flex transition-colors duration-300">

      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-20">

        {/* LOGO */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-white font-black text-sm">US</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-secondary-400 bg-clip-text text-transparent">
            US Ai
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.role === 'admin' && user?.role !== 'admin') return null;
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} style={{ width: '18px', height: '18px' }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: Settings + Logout */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-slate-200 dark:border-slate-800 pt-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon style={{ width: '18px', height: '18px' }} className="shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm w-full text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-150"
          >
            <LogOut style={{ width: '18px', height: '18px' }} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">US</span>
            </div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-primary-500 to-secondary-400 bg-clip-text text-transparent">
              US Ai
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-slate-800 z-25 flex flex-col p-5 animate-fade-in">
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
                      active
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon style={{ width: '18px', height: '18px' }} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
              >
                <LogOut style={{ width: '18px', height: '18px' }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* TOP BAR FOR DESKTOP */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 sticky top-0 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 z-10">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>
            <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-800"
            />
          </div>
        </header>

        {/* MAIN PAGE CONTAINER */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
