import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  frontend:  { bg: '#2563eb', text: '#60a5fa' },
  backend:   { bg: '#7c3aed', text: '#a78bfa' },
  fullstack: { bg: '#dc2626', text: '#f87171' },
  java:      { bg: '#d97706', text: '#fbbf24' },
  python:    { bg: '#059669', text: '#34d399' },
  data:      { bg: '#0891b2', text: '#22d3ee' },
  aiml:      { bg: '#9333ea', text: '#c084fc' },
};

const getRoleColor = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('full')) return ROLE_COLORS.fullstack;
  if (r.includes('front')) return ROLE_COLORS.frontend;
  if (r.includes('back')) return ROLE_COLORS.backend;
  if (r.includes('java')) return ROLE_COLORS.java;
  if (r.includes('python')) return ROLE_COLORS.python;
  if (r.includes('data')) return ROLE_COLORS.data;
  if (r.includes('ai') || r.includes('ml')) return ROLE_COLORS.aiml;
  return ROLE_COLORS.frontend;
};

const getRoleInitials = (role: string) =>
  role.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// Custom Recharts tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#111827',
        border: '1px solid #1e2538',
        borderRadius: '10px',
        padding: '8px 14px',
        fontSize: '12px',
        color: '#f1f5f9',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      }}>
        <div style={{ color: '#94a3b8', marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 700, color: '#818cf8' }}>{payload[0].value}%</div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/interviews/user');
        setInterviews(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completed = interviews.filter(i => i.status === 'completed');
  const totalCompleted = completed.length;

  const averageScore = totalCompleted
    ? Math.round(
        completed.reduce((acc, i) => acc + (i.finalReport?.overallScore || 0), 0) /
        totalCompleted * 10
      )
    : 78;

  const chartData = totalCompleted >= 2
    ? completed.slice().reverse().map(i => ({
        name: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round((i.finalReport?.overallScore || 0) * 10),
      }))
    : [
        { name: 'May 5',  score: 52 },
        { name: 'May 12', score: 63 },
        { name: 'May 19', score: 57 },
        { name: 'May 26', score: 76 },
        { name: 'Jun 2',  score: 69 },
        { name: 'Jun 8',  score: 82 },
      ];

  const recentInterviews = completed.length > 0
    ? completed.slice(0, 4).map(i => ({
        id: i._id,
        role: i.role,
        date: new Date(i.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }) + ' • ' + new Date(i.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit',
        }),
        score: Math.round((i.finalReport?.overallScore || 0) * 10),
      }))
    : [
        { id: '1', role: 'Frontend Developer',  date: 'Jun 10, 2025 • 10:30 AM', score: 82 },
        { id: '2', role: 'Backend Developer',   date: 'Jun 08, 2025 • 11:05 PM', score: 74 },
        { id: '3', role: 'Full Stack Developer',date: 'Jun 05, 2025 • 11:20 AM', score: 68 },
      ];

  const statsCards = [
    {
      label: 'Interviews Completed',
      value: totalCompleted || 24,
      change: '+12% from last week',
      positive: true,
      icon: CheckCircle2,
      accentColor: '#3b82f6',
      bgColor: 'rgba(59,130,246,0.1)',
    },
    {
      label: 'Average Score',
      value: `${averageScore}%`,
      change: '+8% from last week',
      positive: true,
      icon: Star,
      accentColor: '#8b5cf6',
      bgColor: 'rgba(139,92,246,0.1)',
    },
    {
      label: 'Strong Areas',
      value: 6,
      change: '+2 new this week',
      positive: true,
      icon: Zap,
      accentColor: '#06b6d4',
      bgColor: 'rgba(6,182,212,0.1)',
    },
    {
      label: 'Weak Areas',
      value: 3,
      change: '-1 improved',
      positive: true,
      icon: AlertTriangle,
      accentColor: '#f43f5e',
      bgColor: 'rgba(244,63,94,0.1)',
    },
  ];

  const cardStyle: React.CSSProperties = {
    background: '#111827',
    border: '1px solid #1e2538',
    borderRadius: '16px',
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ===== WELCOME HEADER ===== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
            Welcome back, {user?.name?.split(' ')[0] || 'Sridhar'}
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Let's crack your dream job!
          </p>
        </div>
        <Link
          to="/roles"
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
          }}
        >
          <Play className="h-4 w-4 fill-white" />
          Start New Interview
        </Link>
      </div>

      {/* ===== STATS CARDS ===== */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: '#111827', border: '1px solid #1e2538' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="p-5 stat-card"
                style={cardStyle}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium" style={{ color: '#6b7280' }}>{card.label}</p>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: card.bgColor }}
                  >
                    <Icon style={{ width: '16px', height: '16px', color: card.accentColor }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1.5 font-display">{card.value}</h3>
                <p className="text-xs font-medium flex items-center gap-1" style={{ color: card.positive ? '#22c55e' : '#ef4444' }}>
                  {card.positive
                    ? <TrendingUp style={{ width: '12px', height: '12px' }} />
                    : <TrendingDown style={{ width: '12px', height: '12px' }} />
                  }
                  {card.change}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CHART + RECENT INTERVIEWS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Performance Overview Chart */}
        <div className="lg:col-span-3 p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-white font-display">Performance Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Score (%) ↑</p>
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#374151"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#374151"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v => `${v}`}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  dot={{ fill: '#818cf8', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Interviews Panel */}
        <div className="lg:col-span-2 p-6 flex flex-col" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-white font-display">Recent Interviews</h3>
            <Link
              to="/analytics"
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#6366f1' }}
            >
              View All
              <ArrowUpRight style={{ width: '13px', height: '13px' }} />
            </Link>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {recentInterviews.map((item) => {
              const colors = getRoleColor(item.role);
              const scoreColor = SCORE_COLOR(item.score);
              return (
                <Link
                  key={item.id}
                  to={completed.length > 0 ? `/report/${item.id}` : '#'}
                  className="interview-row flex items-center gap-3 p-2.5"
                >
                  {/* Role icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: colors.bg }}
                  >
                    {getRoleInitials(item.role)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{item.role}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>{item.date}</p>
                  </div>
                  {/* Score */}
                  <div className="text-sm font-bold shrink-0" style={{ color: scoreColor }}>
                    {item.score}%
                  </div>
                </Link>
              );
            })}
          </div>

          {completed.length === 0 && (
            <p className="text-xs text-center mt-3" style={{ color: '#374151' }}>
              Demo data • Start an interview to track real progress
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
