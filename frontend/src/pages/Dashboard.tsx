import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Play,
  ArrowUpRight,
  CheckCircle2,
  Star,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface Interview {
  _id: string;
  role: string;
  difficulty: string;
  status: string;
  createdAt: string;
  finalReport?: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  };
}

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const ROLE_COLOR = (role: string) => {
  const colors: Record<string, string> = {
    'Frontend Developer': '#2563EB',
    'Backend Developer': '#7C3AED',
    'Full Stack Developer': '#ef4444',
    'Data Scientist': '#06B6D4',
    'Java Developer': '#f59e0b',
    'Python Developer': '#10b981',
    'Data Analyst': '#8b5cf6',
    'AI/ML Engineer': '#ec4899',
  };
  const match = Object.entries(colors).find(([k]) => role.toLowerCase().includes(k.toLowerCase().split(' ')[0]));
  return match ? match[1] : '#2563EB';
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const intRes = await api.get('/interviews/user');
        setInterviews(intRes.data);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const completed = interviews.filter(i => i.status === 'completed');
  const totalCompleted = completed.length;

  const averageScore = totalCompleted
    ? Math.round(completed.reduce((acc, curr) => acc + (curr.finalReport?.overallScore || 0), 0) / totalCompleted * 10)
    : 78;

  // Demo chart data mirroring the reference image curve
  const chartData = totalCompleted >= 2
    ? completed.slice().reverse().map((i, idx) => ({
        name: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round((i.finalReport?.overallScore || 0) * 10),
      }))
    : [
        { name: 'May 5', score: 55 },
        { name: 'May 12', score: 62 },
        { name: 'May 19', score: 58 },
        { name: 'May 26', score: 75 },
        { name: 'Jun 2', score: 70 },
        { name: 'Jun 8', score: 80 },
      ];

  // Recent interviews for the right panel
  const recentInterviews = completed.length > 0
    ? completed.slice(0, 4).map(i => ({
        id: i._id,
        role: i.role,
        date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: Math.round((i.finalReport?.overallScore || 0) * 10),
      }))
    : [
        { id: '1', role: 'Frontend Developer', date: 'Jun 10, 2025 • 10:30 AM', score: 82 },
        { id: '2', role: 'Backend Developer', date: 'Jun 08, 2025 • 11:05 PM', score: 74 },
        { id: '3', role: 'Full Stack Developer', date: 'Jun 05, 2025 • 11:20 AM', score: 68 },
      ];

  const statsCards = [
    {
      label: 'Interviews Completed',
      value: totalCompleted || 24,
      change: '+12% from last week',
      positive: true,
      icon: <CheckCircle2 className="w-5 h-5" />,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      change: '+8% from last week',
      positive: true,
      icon: <Star className="w-5 h-5" />,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Strong Areas',
      value: 6,
      change: '+2 new this week',
      positive: true,
      icon: <Zap className="w-5 h-5" />,
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-500',
    },
    {
      label: 'Weak Areas',
      value: 3,
      change: '-1 improved',
      positive: true,
      icon: <AlertTriangle className="w-5 h-5" />,
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* WELCOME HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Sridhar'} 
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Let's crack your dream job!
          </p>
        </div>
        <Link
          to="/roles"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Play className="h-4 w-4 fill-white" />
          Start New Interview
        </Link>
      </div>

      {/* STATS CARDS */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, i) => (
            <div
              key={i}
              className="p-5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{card.value}</h3>
              <p className={`text-xs font-medium flex items-center gap-1 ${card.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MAIN CONTENT: CHART + RECENT INTERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Performance Overview Chart */}
        <div className="lg:col-span-3 p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Performance Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Score (%) ↑</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 17, 30, 0.92)',
                    borderColor: '#1e2538',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Score']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fill="url(#scoreGradient)"
                  dot={{ fill: '#7C3AED', r: 4 }}
                  activeDot={{ r: 6, fill: '#7C3AED' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Interviews Panel */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Recent Interviews</h3>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-primary-500 hover:text-primary-400 flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {recentInterviews.map((item) => {
              const color = ROLE_COLOR(item.role);
              const scoreColor = SCORE_COLOR(item.score);
              return (
                <Link
                  key={item.id}
                  to={completed.length > 0 ? `/report/${item.id}` : '#'}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Role icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {item.role.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{item.role}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                  {/* Score badge */}
                  <div
                    className="text-sm font-bold shrink-0"
                    style={{ color: scoreColor }}
                  >
                    {item.score}%
                  </div>
                </Link>
              );
            })}
          </div>

          {completed.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-3">Demo data • Start an interview to track real progress</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
