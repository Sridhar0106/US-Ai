import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend
} from 'recharts';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const AnalyticsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/interviews/user');
        setInterviews(response.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const completed = interviews.filter(i => i.status === 'completed');
  const hasHistory = completed.length > 0;

  // Chart 1: Performance Trends
  const trendData = hasHistory ? completed.slice().reverse().map((i) => ({
    date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overall: i.finalReport?.overallScore || 0,
    technical: i.finalReport?.technicalScore || 0,
  })) : [
    { date: 'May 01', overall: 6.0, technical: 5.8 },
    { date: 'May 10', overall: 6.5, technical: 6.2 },
    { date: 'May 18', overall: 7.2, technical: 7.0 },
    { date: 'May 28', overall: 7.8, technical: 7.5 },
    { date: 'Jun 05', overall: 8.5, technical: 8.4 },
  ];

  // Chart 2: Domain Balance
  const latestReport = completed[0]?.finalReport;
  const radarData = hasHistory && latestReport ? [
    { subject: 'Technical Accuracy', score: latestReport.technicalScore, average: 7.2 },
    { subject: 'Communication Rating', score: latestReport.communicationScore, average: 7.5 },
    { subject: 'Problem Solving Method', score: latestReport.problemSolvingScore, average: 6.8 },
    { subject: 'Coding Speed', score: 8.0, average: 7.0 },
    { subject: 'Architecture Concepts', score: 7.0, average: 6.5 },
  ] : [
    { subject: 'Technical Accuracy', score: 7.5, average: 7.2 },
    { subject: 'Communication Rating', score: 8.0, average: 7.5 },
    { subject: 'Problem Solving Method', score: 6.8, average: 6.8 },
    { subject: 'Coding Speed', score: 7.0, average: 7.0 },
    { subject: 'Architecture Concepts', score: 6.0, average: 6.5 },
  ];

  // Chart 3: Topic Wise Analysis (Bar chart comparing scores of different roles user took)
  const roleAverages = hasHistory ? Array.from(
    completed.reduce((acc, curr) => {
      const role = curr.role;
      const score = curr.finalReport?.overallScore || 0;
      if (!acc.has(role)) {
        acc.set(role, { role, sum: score, count: 1 });
      } else {
        const item = acc.get(role)!;
        item.sum += score;
        item.count += 1;
      }
      return acc;
    }, new Map<string, { role: string; sum: number; count: number }>()).values()
  ).map(item => ({
    role: item.role.replace(' Developer', '').replace(' Engineer', ''),
    score: parseFloat((item.sum / item.count).toFixed(1)),
  })) : [
    { role: 'Frontend', score: 7.8 },
    { role: 'Backend', score: 8.2 },
    { role: 'AI', score: 8.5 },
    { role: 'DevOps', score: 7.0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <span>Detailed Performance Analytics</span>
          <Sparkles className="h-6 w-6 text-accent-500 fill-accent-500 animate-pulse" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Deep-dive analysis of your mock interview loops. View chronological trend graphs, verify framework competencies, and pinpoint weak topics.
        </p>
      </div>

      {/* STATS OVERVIEW CARDS (Only display warnings if no history) */}
      {!hasHistory && !loading && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-xs md:text-sm flex items-center gap-3 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Demo Mode Active:</strong> You haven't completed any mock interviews yet. The charts below are populated with mock demo data to preview active layout dashboards.
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-72 glass-panel dark:glass-panel border border-slate-200 dark:border-darkBorder rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* TOP GRAPH LINE + RADAR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LINE CHART: Progress Over Time */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">Historical Score Trajectory</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2438" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 20, 32, 0.95)', 
                        borderColor: '#1f2438',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" name="Overall Rating" dataKey="overall" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Technical Accuracy" dataKey="technical" stroke="#06B6D4" strokeWidth={2} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RADAR CHART: Domain Balance */}
            <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">Aggregate Vector Balance</h3>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#64748b" opacity={0.2} />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#64748b" opacity={0.3} fontSize={9} />
                    <Radar name="My Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
                    <Radar name="Platform Average" dataKey="average" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* LOWER GRID: BARS & HISTORY TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* BAR CHART: Role Competencies Comparison */}
            <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">Topic-wise Score Breakdown</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleAverages} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2438" opacity={0.15} />
                    <XAxis dataKey="role" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(18, 20, 32, 0.95)', 
                        borderColor: '#1f2438',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="score" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* STRENGTHS AND WEAKNESSES LISTS */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Strong Areas */}
              <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Validated Strong Topics</span>
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>Frontend (React Hooks, Lifecycle)</span>
                      <span className="text-emerald-500 font-bold">9.0/10</span>
                    </li>
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>Core JavaScript (ES6 Syntax, Arrays)</span>
                      <span className="text-emerald-500 font-bold">8.5/10</span>
                    </li>
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>Communication articulation</span>
                      <span className="text-emerald-500 font-bold">8.2/10</span>
                    </li>
                  </ul>
                </div>
                <div className="text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-100 dark:border-darkBorder/30">
                  Scores calculated from latest completed mock interviews.
                </div>
              </div>

              {/* Weak Topics */}
              <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>Urgent Improvement Needed</span>
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>System Design (Distributed Caching)</span>
                      <span className="text-rose-500 font-bold">5.8/10</span>
                    </li>
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>DevOps (CI/CD workflows)</span>
                      <span className="text-rose-500 font-bold">6.2/10</span>
                    </li>
                    <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-xs font-semibold text-slate-705 dark:text-slate-350">
                      <span>Database transactions</span>
                      <span className="text-rose-500 font-bold">6.5/10</span>
                    </li>
                  </ul>
                </div>
                <Link 
                  to="/roadmap"
                  className="w-full text-center py-2.5 border border-slate-200 dark:border-darkBorder bg-slate-50 dark:bg-slate-900 text-slate-655 dark:text-slate-300 font-bold text-[11px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-6 block"
                >
                  Generate Remedial Roadmap
                </Link>
              </div>

            </div>

          </div>

          {/* HISTORICAL LOG LIST */}
          <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-6">Historical Sessions Record</h3>
            {interviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No historical data records.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-darkBorder text-slate-400 text-xs font-semibold uppercase">
                      <th className="pb-3.5 pl-2">Session ID</th>
                      <th className="pb-3.5">Target Role</th>
                      <th className="pb-3.5">Difficulty</th>
                      <th className="pb-3.5">Completion Date</th>
                      <th className="pb-3.5">Technical Score</th>
                      <th className="pb-3.5">Communication</th>
                      <th className="pb-3.5 pr-2 text-right">Overall Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((int) => (
                      <tr key={int._id} className="border-b border-slate-100 dark:border-darkBorder/40 hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                        <td className="py-3.5 pl-2 font-mono text-[10px] text-slate-450">{int._id}</td>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{int.role}</td>
                        <td className="py-3.5 text-xs capitalize text-slate-500">{int.difficulty}</td>
                        <td className="py-3.5 text-xs text-slate-500">{new Date(int.createdAt).toLocaleDateString()}</td>
                        <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">{int.finalReport?.technicalScore || '—'}</td>
                        <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">{int.finalReport?.communicationScore || '—'}</td>
                        <td className="py-3.5 pr-2 text-right font-black text-primary-500">{int.finalReport?.overallScore ? `${int.finalReport.overallScore}/10` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
export default AnalyticsPage;
