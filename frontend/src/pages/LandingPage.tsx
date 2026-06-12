import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Bookmark, 
  Star,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: "Real-time AI Mock Interviews",
      description: "Participate in realistic mock interviews with dynamically adjusted technical and behavioral questions.",
      icon: MessageSquare,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Follow-Up Question Engine",
      description: "Our AI listens to your responses and generates contextually relevant follow-up questions to test depth.",
      icon: BrainCircuit,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Semantic Resume Analyzer",
      description: "Upload your PDF resume to extract skills, calculate matches, and receive feedback for improvements.",
      icon: Layers,
      color: "from-cyan-500 to-emerald-500"
    },
    {
      title: "Granular Performance Scoring",
      description: "Receive scoring on communication, technical depth, and problem-solving with immediate suggestions.",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Personalized Roadmap Generator",
      description: "Get structured courses, articles, and video resources targeting your weak domains after the interview.",
      icon: Bookmark,
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "Enterprise Grade Admin Panel",
      description: "Organize templates, audit mock sessions, and track aggregate student improvements dynamically.",
      icon: ShieldCheck,
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for exploring the platform features.",
      features: [
        "1 Comprehensive Mock Interview",
        "Basic Resume Score Check",
        "Standard Question Recommendations",
        "Limited Dashboard Statistics"
      ],
      cta: "Get Started",
      popular: false,
      link: "/register"
    },
    {
      name: "Pro Professional",
      price: "$19",
      period: "/mo",
      description: "Accelerate your prep and land the dream job.",
      features: [
        "Unlimited Mock Interviews",
        "Full AI Resume Analyzer",
        "Dynamic Follow-Up Questions",
        "Personalized Learning Roadmaps",
        "Downloadable PDF Reports",
        "Priority Support"
      ],
      cta: "Unlock Pro",
      popular: true,
      link: "/register"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For universities, coding bootcamps, and teams.",
      features: [
        "Everything in Pro Plan",
        "Team Dashboard Analytics",
        "Custom Role & Template Creation",
        "API Integrations",
        "Dedicated Success Manager",
        "SLA Support"
      ],
      cta: "Contact Sales",
      popular: false,
      link: "mailto:sales@usai.com"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Incoming Frontend Engineer at Vercel",
      text: "The follow-up question engine of US Ai was scarily accurate. It asked me questions on React hook closures that prepared me perfectly for my actual interview loop.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    {
      name: "David Chen",
      role: "Backend Architect at Stripe",
      text: "As someone who hadn't interviewed in 5 years, the grading system identified that I was talking too fast and not explaining scaling trade-offs. 10/10 recommend.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      name: "Elena Rostova",
      role: "Data Scientist at Perplexity",
      text: "The resume analyzer pointed out that I lacked specific SQL queries optimizations in my profile. I rewrote it, ran the roadmap tasks, and cleared the screening!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  ];

  const faqs = [
    {
      question: "How does the AI generate questions?",
      answer: "We utilize Google's Gemini models combined with specialized system prompts. The AI evaluates the chosen role, target difficulty (easy, medium, hard), and parses your uploaded resume content to compile questions tailored to your exact profile."
    },
    {
      question: "Is voice input supported?",
      answer: "Yes, the AI Interview Room integrates directly with the browser's Web Speech API. You can speak your answers naturally, and the system performs high-accuracy speech-to-text conversion in real time. You can also type or edit answers manually."
    },
    {
      question: "Can I download my final interview report?",
      answer: "Yes, the interview overview features detailed score charts for technical accuracy, communication, and problem-solving. This page can be easily printed or downloaded as a premium PDF document."
    },
    {
      question: "What is the personalized roadmap?",
      answer: "If the AI spots a weakness during your answers (e.g. system design, closures, indexing), it automatically generates structured study milestones with real article links, video tutorials, and courses to help you bridge that knowledge gap."
    }
  ];

  return (
    <div className="bg-[#030712] text-slate-100 font-sans min-h-screen overflow-x-hidden selection:bg-primary-500/30">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_50%)] z-0" />
      <div className="absolute top-[80vh] left-[-20vw] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(rgba(37,99,235,0.06),transparent_60%)] blur-3xl z-0" />
      <div className="absolute top-[180vh] right-[-10vw] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(rgba(6,182,212,0.05),transparent_60%)] blur-3xl z-0" />

      {/* HEADER NAVBAR */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-accent-500 animate-float" />
          <span className="text-2xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent tracking-tight">
            US Ai
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2">
            Log In
          </Link>
          <Link 
            to="/register" 
            className="text-sm font-bold bg-white text-[#030712] hover:bg-slate-200 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-white/5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-500/20 bg-primary-950/20 text-accent-400 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Next-Gen Gemini 2.5 Mock Framework is Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Master Every Interview With{' '}
            <span className="bg-gradient-to-r from-primary-500 via-secondary-400 to-accent-500 bg-clip-text text-transparent text-glow">
              AI Intelligence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Practice real technical and behavioral interviews, receive detailed instant feedback, improve your weak domains, and land your dream role.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <Link 
              to="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary-500/20 hover:scale-[1.02] transition-all group"
            >
              <span>Start Free Interview</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => setShowDemoVideo(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-200 font-bold px-8 py-4 rounded-xl transition-all"
            >
              <Play className="h-4 w-4 text-accent-400 fill-accent-400" />
              <span>Watch 1-Min Demo</span>
            </button>
          </div>
        </motion.div>

        {/* INTERACTION PREVIEW MOCKUP */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto p-2.5 rounded-2xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-primary-500/5"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10" />
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-900">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-xs font-semibold text-slate-600">AI Interview Workspace - Frontend Engineer</div>
            <div className="w-12" />
          </div>
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80" 
            alt="Product Mockup Dashboard" 
            className="w-full h-[320px] md:h-[450px] object-cover rounded-xl opacity-80"
          />
        </motion.div>
      </section>

      {/* COMPONENT CAROUSEL / HIGHLIGHT FEATURES */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Armed with Enterprise Grade AI</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            US Ai combines speech analysis, coding assessments, resume verification, and customized roadmaps to cover every angle of your career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl border border-slate-900 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-800 transition-all flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feat.color} text-white mb-6 shadow-md`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 bg-slate-950/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Three-Step Prep Flow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Ready to train? We have simplified the flow to give you high-impact simulations under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-900/60 bg-[#060813] relative">
            <div className="text-7xl font-extrabold text-slate-800/40 absolute top-4 right-6">01</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Select Role & Customize</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Choose from 9 target developer paths. Adjust target difficulty level (Easy to Hard) and upload your resume for tailored prompt customization.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-900/60 bg-[#060813] relative">
            <div className="text-7xl font-extrabold text-slate-800/40 absolute top-4 right-6">02</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Simulate Active Room</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Answer questions using real-time speech recording or text. AI responds with context-aware follow-up queries to check your technical depth.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-900/60 bg-[#060813] relative">
            <div className="text-7xl font-extrabold text-slate-800/40 absolute top-4 right-6">03</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Review Detailed Report</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              View dynamic metrics charts, download detailed PDF review sheets, and follow structured roadmaps with external tutorials for weak elements.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Voted Best Prep Tool by Successes</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See how developers cracked loops at top tech giants after practicing on US Ai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 bg-slate-950/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Flexible Plans for Career Builders</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose a plan that fits your current requirements. Upgrade or cancel subscription at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {pricingPlans.map((plan, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-2xl border flex flex-col justify-between relative transition-all ${
                plan.popular 
                  ? 'border-primary-500 bg-gradient-to-b from-[#080d21] to-[#040611] shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' 
                  : 'border-slate-900 bg-slate-950/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.description}</p>
                <div className="h-px bg-slate-900 w-full mb-6" />
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-accent-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={plan.link.startsWith('http') || plan.link.startsWith('mailto') ? '#' : plan.link}
                onClick={(e) => {
                  if (plan.link.startsWith('mailto')) {
                    window.location.href = plan.link;
                    e.preventDefault();
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold text-center text-sm transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:opacity-95 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">
            Everything you need to know about US Ai mock flows.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const open = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-900 bg-slate-950/40 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/30 transition-colors"
                >
                  <span className="font-bold text-sm md:text-base text-slate-200">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-accent-400' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-900/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 mb-24 rounded-3xl border border-slate-900 bg-gradient-to-br from-[#0b0c15] to-[#040612] text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 mix-blend-screen opacity-50" />
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10">Stop Stressing the Technical Loop</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8 relative z-10 text-sm md:text-base">
          Start practicing in realistic environments, mapping your score weaknesses, and landing developer roles.
        </p>
        <Link
          to="/register"
          className="relative z-10 inline-flex items-center gap-2 bg-white text-[#030712] font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-slate-200 transition-all hover:scale-[1.02]"
        >
          <span>Get Started Instantly</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-950 bg-[#010309] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-7 w-7 text-accent-500" />
            <span className="text-xl font-black text-white tracking-tight">US Ai</span>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} US Ai Inc. All rights reserved. Designed for elite preparation.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Support</a>
          </div>
        </div>
      </footer>

      {/* VIDEO DEMO MODAL */}
      <AnimatePresence>
        {showDemoVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-white rounded-full p-2 z-10"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <div className="aspect-video bg-slate-950 flex flex-col justify-center items-center text-center p-8 relative">
                <BrainCircuit className="h-16 w-16 text-primary-500 animate-float mb-4" />
                <h3 className="text-2xl font-bold mb-2">Simulating AI Interview Environment</h3>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
                  Experience a premium interview loop featuring real-time speech conversion, dynamic follow-up logic, and immediate scoring metrics.
                </p>
                <div className="inline-flex gap-4">
                  <button
                    onClick={() => {
                      setShowDemoVideo(false);
                      navigate('/register');
                    }}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-750 transition-colors"
                  >
                    Start Practicing
                  </button>
                  <button
                    onClick={() => setShowDemoVideo(false)}
                    className="border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 px-6 py-2.5 rounded-xl transition-all"
                  >
                    Close Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default LandingPage;
