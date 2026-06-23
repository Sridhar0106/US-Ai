import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Pause,
  Square,
  ArrowRight,
  Loader2,
  Sparkles,
  BrainCircuit,
  Tag,
  Shield,
  MessageSquare,
  Settings,
  Power,
  Bot,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  index: number;
}

interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  technicalAccuracy: string;
  communicationRating: string;
}

/* ─────────────────── Audio Waveform Component ─────────────────── */
const AudioWaveform: React.FC<{ active: boolean }> = ({ active }) => {
  const bars = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="ir-waveform">
      {bars.map((i) => (
        <div
          key={i}
          className={`ir-waveform-bar ${active ? 'ir-waveform-bar--active' : ''}`}
          style={{ animationDelay: `${(i * 0.07).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
};

/* ─────────────────── Circular Progress Component ─────────────────── */
const CircularProgress: React.FC<{ percent: number }> = ({ percent }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="ir-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ir-ring-label">
        <span className="ir-ring-pct">{percent}%</span>
        <span className="ir-ring-sub">Completed</span>
      </div>
    </div>
  );
};

/* ─────────────────── Performance Bar ─────────────────── */
const PerfBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="ir-perf-row">
    <div className="ir-perf-meta">
      <span className="ir-perf-label">{label}</span>
      <span className="ir-perf-val">{value}%</span>
    </div>
    <div className="ir-perf-track">
      <motion.div
        className="ir-perf-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  </div>
);

/* ─────────────────── Difficulty dots ─────────────────── */
const DiffDots: React.FC<{ level: string }> = ({ level }) => {
  const map: Record<string, number> = { easy: 1, medium: 3, hard: 5, expert: 5 };
  const filled = map[level.toLowerCase()] ?? 3;
  return (
    <div className="ir-diff-dots">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`ir-diff-dot ${i < filled ? 'ir-diff-dot--on' : ''}`} />
      ))}
    </div>
  );
};

/* ─────────────────── Leave Confirmation Modal ─────────────────── */
const LeaveModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="ir-modal-overlay">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="ir-modal"
    >
      <div className="ir-modal-icon">
        <Power size={28} />
      </div>
      <h3 className="ir-modal-title">Leave Interview?</h3>
      <p className="ir-modal-body">
        Leaving will stop your <strong>camera</strong> and <strong>microphone</strong>. Your progress may be lost.
        Are you sure you want to exit?
      </p>
      <div className="ir-modal-actions">
        <button className="ir-modal-cancel" onClick={onCancel}>Stay in Interview</button>
        <button className="ir-modal-confirm" onClick={onConfirm}>Yes, Leave</button>
      </div>
    </motion.div>
  </div>
);

/* ═══════════════════ Main Component ═══════════════════ */
export const InterviewRoom: React.FC = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Interview state
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interaction state
  const [answerText, setAnswerText] = useState('');
  const [timerCount, setTimerCount] = useState(0); // seconds elapsed
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavTarget, setPendingNavTarget] = useState<string | null>(null);

  // Stage workflow
  const [stage, setStage] = useState<'question' | 'feedback' | 'follow_up' | 'follow_up_feedback'>('question');
  const [activeFeedback, setActiveFeedback] = useState<EvaluationResult | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);

  // Performance tracking (simulated per answer)
  const [perfComm, setPerfComm] = useState(0);
  const [perfTech, setPerfTech] = useState(0);
  const [perfProblem, setPerfProblem] = useState(0);

  // Current topic tags
  const [topicTags, setTopicTags] = useState<string[]>([]);

  // Media
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  /* ── Webcam ── */
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // silent — webcam optional
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  /* ── Speech Recognition ── */
  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceRecording(false);
  }, []);

  const startSpeechRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setIsVoiceRecording(true);
    rec.onresult = (event: any) => {
      let result = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) result += event.results[i][0].transcript + ' ';
      }
      if (result) setAnswerText((prev) => prev + result);
    };
    rec.onerror = () => setIsVoiceRecording(false);
    rec.onend = () => setIsVoiceRecording(false);
    recognitionRef.current = rec;
    rec.start();
  }, []);

  const toggleVoice = useCallback(() => {
    if (isVoiceRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  }, [isVoiceRecording, startSpeechRecognition, stopSpeechRecognition]);

  /* ── Cleanup all media ── */
  const stopAllMedia = useCallback(() => {
    stopWebcam();
    stopSpeechRecognition();
  }, [stopWebcam, stopSpeechRecognition]);

  /* ── Navigation guard ── */
  const requestLeave = useCallback((target: string) => {
    setPendingNavTarget(target);
    setShowLeaveModal(true);
  }, []);

  const confirmLeave = useCallback(() => {
    stopAllMedia();
    setShowLeaveModal(false);
    if (pendingNavTarget) navigate(pendingNavTarget);
  }, [stopAllMedia, pendingNavTarget, navigate]);

  const cancelLeave = useCallback(() => {
    setShowLeaveModal(false);
    setPendingNavTarget(null);
  }, []);

  /* ── Browser back button guard ── */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Intercept popstate (browser back button)
    const handlePopState = (e: PopStateEvent) => {
      // Push state back so back doesn't immediately leave
      window.history.pushState(null, '', window.location.href);
      setShowLeaveModal(true);
      setPendingNavTarget('/dashboard');
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /* ── Mount ── */
  useEffect(() => {
    fetchInterviewDetails();
    startWebcam();
    return () => {
      stopAllMedia();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewId]);

  /* ── Timer (counts up) ── */
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && (stage === 'question' || stage === 'follow_up')) {
      timerRef.current = setInterval(() => setTimerCount((p) => p + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [stage, currentIndex, isPaused]);

  const fetchInterviewDetails = async () => {
    try {
      const res = await api.get(`/interviews/${interviewId}`);
      const data = res.data;
      setRole(data.role);
      setDifficulty(data.difficulty);
      const formatted = data.questions.map((q: any, idx: number) => ({
        id: q._id,
        questionText: q.questionText,
        index: idx,
      }));
      setQuestions(formatted);
      const firstUnanswered = data.questions.findIndex((q: any) => !q.userAnswer);
      setCurrentIndex(firstUnanswered !== -1 ? firstUnanswered : data.questions.length - 1);
      // seed topic tags from role
      setTopicTags(data.role ? [data.role, 'Problem Solving', 'Communication'] : []);
    } catch (err) {
      console.error('Error fetching interview:', err);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) { alert('Please provide an answer first.'); return; }
    setSubmitting(true);
    stopSpeechRecognition();
    try {
      if (stage === 'question') {
        const res = await api.post('/interviews/answer', { interviewId, questionIndex: currentIndex, answerText });
        const { evaluation, followUpQuestionText } = res.data;
        setActiveFeedback(evaluation);
        setFollowUpQuestion(followUpQuestionText || null);
        setStage('feedback');
        // Update performance bars
        setPerfComm(Math.min(100, perfComm + Math.round(evaluation.score * 8 + Math.random() * 5)));
        setPerfTech(Math.min(100, perfTech + Math.round(evaluation.score * 7 + Math.random() * 6)));
        setPerfProblem(Math.min(100, perfProblem + Math.round(evaluation.score * 6 + Math.random() * 8)));
      } else if (stage === 'follow_up') {
        const res = await api.post('/interviews/followup', { interviewId, questionIndex: currentIndex, answerText });
        setActiveFeedback(res.data.evaluation);
        setStage('follow_up_feedback');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submission failed. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setAnswerText('');
    setActiveFeedback(null);
    setTimerCount(0);
    if (stage === 'feedback' && followUpQuestion) {
      setStage('follow_up');
    } else if (currentIndex + 1 < questions.length) {
      setCurrentIndex((p) => p + 1);
      setStage('question');
    } else {
      handleFinalizeInterview();
    }
  };

  const handleFinalizeInterview = async () => {
    setFinalizing(true);
    stopAllMedia();
    try {
      await api.post('/interviews/finalize', { interviewId });
      navigate(`/report/${interviewId}`);
    } catch {
      alert('Failed to compile report.');
      setFinalizing(false);
    }
  };

  const handleEndInterview = () => requestLeave('/dashboard');

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progressPct = questions.length > 0 ? Math.round(((currentIndex) / questions.length) * 100) : 0;
  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  /* ─── Render ─── */
  return (
    <>
      <style>{`
        /* ── Interview Room Styles ── */
        .ir-root {
          min-height: 100vh;
          background: #0a0b14;
          color: #e2e8f0;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Topbar */
        .ir-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 62px;
          background: rgba(15,16,30,0.95);
          border-bottom: 1px solid rgba(139,92,246,0.18);
          backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .ir-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.4px;
        }
        .ir-logo-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .ir-topbar-center {
          font-size: 13.5px;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .ir-topbar-right {
          display: flex; align-items: center; gap: 16px;
        }
        .ir-active-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600;
          color: #4ade80;
          letter-spacing: 0.03em;
        }
        .ir-active-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: ir-pulse 2s infinite;
        }
        @keyframes ir-pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }
        .ir-end-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 16px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.35);
          border-radius: 9px;
          color: #f87171;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ir-end-btn:hover { background: rgba(239,68,68,0.22); border-color: rgba(239,68,68,0.6); }

        /* 3-Panel Body */
        .ir-body {
          display: grid;
          grid-template-columns: 248px 1fr 280px;
          gap: 0;
          flex: 1;
          min-height: 0;
          height: calc(100vh - 62px);
          overflow: hidden;
        }

        /* ── Left Panel ── */
        .ir-left {
          background: #0d0e1c;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 22px 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ir-role-card {
          background: linear-gradient(145deg, rgba(124,58,237,0.15), rgba(37,99,235,0.08));
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }
        .ir-role-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          border: 2px solid rgba(139,92,246,0.4);
          background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2));
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
          font-size: 24px;
          font-weight: 800;
          color: #a78bfa;
        }
        .ir-role-name {
          font-size: 14px; font-weight: 700; color: #f1f5f9;
          margin-bottom: 4px;
        }
        .ir-role-badge {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.04em;
        }
        .ir-meta-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ir-meta-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
        }
        .ir-meta-icon {
          color: #7c3aed; margin-top: 1px; flex-shrink: 0;
        }
        .ir-meta-label {
          font-size: 9.5px; font-weight: 600;
          color: #64748b; text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 2px;
        }
        .ir-meta-value {
          font-size: 12px; font-weight: 700; color: #e2e8f0;
          display: flex; align-items: center; gap: 6px;
        }
        .ir-diff-dots { display: flex; gap: 3px; }
        .ir-diff-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }
        .ir-diff-dot--on { background: linear-gradient(135deg, #7c3aed, #2563eb); }

        .ir-tips-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 16px;
        }
        .ir-tips-title {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700;
          color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .ir-tip {
          display: flex; align-items: flex-start; gap: 7px;
          font-size: 11.5px; color: #64748b;
          margin-bottom: 7px; line-height: 1.5;
        }
        .ir-tip-arrow { color: #7c3aed; flex-shrink: 0; margin-top: 1px; }

        /* ── Center Panel ── */
        .ir-center {
          background: #0a0b14;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 28px 32px;
          gap: 20px;
          position: relative;
          overflow-y: auto;
        }

        /* Background mesh */
        .ir-center::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 55% at 50% 30%, rgba(99,40,200,0.12), transparent),
                      radial-gradient(ellipse 60% 40% at 30% 80%, rgba(37,99,235,0.07), transparent);
          pointer-events: none;
        }

        .ir-ai-avatar {
          width: 88px; height: 88px;
          border-radius: 22px;
          background: linear-gradient(135deg, #5b21b6, #1d4ed8);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(124,58,237,0.35);
          position: relative;
          flex-shrink: 0;
        }
        .ir-q-counter {
          font-size: 13px; font-weight: 600; color: #64748b;
        }
        .ir-q-counter span { color: #a78bfa; font-weight: 800; }

        .ir-question-box {
          text-align: center;
          max-width: 620px;
        }
        .ir-question-text {
          font-size: 18px; font-weight: 700;
          color: #f1f5f9; line-height: 1.55;
          margin-bottom: 10px;
        }
        .ir-diff-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 12px;
          background: rgba(255,255,255,0.06);
          border-radius: 20px;
          font-size: 11px; font-weight: 600;
          color: #94a3b8;
        }

        /* Waveform */
        .ir-waveform {
          display: flex; align-items: center; gap: 3px;
          height: 52px;
        }
        .ir-waveform-bar {
          width: 3px; background: rgba(139,92,246,0.25);
          border-radius: 4px; height: 8px;
          transition: background 0.3s;
        }
        .ir-waveform-bar--active {
          background: linear-gradient(to top, #7c3aed, #06b6d4);
          animation: ir-wave 1.2s ease-in-out infinite alternate;
        }
        @keyframes ir-wave {
          0% { height: 6px; }
          50% { height: 38px; }
          100% { height: 14px; }
        }

        .ir-timer {
          font-size: 20px; font-weight: 800;
          color: #f1f5f9; letter-spacing: 0.05em;
        }
        .ir-listen-hint {
          font-size: 11.5px; color: #475569;
        }

        /* Mic Button */
        .ir-mic-wrap {
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .ir-mic-ring {
          position: absolute;
          width: 88px; height: 88px;
          border-radius: 50%;
          border: 2px solid rgba(139,92,246,0.4);
          animation: ir-mic-spin 3s linear infinite;
        }
        @keyframes ir-mic-spin {
          0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
        }
        .ir-mic-btn {
          width: 72px; height: 72px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          box-shadow: 0 0 30px rgba(124,58,237,0.5);
          transition: all 0.25s;
          position: relative;
          z-index: 1;
        }
        .ir-mic-btn:hover { transform: scale(1.06); box-shadow: 0 0 40px rgba(124,58,237,0.7); }
        .ir-mic-btn--recording {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          box-shadow: 0 0 30px rgba(220,38,38,0.5);
          animation: ir-recording-pulse 1s ease-in-out infinite;
        }
        @keyframes ir-recording-pulse {
          0%,100% { box-shadow: 0 0 25px rgba(220,38,38,0.4); }
          50% { box-shadow: 0 0 50px rgba(220,38,38,0.8); }
        }

        /* Pause / Stop Buttons */
        .ir-ctrl-row {
          display: flex; gap: 12px; align-items: center;
        }
        .ir-ctrl-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ir-ctrl-btn:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }
        .ir-ctrl-btn--stop {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.3);
          color: #f87171;
        }
        .ir-ctrl-btn--stop:hover { background: rgba(239,68,68,0.2); }

        /* Answer textarea (bottom of center) */
        .ir-answer-wrap {
          width: 100%; max-width: 620px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ir-answer-textarea {
          width: 100%; background: transparent; border: none; outline: none;
          color: #e2e8f0; font-size: 13px; line-height: 1.6;
          resize: none; min-height: 72px;
          placeholder-color: #475569;
        }
        .ir-answer-textarea::placeholder { color: #475569; }
        .ir-answer-footer {
          display: flex; align-items: center; justify-content: space-between;
        }
        .ir-skip-btn {
          background: none; border: none; cursor: pointer;
          font-size: 11px; font-weight: 700; color: #f87171;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .ir-submit-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          border: none; border-radius: 9px;
          color: #fff; font-size: 12px; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s;
        }
        .ir-submit-btn:hover { opacity: 0.9; }
        .ir-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Feedback box */
        .ir-feedback-box {
          width: 100%; max-width: 620px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .ir-feedback-score {
          display: flex; align-items: center; gap: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ir-score-num {
          font-size: 42px; font-weight: 900;
          background: linear-gradient(135deg, #4ade80, #06b6d4);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ir-score-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
        .ir-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ir-fcard {
          padding: 12px; border-radius: 11px;
          font-size: 11.5px;
        }
        .ir-fcard--green { background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.15); }
        .ir-fcard--red   { background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.15); }
        .ir-fcard-title { font-weight: 700; margin-bottom: 6px; }
        .ir-fcard--green .ir-fcard-title { color: #4ade80; }
        .ir-fcard--red .ir-fcard-title { color: #f87171; }
        .ir-fcard ul { list-style: disc; padding-left: 14px; color: #64748b; line-height: 1.6; }
        .ir-next-btn {
          width: 100%; padding: 12px;
          border: none; border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          color: #fff; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: opacity 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ir-next-btn:hover { opacity: 0.9; }

        /* ── Right Panel ── */
        .ir-right {
          background: #0d0e1c;
          border-left: 1px solid rgba(255,255,255,0.06);
          padding: 22px 18px;
          overflow-y: auto;
          display: flex; flex-direction: column; gap: 20px;
        }
        .ir-right-section-title {
          font-size: 12px; font-weight: 700;
          color: #f1f5f9; margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        /* Ring */
        .ir-ring-wrap {
          position: relative; width: 140px; height: 140px;
          margin: 0 auto;
        }
        .ir-ring-label {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .ir-ring-pct {
          font-size: 24px; font-weight: 900; color: #f1f5f9;
        }
        .ir-ring-sub {
          font-size: 10px; color: #64748b; font-weight: 500;
        }
        .ir-ring-q-label {
          text-align: center; font-size: 11px; font-weight: 600;
          color: #64748b; margin-top: 8px;
        }

        /* Perf bars */
        .ir-perf-row { margin-bottom: 12px; }
        .ir-perf-meta {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 5px;
        }
        .ir-perf-label { font-size: 11.5px; color: #94a3b8; }
        .ir-perf-val   { font-size: 11.5px; font-weight: 700; color: #e2e8f0; }
        .ir-perf-track {
          height: 5px; border-radius: 4px;
          background: rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .ir-perf-fill { height: 100%; border-radius: 4px; }

        /* AI Interviewer card */
        .ir-ai-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px;
        }
        .ir-ai-card-avatar {
          width: 42px; height: 42px; border-radius: 11px;
          background: linear-gradient(135deg, #5b21b6, #1d4ed8);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ir-ai-card-name {
          font-size: 13px; font-weight: 700; color: #f1f5f9;
          display: flex; align-items: center; gap: 6px; margin-bottom: 3px;
        }
        .ir-live-badge {
          padding: 1px 7px; border-radius: 20px;
          background: rgba(74,222,128,0.15); color: #4ade80;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.04em;
        }
        .ir-ai-card-desc { font-size: 11px; color: #64748b; line-height: 1.5; }

        /* Topic tags */
        .ir-topic-tags {
          display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px;
        }
        .ir-tag {
          padding: 4px 10px; border-radius: 7px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          font-size: 10.5px; font-weight: 600; color: #a78bfa;
        }
        .ir-tag-sub {
          padding: 3px 8px; border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 10px; color: #64748b;
        }

        /* Bottom bar */
        .ir-bottom-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 28px;
          background: rgba(13,14,28,0.9);
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 11px; color: #475569;
        }

        /* Modal */
        .ir-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(10px);
          z-index: 100;
          display: flex; align-items: center; justify-content: center;
        }
        .ir-modal {
          background: #131524;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 36px 32px;
          max-width: 400px; width: 90%;
          text-align: center;
        }
        .ir-modal-icon {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          color: #f87171;
        }
        .ir-modal-title {
          font-size: 20px; font-weight: 800; color: #f1f5f9; margin-bottom: 10px;
        }
        .ir-modal-body {
          font-size: 13.5px; color: #64748b; line-height: 1.65; margin-bottom: 24px;
        }
        .ir-modal-body strong { color: #94a3b8; }
        .ir-modal-actions { display: flex; gap: 10px; }
        .ir-modal-cancel {
          flex: 1; padding: 11px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px; color: #94a3b8; font-size: 13px; font-weight: 600;
          cursor: pointer;
        }
        .ir-modal-cancel:hover { background: rgba(255,255,255,0.11); }
        .ir-modal-confirm {
          flex: 1; padding: 11px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border: none; border-radius: 11px;
          color: #fff; font-size: 13px; font-weight: 700;
          cursor: pointer;
        }
        .ir-modal-confirm:hover { opacity: 0.9; }

        /* Finalizing overlay */
        .ir-finalizing {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(14px);
          z-index: 200;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 16px; color: #e2e8f0;
        }

        /* Scrollbar */
        .ir-left::-webkit-scrollbar, .ir-right::-webkit-scrollbar, .ir-center::-webkit-scrollbar {
          width: 4px;
        }
        .ir-left::-webkit-scrollbar-track, .ir-right::-webkit-scrollbar-track, .ir-center::-webkit-scrollbar-track {
          background: transparent;
        }
        .ir-left::-webkit-scrollbar-thumb, .ir-right::-webkit-scrollbar-thumb, .ir-center::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.3); border-radius: 4px;
        }

        /* Responsive fallback */
        @media (max-width: 900px) {
          .ir-body { grid-template-columns: 1fr; height: auto; overflow: visible; }
          .ir-left, .ir-right { display: none; }
        }
      `}</style>

      <div className="ir-root">
        {/* ── TOPBAR ── */}
        <div className="ir-topbar">
          <div className="ir-logo">
            <div className="ir-logo-icon">
              <Zap size={18} color="#fff" />
            </div>
            InterviewAI
          </div>
          <div className="ir-topbar-center">
            AI Interview Workspace — {role || 'Loading...'}
          </div>
          <div className="ir-topbar-right">
            <div className="ir-active-badge">
              <span className="ir-active-dot" />
              Interview Active
            </div>
            <button className="ir-end-btn" onClick={handleEndInterview}>
              <Power size={13} />
              End Interview
            </button>
          </div>
        </div>

        {/* ── 3-PANEL BODY ── */}
        <div className="ir-body">

          {/* ── LEFT PANEL ── */}
          <div className="ir-left">
            {/* Role Card */}
            <div className="ir-role-card">
              <div className="ir-role-avatar">
                {role ? role.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ir-role-name">{role || 'Loading...'}</div>
              <span className="ir-role-badge">Technical Round</span>
            </div>

            {/* Meta items */}
            <div className="ir-meta-list">
              <div className="ir-meta-item">
                <MessageSquare size={14} className="ir-meta-icon" />
                <div>
                  <div className="ir-meta-label">Interview Type</div>
                  <div className="ir-meta-value">AI Technical Interview</div>
                </div>
              </div>
              <div className="ir-meta-item">
                <TrendingUp size={14} className="ir-meta-icon" />
                <div>
                  <div className="ir-meta-label">Duration</div>
                  <div className="ir-meta-value">{formatTimer(timerCount)}</div>
                </div>
              </div>
              <div className="ir-meta-item">
                <Target size={14} className="ir-meta-icon" />
                <div>
                  <div className="ir-meta-label">Questions</div>
                  <div className="ir-meta-value">{currentIndex + 1} / {questions.length || '—'}</div>
                </div>
              </div>
              <div className="ir-meta-item">
                <Sparkles size={14} className="ir-meta-icon" />
                <div>
                  <div className="ir-meta-label">Difficulty</div>
                  <div className="ir-meta-value">
                    <span style={{ color: difficulty === 'hard' || difficulty === 'expert' ? '#f87171' : difficulty === 'medium' ? '#fbbf24' : '#4ade80' }}>
                      {diffLabel}
                    </span>
                    <DiffDots level={difficulty} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="ir-tips-card">
              <div className="ir-tips-title">
                <Sparkles size={12} />
                Tips
              </div>
              {['Answer clearly and concisely', 'Take your time to think', 'Explain with examples', 'Speak naturally'].map((tip) => (
                <div key={tip} className="ir-tip">
                  <span className="ir-tip-arrow">›</span>
                  {tip}
                </div>
              ))}
            </div>

            {/* Hidden video for webcam track */}
            <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
          </div>

          {/* ── CENTER PANEL ── */}
          <div className="ir-center">
            <AnimatePresence mode="wait">
              {(stage === 'question' || stage === 'follow_up') && currentQuestion && (
                <motion.div
                  key={`q-${currentIndex}-${stage}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}
                >
                  {/* AI Bot Avatar */}
                  <div className="ir-ai-avatar">
                    <Bot size={40} color="#c4b5fd" />
                  </div>

                  {/* Counter */}
                  <div className="ir-q-counter">
                    Question <span>{currentIndex + 1}</span> of {questions.length}
                  </div>

                  {/* Question */}
                  <div className="ir-question-box">
                    <div className="ir-question-text">
                      {stage === 'follow_up' ? followUpQuestion : currentQuestion.questionText}
                    </div>
                    <span className="ir-diff-chip">
                      <TrendingUp size={11} /> {diffLabel}
                    </span>
                  </div>

                  {/* Waveform */}
                  <AudioWaveform active={isVoiceRecording && !isPaused} />

                  {/* Timer */}
                  <div className="ir-timer">{formatTimer(timerCount)}</div>
                  <div className="ir-listen-hint">
                    {isVoiceRecording ? 'Recording your answer...' : 'Click mic to start recording'}
                  </div>

                  {/* Mic Button */}
                  <div className="ir-mic-wrap">
                    <div className="ir-mic-ring" />
                    <button
                      className={`ir-mic-btn ${isVoiceRecording ? 'ir-mic-btn--recording' : ''}`}
                      onClick={toggleVoice}
                    >
                      {isVoiceRecording ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#fff" />}
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="ir-ctrl-row">
                    <button className="ir-ctrl-btn" onClick={() => setIsPaused(!isPaused)}>
                      <Pause size={13} /> {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button className="ir-ctrl-btn ir-ctrl-btn--stop" onClick={stopSpeechRecognition}>
                      <Square size={13} /> Stop Answering
                    </button>
                  </div>

                  {/* Answer box */}
                  <div className="ir-answer-wrap">
                    <textarea
                      className="ir-answer-textarea"
                      placeholder="Transcribe your spoken input or type your answer here..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows={3}
                    />
                    <div className="ir-answer-footer">
                      <button className="ir-skip-btn" onClick={handleNextStep}>Skip Question</button>
                      <button
                        className="ir-submit-btn"
                        onClick={handleAnswerSubmit}
                        disabled={submitting || !answerText.trim()}
                      >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                        {submitting ? 'Submitting...' : 'Submit Answer'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {(stage === 'feedback' || stage === 'follow_up_feedback') && activeFeedback && (
                <motion.div
                  key={`fb-${currentIndex}-${stage}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}
                >
                  <div className="ir-ai-avatar">
                    <Bot size={40} color="#c4b5fd" />
                  </div>
                  <div className="ir-q-counter">
                    {stage === 'feedback' ? 'AI Feedback' : 'Follow-Up Grading'}
                  </div>

                  <div className="ir-feedback-box">
                    <div className="ir-feedback-score">
                      <span className="ir-score-num">{activeFeedback.score}</span>
                      <div>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>out of 10</div>
                        <div className="ir-score-sub">{activeFeedback.technicalAccuracy}</div>
                      </div>
                    </div>
                    <div className="ir-grid2">
                      <div className="ir-fcard ir-fcard--green">
                        <div className="ir-fcard-title">Strengths</div>
                        <ul>
                          {activeFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="ir-fcard ir-fcard--red">
                        <div className="ir-fcard-title">Weaknesses</div>
                        <ul>
                          {activeFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                    <button className="ir-next-btn" onClick={handleNextStep}>
                      {stage === 'feedback' && followUpQuestion
                        ? 'Proceed to AI Follow-Up'
                        : currentIndex + 1 < questions.length
                        ? 'Next Question'
                        : 'Complete & Generate Report'}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="ir-right">
            {/* Interview Progress */}
            <div>
              <div className="ir-right-section-title">Interview Progress</div>
              <CircularProgress percent={progressPct} />
              <div className="ir-ring-q-label">
                {currentIndex} of {questions.length} Questions
              </div>
            </div>

            {/* Your Performance */}
            <div>
              <div className="ir-right-section-title">Your Performance</div>
              <PerfBar label="Communication" value={perfComm} color="linear-gradient(90deg, #4ade80, #22c55e)" />
              <PerfBar label="Technical Knowledge" value={perfTech} color="linear-gradient(90deg, #38bdf8, #0ea5e9)" />
              <PerfBar label="Problem Solving" value={perfProblem} color="linear-gradient(90deg, #a78bfa, #7c3aed)" />
            </div>

            {/* AI Interviewer */}
            <div>
              <div className="ir-right-section-title">AI Interviewer</div>
              <div className="ir-ai-card">
                <div className="ir-ai-card-avatar">
                  <Bot size={20} color="#c4b5fd" />
                </div>
                <div>
                  <div className="ir-ai-card-name">
                    InterviewAI Assistant
                    <span className="ir-live-badge">Live</span>
                  </div>
                  <div className="ir-ai-card-desc">
                    Analyzing your responses in real-time and adapting the next questions.
                  </div>
                </div>
              </div>
            </div>

            {/* Current Topic */}
            <div>
              <div className="ir-right-section-title">Current Topic</div>
              <div className="ir-topic-tags">
                {topicTags.map((t) => (
                  <span key={t} className="ir-tag">
                    <Tag size={9} style={{ display: 'inline', marginRight: 4 }} />
                    {t}
                  </span>
                ))}
                {['Critical Thinking', 'Communication', 'Best Practices'].map((t) => (
                  <span key={t} className="ir-tag-sub">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="ir-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Shield size={13} />
            Your responses are secure and confidential
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MessageSquare size={12} /> Report an Issue
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Settings size={12} /> Settings
            </button>
          </div>
        </div>
      </div>

      {/* ── LEAVE MODAL ── */}
      <AnimatePresence>
        {showLeaveModal && (
          <LeaveModal onConfirm={confirmLeave} onCancel={cancelLeave} />
        )}
      </AnimatePresence>

      {/* ── FINALIZING OVERLAY ── */}
      {finalizing && (
        <div className="ir-finalizing">
          <BrainCircuit size={64} color="#8b5cf6" />
          <Loader2 size={32} color="#06b6d4" className="animate-spin" />
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Compiling Assessment Metrics...</h3>
          <p style={{ fontSize: 12, color: '#64748b', maxWidth: 340, textAlign: 'center', lineHeight: 1.7 }}>
            Gemini AI is reviewing your answers across technical, problem-solving, and communication modules.
          </p>
        </div>
      )}
    </>
  );
};

export default InterviewRoom;
