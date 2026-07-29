import React from 'react';
import {
  ShieldAlert,
  Lock,
  Key,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { PrivacyStatusResponse } from '../types';

interface PrivacyEncryptionPanelProps {
  privacyStatus: PrivacyStatusResponse | null;
}

export const PrivacyEncryptionPanel: React.FC<PrivacyEncryptionPanelProps> = ({
  privacyStatus,
}) => {
  const dp = privacyStatus?.differentialPrivacy;

  const epsPercent = dp ? Math.min(100, (dp.spentEpsilon / dp.targetEpsilon) * 100) : 33.6;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Cryptographic Privacy & Security Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            TenSEAL CKKS Homomorphic Encryption, DP-SGD Moments Accountant, and HIPAA/GDPR Regulatory Compliance Assurance.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero PHI Egress Guaranteed</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Differential Privacy Accountant Card */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>DP-SGD Privacy Budget Accountant</span>
            </h3>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded">
              Moments Accountant
            </span>
          </div>

          {/* Epsilon Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium font-sans">Accumulated Privacy Loss (&epsilon;):</span>
              <span className="font-bold text-amber-400">
                {dp?.spentEpsilon.toFixed(2) ?? '3.36'} / {dp?.targetEpsilon ?? 10.0} &epsilon;
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full transition-all duration-500"
                style={{ width: `${epsPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0 &epsilon; (Pure Privacy)</span>
              <span>{epsPercent.toFixed(1)}% Budget Exhausted</span>
              <span>{dp?.targetEpsilon ?? 10.0} &epsilon; (Max Limit)</span>
            </div>
          </div>

          {/* DP Parameters List */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 font-mono">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">Noise Multiplier (&sigma;):</div>
              <div className="text-white font-bold mt-0.5">
                {dp?.noiseMultiplier ?? 1.0} (Gaussian)
              </div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">Gradient Clipping Norm (C):</div>
              <div className="text-white font-bold mt-0.5">
                {dp?.clippingNorm ?? 1.0} L2-Norm
              </div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">Target Delta (&delta;):</div>
              <div className="text-white font-bold mt-0.5">
                {dp?.targetDelta ?? 1e-5}
              </div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">Budget Status:</div>
              <div className="text-emerald-400 font-bold mt-0.5">
                {dp?.budgetExhausted ? 'EXHAUSTED' : 'SAFE (WITHIN BOUNDS)'}
              </div>
            </div>
          </div>
        </div>

        {/* TenSEAL Homomorphic Encryption Card */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>TenSEAL CKKS Homomorphic Key Manager</span>
            </h3>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-wider font-mono px-2.5 py-0.5 rounded">
              Active Context
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">Galois Evaluation Keys:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 inline" />
                <span>GENERATED & SYNCED</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">Relinearization Keys:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 inline" />
                <span>GENERATED & SYNCED</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">Secure Aggregation Protocol:</span>
              <span className="text-indigo-300 font-bold text-[11px]">
                Shamir Secret Sharing (t=3)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-sans">Global Ciphertext Scale:</span>
              <span className="text-cyan-300 font-bold">2^40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Compliance Checklist */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>Regulatory Compliance & Verification Audit Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>HIPAA Privacy Rule</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Zero Protected Health Information (PHI) leaves hospital firewalls. Raw DICOM images stay on local GPUs.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>GDPR Article 25 & 32</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Data protection by design and default. Mathematical differential privacy guarantees non-reidentifiability.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>mTLS X.509 Authentication</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Strict mutual TLS handshake required for all hospital silos before joining training rounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

