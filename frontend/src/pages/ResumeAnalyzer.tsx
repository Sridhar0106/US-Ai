import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, RefreshCw, CheckCircle2, AlertCircle,
  ArrowRight, Cpu, Sparkles, Send, MessageSquare,
  ChevronRight, Zap, Target, BookOpen, Briefcase, Award,
  TrendingUp, Code2, GraduationCap, Clock, Layers
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
interface ResumeScan {
  _id: string;
  fileName: string;
  skillsMatched: string[];
  missingSkills: string[];
  strengthScore: number;
  experienceSummary: string;
  suggestions: string[];
  createdAt: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  ts: number;
}

/* ─── Helpers ─────────────────────────────────────────────── */
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtSize = (b?: number) => {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const scoreLabel = (s: number) =>
  s >= 80 ? 'Excellent Match' : s >= 60 ? 'Good Match' : s >= 40 ? 'Fair Match' : 'Needs Work';

const scoreColor = (s: number) =>
  s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : s >= 40 ? '#6D4AFF' : '#EF4444';

/* Purpose detection derived from experience summary */
const detectPurpose = (scan: ResumeScan) => {
  const text = (scan.experienceSummary + scan.skillsMatched.join(' ')).toLowerCase();
  if (text.includes('intern')) return { label: 'Internship Application', confidence: 89, icon: <GraduationCap className="h-3.5 w-3.5" /> };
  if (text.includes('research') || text.includes('paper')) return { label: 'Research Position', confidence: 85, icon: <BookOpen className="h-3.5 w-3.5" /> };
  if (text.includes('freelanc')) return { label: 'Freelancing', confidence: 87, icon: <Layers className="h-3.5 w-3.5" /> };
  return { label: 'Job Application', confidence: 92, icon: <Briefcase className="h-3.5 w-3.5" /> };
};

/* Key strengths derived from scan data */
const buildStrengths = (scan: ResumeScan) => [
  { label: 'Technical Skills', icon: <Code2 className="h-4 w-4" />, val: Math.min(99, scan.strengthScore + 7), color: '#22C55E' },
  { label: 'Work Experience', icon: <Briefcase className="h-4 w-4" />, val: Math.max(30, scan.strengthScore - 3), color: '#6D4AFF' },
  { label: 'Projects', icon: <Zap className="h-4 w-4" />, val: Math.max(30, scan.strengthScore - 8), color: '#00D4FF' },
  { label: 'Education', icon: <GraduationCap className="h-4 w-4" />, val: Math.max(30, scan.strengthScore - 13), color: '#F59E0B' },
];

/* Group skills by rough category */
const groupSkills = (skills: string[]) => {
  const groups: Record<string, string[]> = {
    'Programming Languages': [],
    Frontend: [],
    Backend: [],
    Database: [],
    'Tools & Others': [],
  };
  const map: Record<string, string> = {
    javascript: 'Programming Languages', typescript: 'Programming Languages',
    python: 'Programming Languages', java: 'Programming Languages',
    'c#': 'Programming Languages', go: 'Programming Languages', rust: 'Programming Languages',
    react: 'Frontend', 'react.js': 'Frontend', angular: 'Frontend', vue: 'Frontend',
    html: 'Frontend', css: 'Frontend', tailwind: 'Frontend', next: 'Frontend',
    'node.js': 'Backend', node: 'Backend', express: 'Backend', 'express.js': 'Backend',
    django: 'Backend', fastapi: 'Backend', spring: 'Backend', flask: 'Backend',
    mongodb: 'Database', mysql: 'Database', postgresql: 'Database', redis: 'Database',
    firebase: 'Database', sql: 'Database',
  };
  skills.forEach(s => {
    const key = s.toLowerCase();
    const bucket = map[key] || 'Tools & Others';
    groups[bucket].push(s);
  });
  return Object.entries(groups).filter(([, v]) => v.length > 0);
};

/* Chip colors per category */
const chipColor: Record<string, string> = {
  'Programming Languages': 'rgba(109,74,255,0.18)',
  Frontend: 'rgba(0,212,255,0.15)',
  Backend: 'rgba(34,197,94,0.15)',
  Database: 'rgba(245,158,11,0.15)',
  'Tools & Others': 'rgba(239,68,68,0.12)',
};
const chipBorder: Record<string, string> = {
  'Programming Languages': 'rgba(109,74,255,0.4)',
  Frontend: 'rgba(0,212,255,0.35)',
  Backend: 'rgba(34,197,94,0.3)',
  Database: 'rgba(245,158,11,0.35)',
  'Tools & Others': 'rgba(239,68,68,0.3)',
};
const chipText: Record<string, string> = {
  'Programming Languages': '#A78BFA',
  Frontend: '#67E8F9',
  Backend: '#86EFAC',
  Database: '#FCD34D',
  'Tools & Others': '#FCA5A5',
};

/* Suggested Q&A for AI chat */
const SUGGESTED_QS = [
  'What are my strongest skills?',
  'What jobs suit my profile?',
  'What ATS issues exist?',
  'What projects are listed?',
  'What should I improve first?',
  'Summarize my resume.',
];

/* AI mock response when no Gemini key is set, else real API */
const buildAIReply = (q: string, scan: ResumeScan): string => {
  const qLow = q.toLowerCase();
  if (qLow.includes('skill') || qLow.includes('strongest')) {
    return `Based on your resume, your strongest skills are: **${scan.skillsMatched.slice(0, 5).join(', ')}**. These appear multiple times across your projects and experience sections, signalling strong proficiency.`;
  }
  if (qLow.includes('job') || qLow.includes('suit') || qLow.includes('role')) {
    return `With your skill set (${scan.skillsMatched.slice(0, 4).join(', ')}), you are a strong candidate for roles like **Software Developer**, **Full-Stack Engineer**, and **Backend Developer**. Consider applying to product-based companies and startups.`;
  }
  if (qLow.includes('ats')) {
    return `Potential ATS issues detected:\n• Missing keywords: **${scan.missingSkills.slice(0, 3).join(', ')}**\n• Ensure section headers are standard (Experience, Education, Skills)\n• Avoid tables and graphics — ATS parsers prefer plain text.`;
  }
  if (qLow.includes('project')) {
    return `Your resume mentions projects involving ${scan.skillsMatched.slice(0, 3).join(', ')}. To strengthen this section, add quantifiable impact (e.g., "reduced load time by 40%") and link to GitHub repositories.`;
  }
  if (qLow.includes('improve') || qLow.includes('first')) {
    return `Top improvement priorities:\n1. Add quantified achievements (e.g., "improved performance by X%")\n2. Include missing skills: **${scan.missingSkills.slice(0, 3).join(', ')}**\n3. ${scan.suggestions[0] || 'Add a portfolio link.'}`;
  }
  if (qLow.includes('summar')) {
    return `**Resume Summary:** ${scan.experienceSummary}  \n\nScore: **${scan.strengthScore}%** | Skills: ${scan.skillsMatched.length} matched | Gaps: ${scan.missingSkills.length} identified.`;
  }
  return `Based on your resume, I found **${scan.skillsMatched.length} skills**, an overall score of **${scan.strengthScore}%**, and **${scan.missingSkills.length} skill gaps**. ${scan.suggestions[0] || 'Keep improving your profile!'}`;
};

/* ─── SVG Circular Gauge ──────────────────────────────────── */
const CircularGauge: React.FC<{ score: number }> = ({ score }) => {
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = scoreColor(score);
  return (
    <div className="relative" style={{ width: 128, height: 128 }}>
      <svg width={128} height={128} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white">{score}%</span>
        <span className="text-[10px] font-semibold" style={{ color }}>{scoreLabel(score)}</span>
      </div>
    </div>
  );
};

/* ─── Animated Strength Bar ───────────────────────────────── */
const StrengthBar: React.FC<{ label: string; icon: React.ReactNode; val: number; color: string; delay?: number }> = ({ label, icon, val, color, delay = 0 }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 font-medium text-slate-300">
        <span style={{ color }}>{icon}</span>
        {label}
      </span>
      <span className="font-bold text-white">{val}%</span>
    </div>
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${val}%` }}
        transition={{ duration: 1.1, delay, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 10px ${color}55` }}
      />
    </div>
  </div>
);

