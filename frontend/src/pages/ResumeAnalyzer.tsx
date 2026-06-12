import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

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

export const ResumeAnalyzer: React.FC = () => {
  const [scans, setScans] = useState<ResumeScan[]>([]);
  const [selectedScan, setSelectedScan] = useState<ResumeScan | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumes/user');
      setScans(response.data);
      if (response.data.length > 0 && !selectedScan) {
        setSelectedScan(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Only PDF files are supported.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Only PDF files are supported.');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newScan = response.data.resume;
      setScans(prev => [newScan, ...prev]);
      setSelectedScan(newScan);
      setFile(null);
      setMessage('Resume analyzed successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error parsing resume PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resume analysis?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setScans(prev => prev.filter(s => s._id !== id));
      if (selectedScan?._id === id) {
        setSelectedScan(scans.find(s => s._id !== id) || null);
      }
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  };

  const handleGenerateRoadmap = async (skill: string) => {
    setGeneratingRoadmap(skill);
    try {
      await api.post('/roadmaps', { weakSkill: skill });
      alert(`Personalized study resources for "${skill}" generated in Roadmap!`);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      alert('Could not trigger roadmap. Check network logs.');
    } finally {
      setGeneratingRoadmap(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-500 stroke-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 stroke-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <span>AI Resume Match Optimizer</span>
          <Sparkles className="h-6 w-6 text-accent-500 fill-accent-500 animate-pulse" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Upload your PDF profile sheet. Our Gemini AI parser extracts keywords, rates overall experience descriptions, flags missing requirements, and creates training actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UPLOAD & HISTORY */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* UPLOAD FORM */}
          <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Analyze Profile</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] relative ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-500/5' 
                    : 'border-slate-350 dark:border-darkBorder hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-8 w-8 text-slate-400 mb-3 opacity-60" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {file ? file.name : 'Drag & drop PDF here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">or browse files (Max 5MB)</span>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold text-xs rounded-xl shadow hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Scanning Resume & Compiling Stats...' : 'Upload & Analyze Resume'}
              </button>
            </form>
          </div>

          {/* HISTORY */}
          <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Previous Scans</h3>
            
            {scans.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No scan history available.</p>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {scans.map((scan) => (
                  <div 
                    key={scan._id}
                    onClick={() => setSelectedScan(scan)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                      selectedScan?._id === scan._id
                        ? 'border-primary-500/50 bg-primary-500/5'
                        : 'border-slate-200 dark:border-darkBorder hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold truncate text-slate-700 dark:text-slate-200">{scan.fileName}</h4>
                        <p className="text-[10px] text-slate-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        scan.strengthScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {scan.strengthScore}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(scan._id);
                        }}
                        className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED REPORT RENDER */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedScan ? (
              <motion.div
                key={selectedScan._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* MATCH GAUGE */}
                <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    {/* SVG Progress Circle */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          className="stroke-slate-200 dark:stroke-slate-800"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          className={`stroke-current transition-all duration-1000 ${
                            selectedScan.strengthScore >= 80 
                              ? 'text-emerald-500' 
                              : selectedScan.strengthScore >= 60 
                                ? 'text-amber-500' 
                                : 'text-rose-500'
                          }`}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - selectedScan.strengthScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-slate-800 dark:text-white">
                        {selectedScan.strengthScore}%
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">Profile Strength Rating</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                        Evaluated by Gemini AI based on structured descriptions, missing technologies, and details optimization.
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right shrink-0">
                    <span className={`px-3 py-1.5 border rounded-xl text-xs font-bold ${getScoreColor(selectedScan.strengthScore)}`}>
                      {selectedScan.strengthScore >= 80 ? 'Premium Profile' : selectedScan.strengthScore >= 60 ? 'Competitive Profile' : 'Needs Optimization'}
                    </span>
                  </div>
                </div>

                {/* EXPERIENCE SUMMARY */}
                {selectedScan.experienceSummary && (
                  <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Cpu className="h-4.5 w-4.5 text-primary-500" />
                      <span>Experience Overview</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed italic">
                      "{selectedScan.experienceSummary}"
                    </p>
                  </div>
                )}

                {/* MATCHED vs MISSING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Matched */}
                  <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
                    <h4 className="font-bold text-sm text-emerald-500 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Extracted Core Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScan.skillsMatched.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
                    <h4 className="font-bold text-sm text-rose-500 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Identified Gaps (Missing)</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScan.missingSkills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20">
                            {skill}
                          </span>
                          <button
                            onClick={() => handleGenerateRoadmap(skill)}
                            disabled={generatingRoadmap === skill}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-accent-500 transition-colors shrink-0"
                            title="Generate study roadmap"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUGGESTIONS */}
                <div className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-accent-500" />
                    <span>Suggestions for Profile Optimization</span>
                  </h3>
                  <ul className="space-y-3.5">
                    {selectedScan.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm">
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 animate-float mb-4" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No profile analyzed yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                  Please drag in your PDF format resume in the upload box to let the AI build parsed matching strength metrics.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
export default ResumeAnalyzer;
