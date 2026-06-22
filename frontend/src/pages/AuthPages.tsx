import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'register' | 'forgot-password';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode }) => {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  // State fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate(redirect);
      } else if (mode === 'register') {
        await register(name, email, password);
        navigate(redirect);
      } else {
        // Mock forgot password
        setTimeout(() => {
          setForgotSuccess(true);
          setLoading(false);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      // Mock Google Login payloads
      const randomId = Math.random().toString(36).substring(7);
      await googleLogin(
        'Demo Candidate',
        'candidate@usai.com',
        `https://api.dicebear.com/7.x/avataaars/svg?seed=googleCandidate`,
        randomId
      );
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(rgba(37,99,235,0.08),transparent_60%)] blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(rgba(124,58,237,0.08),transparent_60%)] blur-3xl" />

      {/* CORE CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-2">
            <BrainCircuit className="h-9 w-9 text-accent-500 animate-float" />
            <span className="text-2xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent tracking-tight">
              InterviewAI
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            {mode === 'login' && 'Sign in to practice mock assessments'}
            {mode === 'register' && 'Create your account to unlock roadmaps'}
            {mode === 'forgot-password' && 'Recover your platform credentials'}
          </p>
        </div>

        {/* GLASS CARD FORM */}
        <div className="glass-panel border border-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden bg-slate-950/60 backdrop-blur-xl">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary-500/50 via-secondary-500/50 to-accent-500/50" />
          
          <h2 className="text-xl font-bold text-center text-white mb-6">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Register Account'}
            {mode === 'forgot-password' && 'Forgot Password?'}
          </h2>

          {/* ALERT WRAPPER */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotSuccess ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Check your inbox</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
                We have dispatched password recovery instructions to your email address.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NAME FIELD */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-primary-500/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL FIELD */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@usai.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-primary-500/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              {mode !== 'forgot-password' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                    {mode === 'login' && (
                      <Link to="/forgot-password" className="text-[11px] text-accent-400 hover:text-accent-300 font-medium">
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 focus:border-primary-500/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-primary-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing...' : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot-password' && 'Reset Password'}
                  </>
                )}
              </button>

              {/* SOCIAL SEPARATOR */}
              {mode !== 'forgot-password' && (
                <>
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-900" />
                    </div>
                    <span className="relative bg-[#060812] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Or continue with</span>
                  </div>

                  {/* GOOGLE SIGN IN */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3.5 py-3 border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl font-bold text-xs transition-colors"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google Secure Login</span>
                  </button>
                </>
              )}

              {/* FOOTER SWITCHER */}
              <div className="text-center text-xs text-slate-500 pt-6">
                {mode === 'login' ? (
                  <>
                    New to US Ai?{' '}
                    <Link to="/register" className="text-accent-400 hover:text-accent-300 font-bold">
                      Create Account
                    </Link>
                  </>
                ) : mode === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent-400 hover:text-accent-300 font-bold">
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-bold transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default AuthPages;