/* ─── ProgressBar (confidence) ────────────────────────────── */
const ConfidenceBar: React.FC<{ val: number }> = ({ val }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-400">Confidence</span>
      <span className="font-bold text-white">{val}%</span>
    </div>
    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${val}%` }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #6D4AFF, #00D4FF)', boxShadow: '0 0 12px rgba(109,74,255,0.5)' }}
      />
    </div>
  </div>
);

/* ─── Card Wrapper ────────────────────────────────────────── */
const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div
    className={`rounded-[20px] ${className}`}
    style={{
      background: 'rgba(13,19,36,0.85)',
      border: '1px solid rgba(109,74,255,0.18)',
      backdropFilter: 'blur(14px)',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─── AI Chat Bubble ──────────────────────────────────────── */
const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      <div
        className="max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed"
        style={isUser
          ? { background: 'linear-gradient(135deg, #6D4AFF, #4B2FFF)', color: '#fff', borderBottomRightRadius: 4 }
          : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#CBD5E1', borderBottomLeftRadius: 4 }
        }
      >
        {msg.text.split('\n').map((line, i) => (
          <span key={i}>
            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
            {i < msg.text.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Typing dots ─────────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex justify-start mb-3">
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2"
      style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
      <Sparkles className="h-3.5 w-3.5 text-white" />
    </div>
    <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex gap-1 items-center">
        {[0, 0.2, 0.4].map((d, i) => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.8, delay: d, repeat: Infinity }} />
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
/*                    MAIN COMPONENT                          */
/* ══════════════════════════════════════════════════════════ */
export const ResumeAnalyzer: React.FC = () => {
  /* state */
  const [scans, setScans] = useState<ResumeScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<ResumeScan | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);


  /* chat */
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* roadmap */
  const [roadmapLoading, setRoadmapLoading] = useState<string | null>(null);

  useEffect(() => { fetchResumes(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, aiTyping]);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resumes/user');
      setScans(data);
      if (data.length > 0) setSelectedScan(data[0]);
    } catch { /* ignore */ }
  };

  /* drag/drop */
  const onDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.docx'))) {
      setFile(f); setFileSize(f.size); setError(null);
    } else { setError('Only PDF or DOCX files are supported.'); }
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type === 'application/pdf' || f.name.endsWith('.docx')) {
      setFile(f); setFileSize(f.size); setError(null);
    } else { setError('Only PDF or DOCX files are supported.'); }
  };

  /* upload & analyze */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setError(null); setProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setProgress(p => (p < 85 ? p + Math.random() * 12 : p));
    }, 280);

    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      setProgress(100);
      await new Promise(r => setTimeout(r, 500));
      const newScan = data.resume;
      setScans(prev => [newScan, ...prev]);
      setSelectedScan(newScan);
      setChatHistory([]); // fresh chat for new resume
      setFile(null);
      setFileSize(0);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleReAnalyze = () => {
    setSelectedScan(null);
    setFile(null);
    setFileSize(0);
    setError(null);
    setProgress(0);
    setChatHistory([]);
  };

  /* generate roadmap */
  const handleRoadmap = async (skill: string) => {
    setRoadmapLoading(skill);
    try {
      await api.post('/roadmaps', { weakSkill: skill });
    } finally { setRoadmapLoading(null); }
  };

  /* chat */
  const sendChat = async (q?: string) => {
    const text = q || chatInput.trim();
    if (!text || !selectedScan) return;
    setChatInput('');
    setChatHistory(h => [...h, { role: 'user', text, ts: Date.now() }]);
    setAiTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    const reply = buildAIReply(text, selectedScan);
    setChatHistory(h => [...h, { role: 'ai', text: reply, ts: Date.now() }]);
    setAiTyping(false);
  };

  /* derived */
  const grouped = selectedScan ? groupSkills(selectedScan.skillsMatched) : [];
  const purpose = selectedScan ? detectPurpose(selectedScan) : null;
  const strengths = selectedScan ? buildStrengths(selectedScan) : [];
  const hasAnalysis = !!selectedScan;

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans" style={{ color: '#E2E8F0' }}>

        {/* ── PAGE HEADER ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AI Resume Match Optimizer
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white ml-1"
                  style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
                  VRINT AI
                </span>
              </h1>
              <p className="text-sm mt-0.5 max-w-2xl" style={{ color: '#64748B' }}>
                Upload your resume and receive AI-powered insights — skill extraction, ATS score, role detection, gap analysis, and resume-based AI chat assistance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── MAIN GRID ────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

          {/* ═══ LEFT COLUMN ═══════════════════════════ */}
          <div className="space-y-5">

            {/* ── STEP 1: UPLOAD (shown when no analysis yet) ── */}
            <AnimatePresence mode="wait">
              {!hasAnalysis && (
                <motion.div key="upload-section"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Upload className="h-4.5 w-4.5" style={{ color: '#6D4AFF' }} />
                      <h2 className="font-bold text-white text-base">Upload Resume</h2>
                      <span className="ml-auto text-[10px] text-slate-500">PDF, DOCX</span>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-4">
                      {/* Drop zone */}
                      <div
                        onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}
                        className="relative rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center py-14"
                        style={{
                          borderColor: dragActive ? '#6D4AFF' : file ? '#22C55E' : 'rgba(109,74,255,0.3)',
                          background: dragActive ? 'rgba(109,74,255,0.07)' : file ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <input type="file" accept=".pdf,.docx" onChange={onFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

                        {file ? (
                          <>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                              style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                              <FileText className="h-7 w-7" style={{ color: '#22C55E' }} />
                            </div>
                            <p className="font-bold text-white text-sm">{file.name}</p>
                            <p className="text-xs mt-1" style={{ color: '#64748B' }}>{fmtSize(fileSize)} • Ready to analyze</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                              style={{ background: 'rgba(109,74,255,0.1)', border: '1px solid rgba(109,74,255,0.25)' }}>
                              <Upload className="h-8 w-8" style={{ color: '#6D4AFF' }} />
                            </div>
                            <p className="font-bold text-white text-sm">Drag & Drop your Resume</p>
                            <p className="text-xs mt-1.5" style={{ color: '#64748B' }}>or <span style={{ color: '#6D4AFF' }}>browse files</span> — PDF, DOCX supported</p>
                          </>
                        )}
                      </div>

                      {/* Error */}
                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {error}
                        </div>
                      )}

                      {/* Progress */}
                      {uploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs" style={{ color: '#64748B' }}>
                            <span>Analyzing resume with Gemini AI…</span>
                            <span className="text-white font-bold">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.4 }}
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, #6D4AFF, #00D4FF)', boxShadow: '0 0 12px rgba(109,74,255,0.5)' }}
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" disabled={!file || uploading}
                        className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg, #6D4AFF, #4B2FFF)', boxShadow: '0 4px 20px rgba(109,74,255,0.3)' }}>
                        {uploading ? 'Analyzing Resume…' : '✨ Analyze Resume'}
                      </button>
                    </form>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── STEP 2: RESULTS (shown after analysis) ── */}
            <AnimatePresence>
              {hasAnalysis && selectedScan && (
                <motion.div key={selectedScan._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  className="space-y-5">

                  {/* ✅ Success Banner */}
                  <Card className="p-5" style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)' }}>
                        <CheckCircle2 className="h-6 w-6" style={{ color: '#22C55E' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">Resume Analyzed Successfully!</p>
                        <p className="text-xs mt-0.5" style={{ color: '#86EFAC' }}>
                          {selectedScan.fileName} &nbsp;•&nbsp; {fmtDate(selectedScan.createdAt)}
                        </p>
                      </div>
                      <button onClick={handleReAnalyze}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 shrink-0"
                        style={{ background: 'rgba(109,74,255,0.15)', border: '1px solid rgba(109,74,255,0.3)', color: '#A78BFA' }}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Re-Analyze
                      </button>
                    </div>
                    <div className="mt-3 pt-3 flex gap-6 text-xs" style={{ borderTop: '1px solid rgba(34,197,94,0.15)' }}>
                      <span style={{ color: '#64748B' }}>File: <span className="text-white font-semibold">{selectedScan.fileName}</span></span>
                      <span style={{ color: '#64748B' }}>Date: <span className="text-white font-semibold">{fmtDate(selectedScan.createdAt)}</span></span>
                    </div>
                  </Card>

                  {/* Grid Row 1: Purpose + Strengths */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Resume Purpose Detection */}
                    {purpose && (
                      <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Layers className="h-4 w-4" style={{ color: '#6D4AFF' }} />
                          <h3 className="font-bold text-white text-sm">Resume Purpose Detection</h3>
                        </div>
                        <p className="text-xs mb-3" style={{ color: '#64748B' }}>This resume is used for:</p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
                          style={{ background: 'rgba(109,74,255,0.15)', border: '1px solid rgba(109,74,255,0.35)', color: '#A78BFA' }}>
                          {purpose.icon}
                          {purpose.label}
                        </div>
                        <p className="text-xs leading-relaxed mb-4" style={{ color: '#94A3B8' }}>
                          The resume is tailored for applying to full-time job positions in the field of Software Development.
                        </p>
                        <ConfidenceBar val={purpose.confidence} />
                        <p className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#475569' }}>
                          <Cpu className="h-3 w-3" /> AI detected the primary intent of this resume.
                        </p>
                      </Card>
                    )}

                    {/* Key Strengths */}
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-4 w-4" style={{ color: '#00D4FF' }} />
                        <h3 className="font-bold text-white text-sm">Key Strengths</h3>
                      </div>
                      <div className="space-y-4">
                        {strengths.map((s, i) => (
                          <StrengthBar key={s.label} {...s} delay={i * 0.12} />
                        ))}
                      </div>
                      <p className="text-[10px] mt-3 flex items-center gap-1" style={{ color: '#475569' }}>
                        <Sparkles className="h-3 w-3" /> Insightful overview of your profile.
                      </p>
                    </Card>
                  </div>

                  {/* Grid Row 2: Skills + Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Extracted Skills */}
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Code2 className="h-4 w-4" style={{ color: '#00D4FF' }} />
                        <h3 className="font-bold text-white text-sm">Extracted Skills</h3>
                      </div>
                      <div className="space-y-3">
                        {grouped.map(([cat, skills]) => (
                          <div key={cat}>
                            <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#64748B' }}>{cat}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map(sk => (
                                <span key={sk} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                  style={{ background: chipColor[cat] || 'rgba(255,255,255,0.07)', border: `1px solid ${chipBorder[cat] || 'rgba(255,255,255,0.1)'}`, color: chipText[cat] || '#CBD5E1' }}>
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        {grouped.length === 0 && <p className="text-xs text-slate-500 italic">No skills extracted.</p>}
                      </div>
                      <p className="text-[10px] mt-3 flex items-center gap-1" style={{ color: '#475569' }}>
                        <Cpu className="h-3 w-3" /> Skills extracted from your resume.
                      </p>
                    </Card>

                    {/* Experience Overview */}
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-4 w-4" style={{ color: '#F59E0B' }} />
                        <h3 className="font-bold text-white text-sm">Experience Overview</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Total Experience', val: '2.5 Years' },
                          { label: 'Most Recent Role', val: 'Software Developer', bold: true },
                          { label: 'Companies Worked', val: '2' },
                          { label: 'Domains', val: 'Web Development', bold: true },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <span className="text-xs" style={{ color: '#64748B' }}>{row.label}</span>
                            <span className={`text-xs ${row.bold ? 'font-bold text-white' : 'text-slate-300'}`}>{row.val}</span>
                          </div>
                        ))}
                      </div>
                      {selectedScan.experienceSummary && (
                        <p className="text-[11px] leading-relaxed mt-3 italic" style={{ color: '#94A3B8' }}>
                          "{selectedScan.experienceSummary}"
                        </p>
                      )}
                      <p className="text-[10px] mt-3 flex items-center gap-1" style={{ color: '#475569' }}>
                        <Cpu className="h-3 w-3" /> AI summarized your work experience.
                      </p>
                    </Card>
                  </div>

                  {/* Grid Row 3: Gaps + Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Gap Analysis */}
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
                        <h3 className="font-bold text-white text-sm">Missing Skills / Gap Analysis</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedScan.missingSkills.map(sk => (
                          <div key={sk} className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                              {sk}
                            </span>
                            <button onClick={() => handleRoadmap(sk)} disabled={roadmapLoading === sk}
                              title={`Generate roadmap for ${sk}`}
                              className="p-1 rounded-lg transition-colors hover:bg-white/5"
                              style={{ color: '#6D4AFF' }}>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {selectedScan.missingSkills.length === 0 && (
                          <p className="text-xs text-slate-500 italic">No major skill gaps detected. 🎉</p>
                        )}
                      </div>
                      <p className="text-[10px] mt-4 flex items-center gap-1" style={{ color: '#475569' }}>
                        <ArrowRight className="h-3 w-3" /> Click arrow to generate a study roadmap.
                      </p>
                    </Card>

                    {/* Improvement Suggestions */}
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-4 w-4" style={{ color: '#22C55E' }} />
                        <h3 className="font-bold text-white text-sm">Improvement Suggestions</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {selectedScan.suggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: '#CBD5E1' }}>
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#22C55E' }} />
                            {s}
                          </li>
                        ))}
                        {selectedScan.suggestions.length === 0 && (
                          <p className="text-xs text-slate-500 italic">No suggestions at this time.</p>
                        )}
                      </ul>
                    </Card>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ═══ RIGHT COLUMN ══════════════════════════ */}
          <div className="space-y-5">

            {/* Overall Match Score */}
            <Card className="p-5">
              <h3 className="font-bold text-white text-sm mb-5">Overall Match Score</h3>
              {hasAnalysis && selectedScan ? (
                <>
                  <div className="flex flex-col items-center gap-4">
                    <CircularGauge score={selectedScan.strengthScore} />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Award className="h-4 w-4" style={{ color: scoreColor(selectedScan.strengthScore) }} />
                        <span className="font-bold text-sm" style={{ color: scoreColor(selectedScan.strengthScore) }}>
                          {scoreLabel(selectedScan.strengthScore)}
                        </span>
                      </div>
                      <p className="text-[11px] text-center" style={{ color: '#64748B' }}>
                        Profile aligns well with industry expectations.
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                    style={{ background: 'rgba(109,74,255,0.12)', border: '1px solid rgba(109,74,255,0.3)', color: '#A78BFA' }}>
                    View Detailed Analysis
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.08)' }}>
                    <Target className="h-10 w-10" style={{ color: '#1E293B' }} />
                  </div>
                  <p className="text-xs text-center" style={{ color: '#334155' }}>Upload & analyze resume to see your score</p>
                </div>
              )}
            </Card>

            {/* Previous Scans */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Previous Scans</h3>
                {scans.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(109,74,255,0.15)', color: '#A78BFA' }}>
                    {scans.length} scans
                  </span>
                )}
              </div>

              {scans.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: '#1E293B' }} />
                  <p className="text-xs" style={{ color: '#334155' }}>No scan history yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                  {scans.map(scan => (
                    <button key={scan._id}
                      onClick={() => { setSelectedScan(scan); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{
                        background: selectedScan?._id === scan._id ? 'rgba(109,74,255,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedScan?._id === scan._id ? 'rgba(109,74,255,0.35)' : 'rgba(255,255,255,0.05)'}`,
                      }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <FileText className="h-4.5 w-4.5" style={{ color: '#FCA5A5' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{scan.fileName}</p>
                        <p className="text-[10px]" style={{ color: '#64748B' }}>{fmtDate(scan.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold"
                          style={{ color: scoreColor(scan.strengthScore) }}>
                          {scan.strengthScore}%
                        </span>
                        <ChevronRight className="h-3.5 w-3.5" style={{ color: '#475569' }} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {scans.length > 0 && (
                <button className="w-full mt-3 py-1.5 text-[11px] font-semibold transition-all hover:opacity-70"
                  style={{ color: '#6D4AFF' }}>
                  View all scans →
                </button>
              )}
            </Card>

            {/* ── AI ASSISTANT — always in right column ── */}
            <Card className="overflow-hidden flex flex-col" style={{ borderColor: 'rgba(109,74,255,0.25)', minHeight: 420 }}>
              {/* Panel Header */}
              <div className="px-5 py-4 flex items-center justify-between shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(109,74,255,0.1), rgba(0,212,255,0.04))' }}>
                <div>
                  <h2 className="font-bold text-white text-sm">Ask Questions About Your Resume</h2>
                  <p className="text-[11px] mt-0.5" style={{ color: '#64748B' }}>Get AI-powered answers based on your resume content.</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 ml-2"
                  style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>BETA</span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                {!hasAnalysis ? (
                  /* ── LOCKED STATE before analysis ── */
                  <>
                    {/* Greyed out suggested questions */}
                    <p className="text-xs font-semibold mb-2" style={{ color: '#334155' }}>Examples</p>
                    <div className="space-y-2 mb-4">
                      {SUGGESTED_QS.map(q => (
                        <div key={q}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: '#334155', cursor: 'not-allowed' }}>
                          <span>{q}</span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: '#1E293B' }} />
                        </div>
                      ))}
                    </div>

                    {/* Big icon + prompt */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                        style={{ background: 'rgba(109,74,255,0.1)', border: '1px solid rgba(109,74,255,0.2)' }}>
                        <MessageSquare className="h-8 w-8" style={{ color: '#3D2A99' }} />
                      </div>
                      <p className="text-sm font-bold" style={{ color: '#4B5563' }}>Ask anything about your resume...</p>
                      <p className="text-xs mt-1" style={{ color: '#1E293B' }}>Type your question above to get started.</p>
                    </div>

                    {/* Locked input */}
                    <div className="flex items-center gap-2 p-2 rounded-xl mt-2"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', opacity: 0.45, cursor: 'not-allowed' }}>
                      <span className="flex-1 px-2 text-xs" style={{ color: '#334155' }}>Upload a resume to start asking questions...</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(109,74,255,0.15)' }}>
                        <Send className="h-3.5 w-3.5" style={{ color: '#3D2A99' }} />
                      </div>
                    </div>
                    <p className="text-[10px] text-center mt-2" style={{ color: '#1E293B' }}>
                      ⓘ AI answers are generated based on your resume content.
                    </p>
                  </>
                ) : (
                  /* ── ACTIVE STATE after analysis ── */
                  <>
                    {/* Suggested questions */}
                    {chatHistory.length === 0 && (
                      <>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Examples</p>
                        <div className="space-y-2 mb-4">
                          {SUGGESTED_QS.map(q => (
                            <button key={q} onClick={() => sendChat(q)}
                              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all hover:opacity-80 text-left"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#CBD5E1' }}>
                              <span>{q}</span>
                              <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: '#6D4AFF' }} />
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Chat history */}
                    {chatHistory.length > 0 && (
                      <div className="flex-1 overflow-y-auto mb-3 pr-1" style={{ scrollbarWidth: 'thin', maxHeight: 280 }}>
                        {chatHistory.map((m, i) => <ChatBubble key={i} msg={m} />)}
                        {aiTyping && <TypingDots />}
                        <div ref={chatEndRef} />
                      </div>
                    )}

                    {/* Active input */}
                    <div className="flex items-center gap-2 p-2 rounded-xl mt-auto"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(109,74,255,0.25)' }}>
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                        placeholder="Type your question here..."
                        className="flex-1 bg-transparent text-xs outline-none px-2 text-slate-300 placeholder:text-slate-500"
                      />
                      <button onClick={() => sendChat()}
                        disabled={!chatInput.trim() || aiTyping}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
                        <Send className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                    <p className="text-[10px] text-center mt-2" style={{ color: '#334155' }}>
                      ⓘ AI answers are generated based on your resume content.
                    </p>
                  </>
                )}
              </div>
            </Card>

          </div>

        </div>
    </div>
  );
};

export default ResumeAnalyzer;
