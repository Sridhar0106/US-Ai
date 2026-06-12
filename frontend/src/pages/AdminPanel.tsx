import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Video, 
  FileText, 
  Compass, 
  Trophy, 
  Trash2, 
  ShieldAlert, 
  Settings,
  ShieldCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlatformStats {
  totalUsers: number;
  totalInterviews: number;
  totalResumes: number;
  totalRoadmaps: number;
  avgScore: number;
  roleDistribution: { role: string; count: number }[];
  registrationTrend: { date: string; count: number }[];
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.message || 'Access denied. Administrator credentials required.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const nextRole = currentRole === 'user' ? 'admin' : 'user';
    if (!window.confirm(`Are you sure you want to change user role to ${nextRole}?`)) return;

    try {
      await api.put('/admin/users/role', { userId, role: nextRole });
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: nextRole } : u));
      alert('User role updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('WARNING: Deleting this user will erase all their mock interviews, resumes, and roadmap trackers forever. Proceed?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsersList(prev => prev.filter(u => u._id !== userId));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
      alert('User deleted successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl max-w-lg mx-auto text-center space-y-4 font-sans">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold">Unauthorized Access</h3>
        <p className="text-xs">
          This workspace is protected. You must be authenticated as an administrator to audit system statistics and user details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* HEADER ROOM */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <span>Platform Administrator Operations</span>
          <Sparkles className="h-6 w-6 text-accent-500 fill-accent-500 animate-pulse" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Platform control center. Monitor aggregated analytics, manage roles, audit user activities, and adjust template prompts.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-96 flex flex-col justify-center items-center gap-3 animate-pulse">
          <Settings className="h-12 w-12 text-primary-500 animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Synchronizing platform metrics...</p>
        </div>
      ) : (
        <>
          {/* STATS COUNT GRID */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Users */}
              <div className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Users</p>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalUsers}</h3>
                </div>
              </div>

              {/* Interviews */}
              <div className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 shrink-0">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Mock Loops</p>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalInterviews}</h3>
                </div>
              </div>

              {/* Resumes */}
              <div className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 text-cyan-500 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">PDF Resumes</p>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalResumes}</h3>
                </div>
              </div>

              {/* Roadmaps */}
              <div className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Study Roadmaps</p>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.totalRoadmaps}</h3>
                </div>
              </div>

              {/* Average Score */}
              <div className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex items-center gap-3.5 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Avg Mock Rating</p>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{stats.avgScore ? `${stats.avgScore}/10` : '—'}</h3>
                </div>
              </div>

            </div>
          )}

          {/* LOWER ANALYTICS ROW */}
          {stats && stats.roleDistribution.length > 0 && (
            <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">Domain Usage statistics</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.roleDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2438" opacity={0.15} />
                    <XAxis dataKey="role" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 20, 32, 0.95)', 
                        borderColor: '#1f2438',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* USERS LIST TABLE */}
          <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">User Management Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-darkBorder text-slate-400 text-xs font-semibold uppercase">
                    <th className="pb-3.5 pl-2">Candidate</th>
                    <th className="pb-3.5">Email</th>
                    <th className="pb-3.5">Registration Date</th>
                    <th className="pb-3.5">Status (Role)</th>
                    <th className="pb-3.5 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="border-b border-slate-100 dark:border-darkBorder/40 hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                      <td className="py-3.5 pl-2 flex items-center gap-3">
                        <img src={usr.avatar} alt={usr.name} className="h-8.5 w-8.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-250 dark:border-darkBorder shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{usr.name}</span>
                      </td>
                      <td className="py-3.5 text-slate-500 font-medium">{usr.email}</td>
                      <td className="py-3.5 text-xs text-slate-550">{new Date(usr.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5">
                        <button
                          onClick={() => handleUpdateRole(usr._id, usr.role)}
                          disabled={usr._id === currentUser.id}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1.5 border ${
                            usr.role === 'admin' 
                              ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                              : 'bg-slate-100 text-slate-500 border-slate-250/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60'
                          } disabled:opacity-40`}
                          title="Click to toggle role user/admin"
                        >
                          {usr.role === 'admin' ? <ShieldCheck className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                          <span>{usr.role}</span>
                        </button>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => handleDeleteUser(usr._id)}
                          disabled={usr._id === currentUser.id}
                          className="text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
export default AdminPanel;
