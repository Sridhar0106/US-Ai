import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  Globe, 
  Binary, 
  PieChart, 
  BrainCircuit, 
  Settings2,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DevRole {
  name: string;
  icon: any;
  description: string;
  topics: string[];
  color: string;
}

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<string, 'easy' | 'medium' | 'hard'>>({});

  const roles: DevRole[] = [
    {
      name: 'Frontend Developer',
      icon: Globe,
      description: 'Assess skills in HTML5, CSS Grid/Flexbox, JavaScript (ES6+), TypeScript, React, and DOM optimizations.',
      topics: ['React Hooks', 'Virtual DOM', 'State Management', 'Web Performance'],
      color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500'
    },
    {
      name: 'Backend Developer',
      icon: Terminal,
      description: 'Evaluate Node.js, Express, databases, indexing strategies, API designs, and distributed caching.',
      topics: ['REST APIs', 'SQL vs NoSQL', 'JWT Auth', 'Query Indexing'],
      color: 'from-purple-500/10 to-pink-500/10 hover:border-purple-500'
    },
    {
      name: 'Full Stack Developer',
      icon: Layers,
      description: 'Comprehensive loop testing end-to-end integration, database schemas, server states, and UI hydration.',
      topics: ['MERN Stack', 'Next.js', 'State Hydration', 'API Handlers'],
      color: 'from-cyan-500/10 to-emerald-500/10 hover:border-cyan-500'
    },
    {
      name: 'Java Developer',
      icon: Code2,
      description: 'Focuses on Object-Oriented Principles, Spring Boot framework, JVM tuning, threads, and JDBC connection pools.',
      topics: ['OOP Pillars', 'Spring Boot', 'JVM Garbage Collection', 'Multithreading'],
      color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-500'
    },
    {
      name: 'Python Developer',
      icon: Binary,
      description: 'Includes data structures, Django/FastAPI conventions, generators, decorators, and memory management.',
      topics: ['FastAPI / Django', 'Decorators & Generators', 'Gil & Multiprocessing', 'Data Parsing'],
      color: 'from-violet-500/10 to-purple-500/10 hover:border-violet-500'
    },
    {
      name: 'Data Analyst',
      icon: PieChart,
      description: 'Covers SQL queries joins, aggregates, Excel formulas, Python libraries (Pandas), and visualization (Tableau).',
      topics: ['SQL Joins & Grouping', 'Pandas & NumPy', 'Data Cleansing', 'Bi Metrics'],
      color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500'
    },
    {
      name: 'Data Scientist',
      icon: Cpu,
      description: 'Evaluate statistical analysis, regression, machine learning pipelines, feature engineering, and model training.',
      topics: ['Regression & Classification', 'Scikit-Learn', 'Overfitting Prevention', 'A/B Testing'],
      color: 'from-rose-500/10 to-red-500/10 hover:border-rose-500'
    },
    {
      name: 'AI Engineer',
      icon: BrainCircuit,
      description: 'Advanced assessments on LLMs, Fine-tuning, RAG frameworks, transformers attention, and vector indices.',
      topics: ['Transformer Attention', 'RAG Optimizations', 'Embeddings Scaling', 'Model Quantization'],
      color: 'from-indigo-500/10 to-cyan-500/10 hover:border-indigo-500'
    },
    {
      name: 'DevOps Engineer',
      icon: Settings2,
      description: 'Test containerization (Docker), orchestration (K8s), CI/CD pipelines, AWS infra, and infrastructure as code.',
      topics: ['Docker & Kubernetes', 'CI/CD Pipelines (Github Actions)', 'AWS IAM & VPC', 'Terraform (IaC)'],
      color: 'from-blue-500/10 to-teal-500/10 hover:border-teal-500'
    }
  ];

  const handleDifficultyChange = (roleName: string, level: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(prev => ({
      ...prev,
      [roleName]: level
    }));
  };

  const handleStartInterview = async (roleName: string) => {
    const difficulty = selectedDifficulty[roleName] || 'medium';
    setLoading(roleName);

    try {
      const response = await api.post('/interviews/start', {
        role: roleName,
        difficulty
      });
      const { interviewId } = response.data;
      navigate(`/interview/${interviewId}`);
    } catch (error) {
      console.error('Error starting interview session:', error);
      alert('Could not start interview. Please check database connection.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
          <span>Choose Your Interview Domain</span>
          <Sparkles className="h-6 w-6 text-accent-500 fill-accent-500 animate-pulse" />
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Select from our 9 career-focused developer assessment panels. AI will dynamically compile a tailored list of questions mapping to the selected difficulty.
        </p>
      </div>

      {/* ROLES CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const currentDifficulty = selectedDifficulty[role.name] || 'medium';
          const isProcessing = loading === role.name;

          return (
            <motion.div
              key={role.name}
              whileHover={{ y: -5 }}
              className={`p-6 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl flex flex-col justify-between transition-all group ${role.color}`}
            >
              <div>
                {/* ICON & TITLE */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform duration-200">
                    <Icon className="h-5.5 w-5.5 text-primary-500" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-white transition-colors">{role.name}</h3>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{role.description}</p>

                {/* TOPICS ACCORDION */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {role.topics.map((topic, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* DIFFICULTY SELECTOR */}
                <div className="flex items-center justify-between gap-1 mb-5 bg-slate-100/50 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200/50 dark:border-darkBorder/40">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(role.name, level as any)}
                      className={`flex-1 text-[10px] font-bold py-1.5 px-2.5 rounded-lg uppercase transition-all ${
                        currentDifficulty === level
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                {/* START BTN */}
                <button
                  onClick={() => handleStartInterview(role.name)}
                  disabled={!!loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <span>{isProcessing ? 'Generating Questions...' : 'Start Assessment'}</span>
                  {!isProcessing && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
export default RoleSelection;
