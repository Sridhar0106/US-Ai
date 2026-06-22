import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Clock, TrendingUp, Download, Share2, RefreshCw,
  CheckCircle2, Lock, PlayCircle, Circle, ChevronRight,
  BookOpen, Video, FileText, Code2, Award, Star,
  ExternalLink, Plus, StickyNote, BarChart3, Map,
  Zap, Trophy, ArrowRight, X, ChevronDown, Pencil,
  GraduationCap, Sparkles, Loader2, Search
} from 'lucide-react';
import {
  buildRoadmap,
  ROLE_CATEGORIES,
  ROLES,
  ytUrl
} from '../data/roadmapData';
import type {
  RoleCategory,
  RoleRoadmap,
  RoadmapStep,
  StepStatus,
  Difficulty
} from '../data/roadmapData';

/* ── Custom YouTube SVG Icon ── */
const YtIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);



/* ══════════════════════════════════════════════════════════ */
/*                     STATUS CONFIGS                         */
/* ══════════════════════════════════════════════════════════ */
const statusCfg: Record<StepStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  completed: { label: 'Completed', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  'in-progress': { label: 'In Progress', color: '#FBBF24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', icon: <PlayCircle className="h-3.5 w-3.5" /> },
  available: { label: 'Available', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.3)', icon: <Circle className="h-3.5 w-3.5" /> },
  locked: { label: 'Locked', color: '#475569', bg: 'rgba(71,85,105,0.12)', border: 'rgba(71,85,105,0.3)', icon: <Lock className="h-3.5 w-3.5" /> },
};

const difficultyColor: Record<Difficulty, string> = {
  Beginner: '#22C55E', Intermediate: '#00D4FF', Advanced: '#FBBF24', Expert: '#EF4444'
};

const resourceCfg: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  youtube: { icon: <YtIcon size={13} />, color: '#FF4444', label: 'YouTube' },
  course: { icon: <GraduationCap className="h-3.5 w-3.5" />, color: '#FBBF24', label: 'Course' },
  docs: { icon: <FileText className="h-3.5 w-3.5" />, color: '#60A5FA', label: 'Docs' },
  practice: { icon: <Code2 className="h-3.5 w-3.5" />, color: '#A78BFA', label: 'Practice' },
  project: { icon: <Star className="h-3.5 w-3.5" />, color: '#F97316', label: 'Project' },
  article: { icon: <BookOpen className="h-3.5 w-3.5" />, color: '#22D3EE', label: 'Article' },
};

