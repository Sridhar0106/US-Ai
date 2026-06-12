import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  VideoOff, 
  ArrowRight,
  Clock,
  BookOpen,
  Send,
  Loader2,
  Sparkles,
  BrainCircuit
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
  const [notesText, setNotesText] = useState('');
  const [timerCount, setTimerCount] = useState(180); // 3 minutes per question
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  // Workflow stages: 'question' -> 'submitting' -> 'feedback' -> 'follow_up' -> 'follow_up_feedback'
  const [stage, setStage] = useState<'question' | 'feedback' | 'follow_up' | 'follow_up_feedback'>('question');
  const [activeFeedback, setActiveFeedback] = useState<EvaluationResult | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);

  // Media references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Speech Recognition reference
  const recognitionRef = useRef<any>(null);

  // Initial load
  useEffect(() => {
    fetchInterviewDetails();
    startWebcam();

    return () => {
      stopWebcam();
      stopSpeechRecognition();
    };
  }, [interviewId]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (stage === 'question' || stage === 'follow_up') {
      interval = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, currentIndex]);

  const fetchInterviewDetails = async () => {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      const intData = response.data;
      setRole(intData.role);
      setDifficulty(intData.difficulty);
      
      // Extract active questions
      const formatted = intData.questions.map((q: any, idx: number) => ({
        id: q._id,
        questionText: q.questionText,
        index: idx,
      }));
      setQuestions(formatted);
      
      // Determine where the user left off
      const firstUnanswered = intData.questions.findIndex((q: any) => !q.userAnswer);
      if (firstUnanswered !== -1) {
        setCurrentIndex(firstUnanswered);
      } else {
        setCurrentIndex(intData.questions.length - 1);
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
    }
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        setStreamError(null);
      }
    } catch (err: any) {
      console.warn('Webcam permission failed:', err);
      setStreamError('Webcam access was denied or is unavailable. You can still proceed with the interview using voice or text.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setStreamActive(false);
  };

  // Speech Recognition hook
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please use Chrome/Edge or write manually.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsVoiceRecording(true);
    };

    rec.onresult = (event: any) => {
      let speechResult = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          speechResult += event.results[i][0].transcript + ' ';
        }
      }
      if (speechResult) {
        setAnswerText(prev => prev + speechResult);
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e);
      setIsVoiceRecording(false);
    };

    rec.onend = () => {
      setIsVoiceRecording(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceRecording(false);
  };

  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Submit Answer
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('Please provide an answer first.');
      return;
    }

    setSubmitting(true);
    stopSpeechRecognition();

    try {
      if (stage === 'question') {
        // Submit primary question answer
        const response = await api.post('/interviews/answer', {
          interviewId,
          questionIndex: currentIndex,
          answerText,
        });

        const { evaluation, followUpQuestionText } = response.data;
        setActiveFeedback(evaluation);
        setFollowUpQuestion(followUpQuestionText || null);
        setStage('feedback');
      } else if (stage === 'follow_up') {
        // Submit follow up answer
        const response = await api.post('/interviews/followup', {
          interviewId,
          questionIndex: currentIndex,
          answerText,
        });
        const { evaluation } = response.data;
        setActiveFeedback(evaluation);
        setStage('follow_up_feedback');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Submission failed. Check network database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setAnswerText('');
    setActiveFeedback(null);
    setTimerCount(180); // Reset timer

    if (stage === 'feedback' && followUpQuestion) {
      setStage('follow_up');
    } else {
      // Completed current question loop (either post follow_up_feedback or skipped follow-up)
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setStage('question');
      } else {
        // All primary questions answered
        handleFinalizeInterview();
      }
    }
  };

  const handleFinalizeInterview = async () => {
    setFinalizing(true);
    try {
      await api.post('/interviews/finalize', { interviewId });
      navigate(`/report/${interviewId}`);
    } catch (err) {
      console.error('Error finalizing interview:', err);
      alert('Failed to compile report.');
      setFinalizing(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* HEADER ROOM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            {role || 'Mock Assessment'}
          </h2>
          <p className="text-xs text-slate-500">Practice Room - Difficulty: <span className="capitalize font-bold text-accent-500">{difficulty}</span></p>
        </div>
        
        {/* TIMER & PROGRESS */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-xl shadow-sm text-sm font-semibold">
            <Clock className="h-4.5 w-4.5 text-primary-500" />
            <span className={timerCount <= 30 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}>
              {formatTimer(timerCount)}
            </span>
          </div>
          {currentQuestion && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-darkBorder rounded-xl text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-300">
              Q: {currentIndex + 1} / {questions.length}
            </div>
          )}
        </div>
      </div>

      {/* DUAL COLS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT CARD: CURRENT QUESTION & AI FEEDBACK PANEL */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 p-8 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col justify-between min-h-[300px]">
            <AnimatePresence mode="wait">
              {stage === 'question' && currentQuestion && (
                <motion.div
                  key="primary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <span className="text-[10px] font-extrabold uppercase bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-md">Primary Question</span>
                  <h3 className="text-lg md:text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">{currentQuestion.questionText}</h3>
                </motion.div>
              )}

              {stage === 'feedback' && activeFeedback && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-md">AI Response Score</span>
                  <div className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-darkBorder/40">
                    <span className="text-4xl font-black text-emerald-500">{activeFeedback.score} <span className="text-xs text-slate-500 font-semibold">/10</span></span>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Technical Accuracy</p>
                      <p className="text-[11px] text-slate-500">{activeFeedback.technicalAccuracy}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">Strengths</p>
                      <ul className="space-y-1.5 list-disc pl-3 text-slate-500">
                        {activeFeedback.strengths.map((str, i) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <p className="font-bold text-rose-600 dark:text-rose-400 mb-1.5">Weaknesses</p>
                      <ul className="space-y-1.5 list-disc pl-3 text-slate-500">
                        {activeFeedback.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {stage === 'follow_up' && (
                <motion.div
                  key="followup"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <span className="text-[10px] font-extrabold uppercase bg-secondary-500/10 text-secondary-500 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Follow-Up Query</span>
                  </span>
                  <h3 className="text-lg md:text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">{followUpQuestion}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    The AI generated this query dynamically in response to your previous answer details.
                  </p>
                </motion.div>
              )}

              {stage === 'follow_up_feedback' && activeFeedback && (
                <motion.div
                  key="f_feedback"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-md">Follow-up Grading</span>
                  <div className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-darkBorder/40">
                    <span className="text-4xl font-black text-indigo-500">{activeFeedback.score} <span className="text-xs text-slate-500 font-semibold">/10</span></span>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Technical Depth</p>
                      <p className="text-[11px] text-slate-500">{activeFeedback.technicalAccuracy}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">Strengths</p>
                      <ul className="space-y-1.5 list-disc pl-3 text-slate-500">
                        {activeFeedback.strengths.map((str, i) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <p className="font-bold text-rose-600 dark:text-rose-400 mb-1.5">Weaknesses</p>
                      <ul className="space-y-1.5 list-disc pl-3 text-slate-500">
                        {activeFeedback.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLOW TOGGLE ACTION BUTTON */}
            {(stage === 'feedback' || stage === 'follow_up_feedback') && (
              <button
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3.5 bg-gradient-to-r from-primary-650 to-secondary-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
              >
                <span>
                  {stage === 'feedback' && followUpQuestion ? 'Proceed to AI Follow-up' : (
                    currentIndex + 1 < questions.length ? 'Proceed to Next Question' : 'Complete and Generate Report'
                  )}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT CARD: USER WEBCAM VIDEO STREAM & MEMO NOTES */}
        <div className="flex flex-col gap-6">
          {/* WEBCAM PREVIEW */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-[180px] object-cover rounded-xl bg-slate-950 ${streamActive ? 'block' : 'hidden'}`}
            />

            {!streamActive && (
              <div className="text-center p-6 text-slate-400 flex flex-col items-center">
                <VideoOff className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-xs font-bold">Webcam Video Feed Offline</p>
                {streamError ? (
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-relaxed">{streamError}</p>
                ) : (
                  <button onClick={startWebcam} className="text-[10px] text-accent-500 hover:underline mt-2 font-semibold">Enable Webcam Permissions</button>
                )}
              </div>
            )}
            {streamActive && (
              <div className="absolute top-6 left-6 flex items-center gap-2 px-2.5 py-1 bg-red-500/20 text-red-500 rounded-full border border-red-500/30 text-[9px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>Live stream</span>
              </div>
            )}
          </div>

          {/* SCRATCH NOTES */}
          <div className="p-4 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-1 text-slate-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400">Interview Scratchpad</span>
            </div>
            <textarea
              placeholder="Write down system architectures, core algorithmic steps, or structural pointers before speaking your response..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="flex-1 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-darkBorder focus:border-slate-300 dark:focus:border-slate-700 p-3 rounded-xl text-xs focus:outline-none resize-none placeholder:text-slate-500 text-slate-700 dark:text-slate-300 min-h-[100px]"
            />
          </div>
        </div>

      </div>

      {/* BOTTOM CONTROL ACTIONS BOX */}
      {(stage === 'question' || stage === 'follow_up') && (
        <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            
            {/* SPEECH TOGGLE BTN */}
            <button
              onClick={toggleVoiceRecording}
              className={`px-5 py-4.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all shrink-0 ${
                isVoiceRecording
                  ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 scale-95 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-darkBorder text-slate-700 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {isVoiceRecording ? (
                <>
                  <MicOff className="h-5.5 w-5.5 text-rose-500 animate-pulse" />
                  <span>Recording Spoken Input</span>
                </>
              ) : (
                <>
                  <Mic className="h-5.5 w-5.5 text-primary-500" />
                  <span>Use Voice Input</span>
                </>
              )}
            </button>

            {/* RESPONSE VALUE INPUT */}
            <div className="flex-1 relative">
              <textarea
                placeholder="Transcribe your spoken input or type out your engineering responses directly inside this text area..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-darkBorder focus:border-primary-500/40 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/20 placeholder:text-slate-500 text-slate-700 dark:text-slate-300 resize-none h-[56px] min-h-[56px]"
              />
              
              {/* SUBMIT BUTTON IN TEXTAREA */}
              <button
                onClick={handleAnswerSubmit}
                disabled={submitting || !answerText.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-95 text-white rounded-lg shadow disabled:opacity-30 transition-opacity"
              >
                {submitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
              </button>
            </div>

          </div>

          <div className="flex justify-between items-center px-1 text-[10px] text-slate-400">
            <span>Speech recognition handles punctuation automatically. Double check input text before sending.</span>
            <button
              onClick={handleNextStep}
              className="hover:underline font-bold text-rose-400 uppercase tracking-wider"
            >
              Skip Question
            </button>
          </div>
        </div>
      )}

      {/* FINALIZING REPORT LOADING SCREEN OVERLAY */}
      {finalizing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 text-slate-100">
          <BrainCircuit className="h-16 w-16 text-primary-500 animate-float mb-4" />
          <Loader2 className="h-8 w-8 text-secondary-500 animate-spin mb-4" />
          <h3 className="text-xl font-bold">Compiling Assessment Metrics...</h3>
          <p className="text-slate-400 max-w-sm text-center text-xs leading-relaxed mt-1.5">
            Gemini AI panel is reviewing your answers across technical, problem-solving, and communication modules to write your report cards.
          </p>
        </div>
      )}

    </div>
  );
};
export default InterviewRoom;
