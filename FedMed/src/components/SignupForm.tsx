import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, Check, Github, Linkedin, ExternalLink, Heart } from 'lucide-react';

interface SignupFormProps {
  onSignup: (email: string, password: string, fullName: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onSwitchToLogin,
  isLoading = false,
  error = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = password.length >= 6;
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && password && confirmPassword && passwordsMatch) {
      await onSignup(email, password, fullName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            FedMed<span className="text-cyan-400">.ai</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Secure Federated Learning Platform
          </p>
        </div>

        {/* Signup Form */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Create Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
                {password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPasswordValid ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                )}
              </div>
              {password && !isPasswordValid && (
                <p className="mt-1 text-xs text-amber-400">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                )}
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-amber-400">Passwords do not match</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || !fullName || !email || !password || !confirmPassword || !passwordsMatch}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">
              HIPAA & GDPR Compliant
            </span>
          </div>
        </div>

        {/* Creator Info */}
        <div className="mt-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>Created By</span>
              <span className="font-bold text-cyan-400">𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/sunbyte16"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs"
              >
                <Github className="w-3 h-3" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/sunil-kumar-bb88bb31a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs"
              >
                <Linkedin className="w-3 h-3" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://lively-dodol-cc397c.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
