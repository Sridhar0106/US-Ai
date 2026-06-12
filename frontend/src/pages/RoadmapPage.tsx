import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  FileText, 
  Video, 
  GraduationCap, 
  CheckSquare, 
  Square,
  Sparkles,
  Plus,
  Loader2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Resource {
  _id: string;
  title: string;
  type: 'article' | 'video' | 'course';
  url: string;
  completed: boolean;
}

interface Roadmap {
  _id: string;
  weakSkill: string;
  resources: Resource[];
  createdAt: string;
}

export const RoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom roadmap creation
  const [customSkill, setCustomSkill] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get('/roadmaps');
      setRoadmaps(response.data);
    } catch (err) {
      console.error('Error fetching roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResource = async (roadmapId: string, resourceId: string, currentStatus: boolean) => {
    try {
      const response = await api.put(`/roadmaps/${roadmapId}/resource/${resourceId}`, {
        completed: !currentStatus
      });
      
      const updatedRoadmap = response.data.roadmap;
      setRoadmaps(prev => prev.map(r => r._id === roadmapId ? updatedRoadmap : r));
    } catch (err) {
      console.error('Error updating resource progress:', err);
    }
  };

  const handleCreateCustomRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim()) return;

    setCreating(true);
    try {
      const response = await api.post('/roadmaps', { weakSkill: customSkill });
      const newRoadmap = response.data;
      
      // Add or update
      setRoadmaps(prev => {
        const exists = prev.find(r => r._id === newRoadmap._id);
        if (exists) return prev;
        return [newRoadmap, ...prev];
      });
      setCustomSkill('');
      alert(`Roadmap for "${newRoadmap.weakSkill}" has been generated successfully!`);
    } catch (err) {
      console.error('Error creating custom roadmap:', err);
      alert('Could not compile roadmap resources.');
    } finally {
      setCreating(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4.5 w-4.5 text-blue-500" />;
      case 'video':
        return <Video className="h-4.5 w-4.5 text-rose-500" />;
      case 'course':
        return <GraduationCap className="h-4.5 w-4.5 text-amber-500" />;
      default:
        return <BookOpen className="h-4.5 w-4.5 text-slate-500" />;
    }
  };

  const calculateProgress = (resources: Resource[]) => {
    if (resources.length === 0) return 0;
    const completed = resources.filter(r => r.completed).length;
    return Math.round((completed / resources.length) * 100);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* HEADER ROOM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            <span>Personalized Study Roadmaps</span>
            <Sparkles className="h-6 w-6 text-accent-500 fill-accent-500 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Target study plans generated to resolve specific knowledge gaps detected during interviews or resume scans. Check off tasks to monitor progress.
          </p>
        </div>

        {/* MANUAL GENERATION INPUT */}
        <form onSubmit={handleCreateCustomRoadmap} className="flex gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            required
            placeholder="e.g. Redis caching, Docker..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1 md:w-64 px-4 py-3 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder focus:border-primary-500/50 rounded-xl text-xs focus:outline-none placeholder:text-slate-500 text-slate-700 dark:text-slate-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>Compile Plan</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 glass-panel dark:glass-panel border border-slate-200 dark:border-darkBorder rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {roadmaps.length === 0 ? (
            <div className="h-80 flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm max-w-lg mx-auto">
              <Compass className="h-16 w-16 text-slate-300 dark:text-slate-700 animate-float mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No study roadmaps yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                Your roadmap section is populated automatically based on weakness evaluations during mock loops, or you can manually compile custom subjects above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {roadmaps.map((rm) => {
                  const progress = calculateProgress(rm.resources);
                  return (
                    <motion.div
                      key={rm._id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Title header & progress */}
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase bg-primary-500/10 text-primary-650 dark:text-primary-400 px-2 py-0.5 rounded-md mb-1 inline-block">Skill Target</span>
                            <h3 className="font-extrabold text-base text-slate-850 dark:text-white capitalize">{rm.weakSkill}</h3>
                          </div>
                          <span className="text-xs font-black text-slate-550 dark:text-slate-400">{progress}%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mb-6">
                          <div 
                            className="bg-gradient-to-r from-primary-600 to-secondary-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>

                        {/* Resources checklist */}
                        <div className="space-y-3">
                          {rm.resources.map((res) => (
                            <div 
                              key={res._id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3.5 transition-colors ${
                                res.completed
                                  ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200/50 dark:border-darkBorder/40 opacity-70'
                                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-darkBorder/80'
                              }`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                  onClick={() => handleToggleResource(rm._id, res._id, res.completed)}
                                  className="text-slate-400 hover:text-primary-600 dark:hover:text-accent-500 shrink-0"
                                >
                                  {res.completed ? (
                                    <CheckSquare className="h-5 w-5 text-emerald-500" />
                                  ) : (
                                    <Square className="h-5 w-5" />
                                  )}
                                </button>
                                <div className="flex items-center gap-2 overflow-hidden">
                                  {getResourceIcon(res.type)}
                                  <span className={`text-xs font-semibold truncate text-slate-705 dark:text-slate-300 ${res.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                                    {res.title}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 shrink-0"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-100 dark:border-darkBorder/40">
                        Generated on {new Date(rm.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

    </div>
  );
};
export default RoadmapPage;
