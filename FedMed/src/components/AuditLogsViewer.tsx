import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Download,
  CheckCircle2,
  Hash,
  Clock,
  UserCheck,
} from 'lucide-react';
import { AuditLogItem } from '../types';

interface AuditLogsViewerProps {
  logs: AuditLogItem[];
}

export const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'SECURITY',
    'HOMOMORPHIC_ENCRYPTION',
    'DIFFERENTIAL_PRIVACY',
    'FEDERATED_ROUND',
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Category', 'Action', 'Actor', 'Details', 'Hash'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.category,
      `"${l.action}"`,
      `"${l.actor}"`,
      `"${l.details}"`,
      l.hash,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FedMed_HIPAA_Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>HIPAA & GDPR Compliance Audit Stream</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically signed event logs tracking certificate handshakes, TenSEAL ciphertext verifications, and DP noise accounting.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-md transition-colors cursor-pointer font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Stream (CSV)</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl font-mono">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit actions, actors, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Stream Cards */}
      <div className="space-y-3 font-mono">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="glass-panel glass-panel-hover rounded-2xl p-4 shadow-md space-y-2 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                  {log.category}
                </span>
                <span className="font-bold text-white text-sm font-sans">{log.action}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </span>
                <span className="bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1 text-[9px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>VERIFIED</span>
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px]">
              {log.details}
            </p>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-slate-400" />
                <span>Actor: <strong className="text-slate-300">{log.actor}</strong></span>
              </span>
              <span className="flex items-center gap-1 text-slate-500" title={log.hash}>
                <Hash className="w-3 h-3 text-slate-600" />
                <span>Hash: {log.hash.slice(0, 18)}...</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