/* ══════════════════════════════════════════════════════════ */
/*                   DETAIL PANEL COMPONENT                    */
/* ══════════════════════════════════════════════════════════ */
const DetailPanel: React.FC<{ step: RoadmapStep; onClose: () => void; onComplete: () => void }> = ({ step, onClose, onComplete }) => {
  const [note, setNote] = useState('');
  const cfg = statusCfg[step.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-[420px] z-50 overflow-y-auto"
      style={{
        background: 'rgba(8,10,20,0.97)',
        borderLeft: `1px solid ${step.color}30`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${step.color}15, rgba(8,10,20,0.98))`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: `${step.color}25`, border: `1px solid ${step.color}50`, color: step.color, fontSize: step.icon.length <= 2 ? '12px' : '18px' }}>
            {step.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>Step {String(step.id).padStart(2, '0')}</p>
            <h3 className="font-black text-sm text-white">{step.title}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <X className="h-4 w-4" style={{ color: '#64748B' }} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Status + Difficulty */}
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
            {cfg.icon}{cfg.label}
          </span>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: difficultyColor[step.difficulty] }}>
            {step.difficulty}
          </span>
          <span className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748B' }}>
            <Clock className="h-3 w-3" />{step.duration}
          </span>
        </div>

        {/* Topics */}
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-bold text-white mb-3">Topics Covered</p>
          <div className="flex flex-wrap gap-2">
            {step.topics.map(t => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${step.color}15`, border: `1px solid ${step.color}30`, color: step.color }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* AI Tip */}
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(109,74,255,0.08)', border: '1px solid rgba(109,74,255,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5" style={{ color: '#A78BFA' }} />
            <p className="text-xs font-bold" style={{ color: '#A78BFA' }}>AI Insight</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{step.aiTip}</p>
        </div>

        {/* Resources */}
        <div>
          <p className="text-xs font-bold text-white mb-3">Learning Resources</p>
          <div className="space-y-2">
            {step.resources.map((res, i) => {
              const rc = resourceCfg[res.type] || resourceCfg.article;
              return (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${rc.color}15`, color: rc.color }}>
                    {rc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{res.title}</p>
                    <p className="text-[10px]" style={{ color: '#475569' }}>{rc.label}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: '#334155' }} />
                </a>
              );
            })}
            {/* YouTube auto search */}
            <a href={ytUrl(step.title)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,68,68,0.15)', color: '#FF4444' }}>
                <YtIcon size={13} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Watch {step.title} on YouTube</p>
                <p className="text-[10px]" style={{ color: '#475569' }}>Free video courses</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: '#334155' }} />
            </a>
          </div>
        </div>

        {/* Interview Questions */}
        <div>
          <p className="text-xs font-bold text-white mb-3">Common Interview Questions</p>
          <div className="space-y-2">
            {step.interviewQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                  style={{ background: `${step.color}20`, color: step.color }}>{i + 1}</span>
                <p className="text-xs" style={{ color: '#CBD5E1' }}>{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs font-bold text-white mb-2">Add Notes</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Write your notes here..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl resize-none outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#CBD5E1',
            }}
          />
        </div>

        {/* Actions */}
        <div className="space-y-2 pb-4">
          {(step.status === 'available' || step.status === 'in-progress') && (
            <button onClick={onComplete}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-85"
              style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, boxShadow: `0 4px 16px ${step.color}40` }}>
              ✓ Mark as Complete
            </button>
          )}
          <button className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
            Save Notes
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export const RoadmapPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [roadmap, setRoadmap] = useState<RoleRoadmap>(() => buildRoadmap('Full Stack Developer'));
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null);
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState(roadmap.steps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Core Track');

  // Drag-to-scroll & mouse wheel scroll states and handlers for Category row
  const categoriesRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const el = categoriesRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;
    startXRef.current = e.pageX - e.currentTarget.offsetLeft;
    scrollLeftRef.current = e.currentTarget.scrollLeft;
    hasMovedRef.current = false;
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = false;
    e.currentTarget.style.cursor = 'grab';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = false;
    e.currentTarget.style.cursor = 'grab';
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    e.currentTarget.scrollLeft = scrollLeftRef.current - walk;
    
    if (Math.abs(x - startXRef.current) > 5) {
      hasMovedRef.current = true;
    }
  };

  const handleGenerate = async (role: string) => {
    setGenerating(true);
    setSelectedStep(null);
    await new Promise(r => setTimeout(r, 1400));
    const rm = buildRoadmap(role);
    setRoadmap(rm);
    setSteps(rm.steps);
    setSelectedRole(role);
    setGenerating(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleGenerate('Full Stack Developer');
  };

  const handleMarkComplete = (stepId: number) => {
    setSteps(prev => prev.map((s, i) => {
      if (s.id === stepId) return { ...s, status: 'completed' as StepStatus, progress: 100 };
      // Unlock next step
      if (prev[i - 1]?.id === stepId && s.status === 'locked') return { ...s, status: 'available' as StepStatus };
      return s;
    }));
    setSelectedStep(null);
  };

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const overallProgress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="font-sans min-h-screen" style={{ color: '#E2E8F0' }}>

      {/* ── GENERATING OVERLAY ── */}
      <AnimatePresence>
        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,8,22,0.95)', backdropFilter: 'blur(16px)' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full mb-6"
              style={{ border: '3px solid transparent', borderTopColor: '#6D4AFF', borderRightColor: '#00D4FF' }}
            />
            <p className="text-lg font-bold text-white mb-2">Generating Your Roadmap</p>
            <p className="text-sm" style={{ color: '#475569' }}>AI is analyzing your skills and building a personalized plan…</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 max-w-[1400px] mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)' }}>
                <Map className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Personalized Career Roadmap</h1>
                <p className="text-sm mt-0.5 max-w-xl" style={{ color: '#64748B' }}>
                  AI-generated learning journey tailored to your current skills, missing concepts, interview performance, and career goals.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button
                onClick={() => handleGenerate(selectedRole)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-85"
                style={{ background: 'linear-gradient(135deg, #6D4AFF, #4B2FFF)', boxShadow: '0 4px 16px rgba(109,74,255,0.35)' }}>
                <RefreshCw className="h-4 w-4" /> Generate New Roadmap
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── ROLE SELECTOR & SEARCH BAR ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6 p-6 rounded-[22px] flex flex-col gap-4"
          style={{ background: 'rgba(13,19,36,0.85)', border: '1px solid rgba(109,74,255,0.18)', backdropFilter: 'blur(10px)' }}>
          
          {/* Custom Search Bar Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchQuery.trim() && handleGenerate(searchQuery.trim())}
                placeholder="Search or type a custom role / study concept (e.g. React Native Developer, System Design...)"
                className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white outline-none transition-all placeholder:text-slate-500"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(109,74,255,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                </button>
              )}
            </div>
            <button
              onClick={() => searchQuery.trim() && handleGenerate(searchQuery.trim())}
              disabled={!searchQuery.trim()}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #6D4AFF, #4B2FFF)',
                boxShadow: searchQuery.trim() ? '0 4px 16px rgba(109,74,255,0.3)' : 'none',
              }}
            >
              Generate Custom Plan
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories:</span>
            <div 
              ref={categoriesRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none"
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              <button
                onClick={(e) => {
                  if (hasMovedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  setActiveCategory('All');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0"
                style={{
                  background: activeCategory === 'All'
                    ? 'linear-gradient(135deg, #6D4AFF, #00D4FF)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeCategory === 'All' ? 'transparent' : 'rgba(255,255,255,0.05)'}`,
                  color: activeCategory === 'All' ? '#FFF' : '#94A3B8',
                  boxShadow: activeCategory === 'All' ? '0 4px 12px rgba(109,74,255,0.25)' : 'none',
                }}
              >
                🔍 All Categories
              </button>
              {ROLE_CATEGORIES.map(cat => (
                <button
                  key={cat.category}
                  onClick={(e) => {
                    if (hasMovedRef.current) {
                      e.preventDefault();
                      return;
                    }
                    setActiveCategory(cat.category);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0"
                  style={{
                    background: activeCategory === cat.category
                      ? 'linear-gradient(135deg, #6D4AFF, #00D4FF)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeCategory === cat.category ? 'transparent' : 'rgba(255,255,255,0.05)'}`,
                    color: activeCategory === cat.category ? '#FFF' : '#94A3B8',
                    boxShadow: activeCategory === cat.category ? '0 4px 12px rgba(109,74,255,0.25)' : 'none',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid of Role Cards */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select a Role to View Journey:
              </span>
              {searchQuery && (
                <span className="text-[10px] text-slate-500">
                  Filtered by: "{searchQuery}"
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {(() => {
                const filteredRoles = ROLE_CATEGORIES.flatMap(cat => {
                  if (activeCategory !== 'All' && cat.category !== activeCategory) {
                    return [];
                  }
                  return cat.roles.map(role => ({ role, category: cat.category, catIcon: cat.icon }));
                }).filter(item =>
                  item.role.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filteredRoles.length === 0) {
                  return (
                    <div className="col-span-full py-6 text-center text-slate-500 text-xs">
                      No roles match "{searchQuery}" in this category. Click "Generate Custom Plan" to create a custom plan.
                    </div>
                  );
                }

                return filteredRoles.map(item => {
                  const isSelected = selectedRole === item.role;
                  return (
                    <motion.div
                      key={item.role}
                      whileHover={{ y: -2, scale: 1.02 }}
                      onClick={() => handleGenerate(item.role)}
                      className="p-3 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between group"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(109,74,255,0.25), rgba(0,212,255,0.12))'
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(109,74,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isSelected ? '0 0 16px rgba(109,74,255,0.2)' : 'none',
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm shrink-0">{item.catIcon}</span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-[11px] text-white leading-tight break-words group-hover:text-[#00D4FF] transition-colors">
                            {item.role}
                          </h4>
                          <p className="text-[8px] text-slate-500 mt-1 uppercase tracking-wider truncate">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex justify-end mt-1.5">
                          <span className="text-[9px] font-bold text-[#00D4FF] flex items-center gap-0.5">
                            Active <Sparkles className="h-2 w-2 animate-pulse" />
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>

        </motion.div>

        {/* ── OVERVIEW CARD ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-8 p-6 rounded-[20px]"
          style={{ background: 'linear-gradient(135deg, rgba(109,74,255,0.12), rgba(0,212,255,0.06), rgba(13,19,36,0.95))', border: '1px solid rgba(109,74,255,0.25)' }}>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Role title */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(109,74,255,0.3), rgba(0,212,255,0.2))', border: '1px solid rgba(109,74,255,0.4)' }}>
                <Target className="h-7 w-7" style={{ color: '#A78BFA' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6D4AFF' }}>Target Role</p>
                <h2 className="text-xl font-black text-white">{roadmap.role}</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{roadmap.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              {[
                { label: 'Duration', value: roadmap.duration, icon: <Clock className="h-4 w-4" />, color: '#00D4FF' },
                { label: 'Completion', value: `${overallProgress}%`, icon: <BarChart3 className="h-4 w-4" />, color: '#6D4AFF' },
                { label: 'Level', value: roadmap.level, icon: <TrendingUp className="h-4 w-4" />, color: '#FBBF24' },
                { label: 'Job Ready', value: `${roadmap.jobReadyScore}%`, icon: <Trophy className="h-4 w-4" />, color: '#22C55E' },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
                  <p className="font-black text-sm text-white">{stat.value}</p>
                  <p className="text-[10px]" style={{ color: '#475569' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: '#64748B' }}>Overall Progress — {completedCount}/{steps.length} steps completed</span>
              <span className="font-bold text-white">{overallProgress}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6D4AFF, #00D4FF)', boxShadow: '0 0 14px rgba(109,74,255,0.5)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════ */}
        {/*              WINDING ROADMAP PATH                */}
        {/* ════════════════════════════════════════════════ */}
        <div className="relative mb-10">
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes roadmapDash {
              to {
                stroke-dashoffset: -1000;
              }
            }
            .roadmap-dash-animate {
              animation: roadmapDash 35s linear infinite;
            }
          `}} />

          {/* Start Here badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
            <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: 'linear-gradient(135deg, #6D4AFF, #00D4FF)', boxShadow: '0 0 24px rgba(109,74,255,0.5)' }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm">🚀 Start Here</p>
              <p className="text-[11px]" style={{ color: '#475569' }}>Your AI-personalized learning journey begins</p>
            </div>
          </motion.div>

          {/* DESKTOP WINDING ROAD (lg and up) */}
          <div className="hidden lg:block relative w-full h-[850px] mb-12">
            
            {/* SVG Background Path */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6D4AFF" />
                  <stop offset="50%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#6D4AFF" />
                </linearGradient>
                <filter id="roadGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Outer shadow base road */}
              <path
                d="M 220 100 L 500 100 L 780 100 C 950 100 950 300 780 300 L 500 300 L 220 300 C 50 300 50 500 220 500 L 500 500 L 780 500 C 950 500 950 700 780 700 L 500 700 L 220 700"
                fill="none"
                stroke="#1e293b"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              {/* Main glowing road track */}
              <path
                d="M 220 100 L 500 100 L 780 100 C 950 100 950 300 780 300 L 500 300 L 220 300 C 50 300 50 500 220 500 L 500 500 L 780 500 C 950 500 950 700 780 700 L 500 700 L 220 700"
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#roadGlow)"
                opacity="0.8"
              />
              {/* Animated dash flow */}
              <path
                d="M 220 100 L 500 100 L 780 100 C 950 100 950 300 780 300 L 500 300 L 220 300 C 50 300 50 500 220 500 L 500 500 L 780 500 C 950 500 950 700 780 700 L 500 700 L 220 700"
                fill="none"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="roadmap-dash-animate"
                opacity="0.7"
              />
            </svg>

            {/* Grid Container for Nodes — dynamic per role's step count */}
            {(() => {
              // Build cells: chunk steps into rows of 3, alternate direction per row, add trophy at end
              const COLS = 3;
              const cells: Array<{ type: 'step'; step: RoadmapStep } | { type: 'trophy' } | { type: 'empty' }> = [];
              
              for (let rowStart = 0; rowStart < steps.length; rowStart += COLS) {
                const rowSteps = steps.slice(rowStart, rowStart + COLS);
                const rowIndex = Math.floor(rowStart / COLS);
                const isReversed = rowIndex % 2 === 1; // odd rows go R→L
                
                const padded = [...rowSteps];
                while (padded.length < COLS) padded.push(undefined as unknown as RoadmapStep);
                
                if (isReversed) padded.reverse();
                
                padded.forEach(s => cells.push(s ? { type: 'step', step: s } : { type: 'empty' }));
              }
              
              // Add trophy row (left cell, rest empty)
              cells.push({ type: 'trophy' });
              cells.push({ type: 'empty' });
              cells.push({ type: 'empty' });
              
              const totalRows = Math.ceil(cells.length / COLS);

              return (
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ display: 'grid', gridTemplateColumns: '44% 12% 44%', gridTemplateRows: `repeat(${totalRows}, 1fr)` }}
                >
                  {cells.map((cell, idx) => {
                    if (cell.type === 'empty') {
                      return <div key={`empty-${idx}`} className="w-full h-full" />;
                    }

                    if (cell.type === 'trophy') {
                      return (
                        <div key="desktop-trophy" className="flex flex-col items-center justify-center p-4">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all relative z-10"
                            style={{
                              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                              border: '3px solid #FFF',
                              boxShadow: '0 0 30px rgba(255,215,0,0.6)',
                            }}
                          >
                            <Trophy className="h-8 w-8 text-white animate-pulse" />
                          </motion.div>

                          <div className="mt-3 text-center p-3 rounded-2xl max-w-[210px] relative z-10"
                            style={{
                              background: 'rgba(255, 215, 0, 0.1)',
                              border: '1px solid rgba(255, 215, 0, 0.3)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 mb-1 inline-block">
                              Final Goal
                            </span>
                            <h4 className="font-extrabold text-xs text-white">Job Ready!</h4>
                            <p className="text-[10px] text-[#64748B] mt-0.5">Ready to launch career</p>
                          </div>
                        </div>
                      );
                    }

                    // Step cell
                    const step = cell.step;
                    const isSelected = selectedStep?.id === step.id;
                    const cfg = statusCfg[step.status];
                    const onClick = () => setSelectedStep(selectedStep?.id === step.id ? null : step);

                    return (
                      <div key={`desktop-step-${step.id}`} className="flex flex-col items-center justify-center p-4">
                        {/* Circle bubble */}
                        <motion.div
                          whileHover={step.status !== 'locked' ? { scale: 1.12 } : {}}
                          onClick={onClick}
                          className="w-14 h-14 rounded-full flex items-center justify-center font-black text-base cursor-pointer transition-all relative z-10"
                          style={{
                            background: step.status === 'locked'
                              ? 'rgba(15, 23, 42, 0.9)'
                              : isSelected
                                ? `linear-gradient(135deg, ${step.color}, ${step.color}88)`
                                : `linear-gradient(135deg, ${step.color}33, ${step.color}66)`,
                            border: `3px solid ${step.status === 'locked' ? 'rgba(71,85,105,0.6)' : step.color}`,
                            color: step.status === 'locked' ? '#475569' : '#fff',
                            boxShadow: step.status !== 'locked'
                              ? isSelected
                                ? `0 0 30px ${step.color}`
                                : `0 0 18px ${step.color}60`
                              : 'none',
                          }}
                        >
                          {step.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : step.status === 'locked' ? (
                            <Lock className="h-4 w-4 text-[#475569]" />
                          ) : (
                            <span>{String(step.id).padStart(2, '0')}</span>
                          )}
                        </motion.div>

                        {/* Label card */}
                        <motion.div
                          onClick={onClick}
                          whileHover={step.status !== 'locked' ? { y: -2 } : {}}
                          className="mt-3 text-center cursor-pointer p-3 rounded-2xl transition-all max-w-[210px] relative z-10"
                          style={{
                            background: isSelected
                              ? 'rgba(109,74,255,0.15)'
                              : 'rgba(13, 19, 36, 0.75)',
                            border: `1px solid ${isSelected ? step.color : 'rgba(255,255,255,0.05)'}`,
                            backdropFilter: 'blur(8px)',
                            opacity: step.status === 'locked' ? 0.6 : 1,
                          }}
                        >
                          <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                              {cfg.label}
                            </span>
                            <span className="text-[9px] text-[#475569] flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" /> {step.duration}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">{step.title}</h4>
                          <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{step.description}</p>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}


          </div>

          {/* MOBILE/TABLET VERTICAL WINDING ROAD (lg hidden) */}
          <div className="block lg:hidden relative w-full h-[2200px] mb-12">
            
            {/* SVG Background Path */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 2200"
              preserveAspectRatio="none"
            >
              {/* Outer shadow base road */}
              <path
                d="M 100 100 C 100 200 300 200 300 300 C 300 400 100 400 100 500 C 100 600 300 600 300 700 C 300 800 100 800 100 900 C 100 1000 300 1000 300 1100 C 300 1200 100 1200 100 1300 C 100 1400 300 1400 300 1500 C 300 1600 100 1600 100 1700 C 100 1800 300 1800 300 1900 C 300 2000 200 2000 200 2100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              {/* Main glowing road track */}
              <path
                d="M 100 100 C 100 200 300 200 300 300 C 300 400 100 400 100 500 C 100 600 300 600 300 700 C 300 800 100 800 100 900 C 100 1000 300 1000 300 1100 C 300 1200 100 1200 100 1300 C 100 1400 300 1400 300 1500 C 300 1600 100 1600 100 1700 C 100 1800 300 1800 300 1900 C 300 2000 200 2000 200 2100"
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#roadGlow)"
                opacity="0.8"
              />
              {/* Animated dash flow */}
              <path
                d="M 100 100 C 100 200 300 200 300 300 C 300 400 100 400 100 500 C 100 600 300 600 300 700 C 300 800 100 800 100 900 C 100 1000 300 1000 300 1100 C 300 1200 100 1200 100 1300 C 100 1400 300 1400 300 1500 C 300 1600 100 1600 100 1700 C 100 1800 300 1800 300 1900 C 300 2000 200 2000 200 2100"
                fill="none"
                stroke="#FFF"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="roadmap-dash-animate"
                opacity="0.7"
              />
            </svg>

            {/* Grid Container for Mobile Nodes */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-11 w-full h-full">
              {steps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                const isSelected = selectedStep?.id === step.id;
                const cfg = statusCfg[step.status];
                const onClick = () => setSelectedStep(selectedStep?.id === step.id ? null : step);

                const bubbleCell = (
                  <div className="flex justify-center items-center h-full">
                    <motion.div
                      whileHover={step.status !== 'locked' ? { scale: 1.12 } : {}}
                      onClick={onClick}
                      className="w-14 h-14 rounded-full flex items-center justify-center font-black text-base cursor-pointer transition-all relative z-10"
                      style={{
                        background: step.status === 'locked'
                          ? 'rgba(15, 23, 42, 0.9)'
                          : isSelected
                            ? `linear-gradient(135deg, ${step.color}, ${step.color}88)`
                            : `linear-gradient(135deg, ${step.color}33, ${step.color}66)`,
                        border: `3px solid ${step.status === 'locked' ? 'rgba(71,85,105,0.6)' : step.color}`,
                        color: step.status === 'locked' ? '#475569' : '#fff',
                        boxShadow: step.status !== 'locked'
                          ? isSelected
                            ? `0 0 30px ${step.color}`
                            : `0 0 18px ${step.color}60`
                          : 'none',
                      }}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : step.status === 'locked' ? (
                        <Lock className="h-4 w-4 text-[#475569]" />
                      ) : (
                        <span>{String(step.id).padStart(2, '0')}</span>
                      )}
                    </motion.div>
                  </div>
                );

                const cardCell = (
                  <div className="flex justify-center items-center h-full p-2">
                    <motion.div
                      onClick={onClick}
                      whileHover={step.status !== 'locked' ? { y: -2 } : {}}
                      className="w-full text-center cursor-pointer p-3 rounded-2xl transition-all max-w-[180px] relative z-10"
                      style={{
                        background: isSelected
                          ? 'rgba(109,74,255,0.15)'
                          : 'rgba(13, 19, 36, 0.75)',
                        border: `1px solid ${isSelected ? step.color : 'rgba(255,255,255,0.05)'}`,
                        backdropFilter: 'blur(8px)',
                        opacity: step.status === 'locked' ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                        <span className="text-[9px] text-[#475569] flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> {step.duration}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{step.title}</h4>
                      <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{step.description}</p>
                    </motion.div>
                  </div>
                );

                return (
                  <React.Fragment key={`mobile-step-${step.id}`}>
                    {isEven ? (
                      <>
                        {bubbleCell}
                        {cardCell}
                      </>
                    ) : (
                      <>
                        {cardCell}
                        {bubbleCell}
                      </>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Row 10: Center Trophy spanned across both columns */}
              <div className="col-span-2 flex flex-col items-center justify-center p-4">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                    border: '3px solid #FFF',
                    boxShadow: '0 0 30px rgba(255,215,0,0.6)',
                  }}
                >
                  <Trophy className="h-8 w-8 text-white animate-pulse" />
                </motion.div>

                <div className="mt-3 text-center p-3 rounded-2xl max-w-[210px] relative z-10"
                  style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 mb-1 inline-block">
                    Final Goal
                  </span>
                  <h4 className="font-extrabold text-xs text-white">Job Ready!</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5">Ready to launch career</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── RESOURCES SECTION ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-[20px] mb-6"
          style={{ background: 'rgba(13,19,36,0.8)', border: '1px solid rgba(109,74,255,0.12)' }}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-4 w-4" style={{ color: '#00D4FF' }} />
            <h3 className="font-bold text-white">Additional Resources</h3>
            <p className="text-xs ml-2" style={{ color: '#475569' }}>Hand-picked resources to accelerate your learning.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Map className="h-5 w-5" />, color: '#6D4AFF', title: 'Roadmap Guide', desc: 'Detailed learning path', url: 'https://roadmap.sh' },
              { icon: <GraduationCap className="h-5 w-5" />, color: '#FBBF24', title: 'Best Courses', desc: 'Top recommended courses', url: ytUrl(selectedRole) },
              { icon: <Code2 className="h-5 w-5" />, color: '#22C55E', title: 'Practice Platforms', desc: 'Sharpen your skills', url: 'https://leetcode.com' },
              { icon: <Star className="h-5 w-5" />, color: '#F97316', title: 'Project Ideas', desc: 'Build real-world projects', url: ytUrl(selectedRole + ' project ideas') },
              { icon: <FileText className="h-5 w-5" />, color: '#60A5FA', title: 'Documentation', desc: 'Official references', url: 'https://developer.mozilla.org' },
              { icon: <Award className="h-5 w-5" />, color: '#EC4899', title: 'Certificates', desc: 'Earn credentials', url: 'https://www.coursera.org' },
              { icon: <BookOpen className="h-5 w-5" />, color: '#22D3EE', title: 'Articles & Blogs', desc: 'In-depth reading', url: 'https://dev.to' },
              { icon: <YtIcon size={20} />, color: '#FF4444', title: 'YouTube Courses', desc: 'Free video learning', url: ytUrl(selectedRole + ' full course') },
            ].map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.02] hover:opacity-90 group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${res.color}15`, color: res.color, border: `1px solid ${res.color}25` }}>
                    {res.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{res.title}</p>
                    <p className="text-[10px]" style={{ color: '#475569' }}>{res.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform shrink-0" style={{ color: '#334155' }} />
              </a>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── DETAIL PANEL (slide-in) ── */}
      <AnimatePresence>
        {selectedStep && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSelectedStep(null)}
            />
            <DetailPanel
              step={selectedStep}
              onClose={() => setSelectedStep(null)}
              onComplete={() => handleMarkComplete(selectedStep.id)}
            />
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RoadmapPage;
