import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  ArrowLeft, 
  Printer, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Compass
} from 'lucide-react';

interface Evaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  technicalAccuracy: string;
  communicationRating: string;
}

interface Question {
  _id: string;
  questionText: string;
  difficulty: string;
  userAnswer?: string;
  feedback?: Evaluation;
  followUpQuestionText?: string;
  followUpAnswer?: string;
  followUpFeedback?: Evaluation;
}

interface InterviewReport {
  _id: string;
  role: string;
  difficulty: string;
  status: string;
  createdAt: string;
  questions: Question[];
  finalReport?: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
  };
}

export const ReportPage: React.FC = () => {
  const { id: interviewId } = useParams<{ id: string }>();
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/interviews/${interviewId}`);
        setReport(response.data);
        
        // Trigger confetti for Hire or Strong Hire
        const rec = response.data.finalReport?.recommendation;
        if (rec === 'Hire' || rec === 'Strong Hire') {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Error fetching interview report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  const handlePrint = () => {
    window.print();
  };

  const getRecommendationStyle = (rec?: string) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Hire':
        return 'bg-emerald-500/5 text-emerald-500/80 border-emerald-500/10';
      case 'Hold':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'No Hire':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center gap-3 animate-pulse">
        <Trophy className="h-12 w-12 text-primary-500 animate-bounce" />
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Evaluation Metrics...</p>
      </div>
    );
  }

  if (!report || !report.finalReport) {
    return (
      <div className="text-center py-16 bg-white dark:bg-darkCard rounded-2xl border border-slate-200 dark:border-darkBorder p-8 max-w-xl mx-auto">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Evaluation is incomplete</h3>
        <p className="text-xs text-slate-555 mt-2 mb-6">
          This mock interview is still in progress. Please complete all questions inside the practice room before auditing report cards.
        </p>
        <Link to="/roles" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-750 text-white rounded-xl text-xs font-semibold">Practice Room</Link>
      </div>
    );
  }

  const { finalReport } = report;

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16 print:p-0 print:space-y-6">
      
      {/* HEADER CONTROLS (Hidden in print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Download PDF / Print</span>
          </button>
          <Link
            to="/roadmap"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <Compass className="h-4 w-4" />
            <span>Open Study Roadmap</span>
          </Link>
        </div>
      </div>

      {/* OVERALL SCORE & HIRING CARD */}
      <div className="p-6 md:p-8 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-accent-500/5 to-transparent -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Main big score badge */}
          <div className="w-28 h-28 rounded-full border-4 border-primary-500/20 flex flex-col items-center justify-center bg-primary-500/5 shrink-0 shadow-inner">
            <span className="text-4xl font-black text-primary-550 dark:text-primary-400">{finalReport.overallScore}</span>
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Overall Score</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-md mb-2 inline-block">Evaluation Completed</span>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{report.role} Mock Analysis</h1>
            <p className="text-xs text-slate-500 mt-1">Difficulty: <span className="capitalize font-bold">{report.difficulty}</span> &bull; Scored on {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-center md:text-right shrink-0">
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-1.5">Hiring Recommendation</p>
          <span className={`px-4.5 py-2 border rounded-xl text-sm font-extrabold tracking-wide uppercase ${getRecommendationStyle(finalReport.recommendation)}`}>
            {finalReport.recommendation}
          </span>
        </div>
      </div>

      {/* THREE SCORING SUBELEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Technical */}
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-2">Technical accuracy</p>
          <h3 className="text-3xl font-black text-indigo-500 mb-2">{finalReport.technicalScore} <span className="text-xs text-slate-500 font-semibold">/10</span></h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${finalReport.technicalScore * 10}%` }} />
          </div>
        </div>

        {/* Communication */}
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-2">Communication Rating</p>
          <h3 className="text-3xl font-black text-cyan-500 mb-2">{finalReport.communicationScore} <span className="text-xs text-slate-500 font-semibold">/10</span></h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${finalReport.communicationScore * 10}%` }} />
          </div>
        </div>

        {/* Problem Solving */}
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm text-center">
          <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-2">Problem Solving Methodology</p>
          <h3 className="text-3xl font-black text-purple-550 mb-2">{finalReport.problemSolvingScore} <span className="text-xs text-slate-500 font-semibold">/10</span></h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-550 h-full rounded-full" style={{ width: `${finalReport.problemSolvingScore * 10}%` }} />
          </div>
        </div>

      </div>

      {/* CORE STRENGTHS & WEAKNESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Strengths */}
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
          <h3 className="font-bold text-sm text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>Key Strengths Identified</span>
          </h3>
          <ul className="space-y-3">
            {finalReport.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
          <h3 className="font-bold text-sm text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5" />
            <span>Weaknesses / Improvement Areas</span>
          </h3>
          <ul className="space-y-3">
            {finalReport.weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* SUGGESTED ACTION ITEMS */}
      <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="h-4.5 w-4.5 text-accent-500" />
          <span>Recommended Study Adjustments</span>
        </h3>
        <ul className="space-y-3">
          {finalReport.suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-primary-500 shrink-0">0{i+1}.</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* DETAILED QUESTION RESPONSE LIST */}
      <div className="space-y-6">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 px-1">Detailed Answers Review</h3>
        
        {report.questions.map((q, idx) => (
          <div key={q._id} className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm space-y-4 print:break-inside-avoid">
            {/* Header question status */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-darkBorder/40 pb-3">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Question 0{idx + 1}</h4>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                (q.feedback?.score || 0) >= 8 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                Score: {q.feedback?.score || 0}/10
              </span>
            </div>

            {/* Question Text */}
            <div className="text-xs md:text-sm">
              <p className="text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Interviewer Query:</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">"{q.questionText}"</p>
            </div>

            {/* User Answer */}
            <div className="text-xs md:text-sm p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-darkBorder/40">
              <p className="text-slate-400 font-bold mb-1 text-[10px] uppercase tracking-wider">Candidate Response:</p>
              <p className="text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {q.userAnswer || 'No response provided.'}
              </p>
            </div>

            {/* Individual Feedback */}
            {q.feedback && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider text-emerald-500">Strengths</p>
                  <ul className="list-disc pl-3.5 space-y-1 text-slate-500">
                    {q.feedback.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider text-rose-500">Weaknesses</p>
                  <ul className="list-disc pl-3.5 space-y-1 text-slate-500">
                    {q.feedback.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Follow up question info */}
            {q.followUpQuestionText && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-darkBorder/30 space-y-3">
                <div className="text-xs md:text-sm">
                  <p className="text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[10px] text-secondary-500">AI Follow-Up Query:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic">"{q.followUpQuestionText}"</p>
                </div>
                <div className="text-xs md:text-sm p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-darkBorder/40">
                  <p className="text-slate-400 font-bold mb-1 text-[10px] uppercase tracking-wider">Follow-Up Candidate Response:</p>
                  <p className="text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {q.followUpAnswer || 'No response provided.'}
                  </p>
                </div>
                {q.followUpFeedback && (
                  <div className="flex items-center gap-4 py-1.5 text-xs">
                    <span className="font-extrabold text-secondary-500 text-[10px] uppercase">Follow-up Score: {q.followUpFeedback.score}/10</span>
                    <span className="text-[11px] text-slate-500">&bull; {q.followUpFeedback.technicalAccuracy}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
export default ReportPage;
