import React from 'react';
import { Shield, Lock, Brain, Globe, Zap, ArrowRight, CheckCircle2, Activity, Building2, Github, Linkedin, ExternalLink, Heart } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              FedMed<span className="text-cyan-400">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onLogin}
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-5 py-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-cyan-400 font-medium">
                HIPAA & GDPR Compliant Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Secure Federated Learning for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                Medical Imaging
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Collaboratively train AI models across healthcare institutions without sharing sensitive patient data. 
              Powered by homomorphic encryption and differential privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all text-lg"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onLogin}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-4 rounded-xl border border-slate-700 transition-all text-lg"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built with privacy-preserving technologies that meet the strictest healthcare compliance requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel rounded-2xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Homomorphic Encryption</h3>
              <p className="text-slate-400 leading-relaxed">
                CKKS scheme enables computation on encrypted data. Model gradients never leave hospital perimeters in plaintext.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Differential Privacy</h3>
              <p className="text-slate-400 leading-relaxed">
                DP-SGD with moments accountant ensures mathematical privacy guarantees. Strict epsilon budget management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-2xl p-8 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Institutional</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect multiple hospital nodes with mTLS authentication. Real-time monitoring and audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{'<'}2s</div>
              <div className="text-slate-400 text-sm">Round Latency</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">AES-256</div>
              <div className="text-slate-400 text-sm">Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted for Critical Healthcare AI
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powering federated learning initiatives across leading medical institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Brain Tumor Segmentation</h3>
                <p className="text-slate-400 text-sm">
                  3D U-Net models trained on multi-institutional MRI datasets with Dice scores {'>'} 0.90
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Clinical Trial Analysis</h3>
                <p className="text-slate-400 text-sm">
                  Secure federated evaluation of AI models across clinical trial sites
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Global Research Collaboration</h3>
                <p className="text-slate-400 text-sm">
                  Enable cross-border medical research while maintaining data sovereignty
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Real-time Diagnostics</h3>
                <p className="text-slate-400 text-sm">
                  Low-latency federated inference for clinical decision support systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Healthcare AI?
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join leading institutions in building the future of privacy-preserving medical AI
              </p>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all text-lg"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">
                FedMed<span className="text-cyan-400">.ai</span>
              </span>
            </div>
            
            {/* Creator Info */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                <span>Created By</span>
                <span className="font-bold text-cyan-400">𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/sunbyte16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/sunil-kumar-bb88bb31a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://lively-dodol-cc397c.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© 2k26 FedMed AI Engine</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
