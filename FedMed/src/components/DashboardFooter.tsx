import React from 'react';
import { Shield, Github, Linkedin, ExternalLink, Heart } from 'lucide-react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 px-6 py-4 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-bold text-sm">
              FedMed<span className="text-cyan-400">.ai</span>
            </span>
          </div>
          
          {/* Creator Info */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>Created By</span>
              <span className="font-bold text-cyan-400">𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </div>
            <div className="flex items-center gap-3">
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
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>© 2k26 FedMed AI Engine</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
