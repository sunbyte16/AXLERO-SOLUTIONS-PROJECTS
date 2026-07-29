import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Cpu,
  Database,
  Lock,
  Search,
  CheckCircle2,
  HardDrive,
  Globe,
} from 'lucide-react';
import { HospitalNode } from '../types';

interface HospitalNodeManagerProps {
  hospitals: HospitalNode[];
  onRegisterNode: (data: Partial<HospitalNode>) => Promise<void>;
  onRevokeNode: (id: string) => Promise<void>;
}

export const HospitalNodeManager: React.FC<HospitalNodeManagerProps> = ({
  hospitals,
  onRegisterNode,
  onRevokeNode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Node Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [region, setRegion] = useState('North America');
  const [gpuModel, setGpuModel] = useState('NVIDIA A100-SXM4-80GB');
  const [datasetVolume, setDatasetVolume] = useState('1,200 3D MRI (BraTS-2024)');
  const [localSamplesCount, setLocalSamplesCount] = useState('1200');

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || h.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    setIsSubmitting(true);
    try {
      await onRegisterNode({
        name,
        code,
        region,
        gpuModel,
        datasetVolume,
        localSamplesCount: Number(localSamplesCount),
      });
      setIsModalOpen(false);
      setName('');
      setCode('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Node Orchestration & Silo Onboarding</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Manage X.509 mTLS certificates, hardware telemetry, local dataset volumes, and differential privacy constraints for clinical partners.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-md shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Hospital Silo</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search hospital, code, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto font-mono">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Filter Status:</span>
          {['ALL', 'ONLINE', 'OFFLINE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((node) => (
          <div
            key={node.id}
            className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        node.status === 'ONLINE' ? 'bg-emerald-400 status-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'
                      }`}
                    ></span>
                    <h3 className="font-bold text-white text-sm leading-snug">{node.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-mono">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>{node.region}</span>
                  </div>
                </div>
                <span className="bg-slate-950 border border-slate-800 font-mono text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded">
                  {node.code}
                </span>
              </div>

              {/* Hardware Telemetry & Dataset Info */}
              <div className="space-y-2 my-4 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>GPU Compute:</span>
                  </span>
                  <span className="text-slate-200 font-medium text-[11px]">{node.gpuModel}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dataset Volume:</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{node.datasetVolume}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Local DSC / Loss:</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {node.localDiceScore} / {node.localLoss}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>DP Epsilon:</span>
                  </span>
                  <span className="text-emerald-300 font-bold">
                    {node.spentEpsilon.toFixed(2)} / {node.targetEpsilon} &epsilon;
                  </span>
                </div>
              </div>

              {/* Certificate Security Badge */}
              <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">mTLS Handshake:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" />
                    <span>VERIFIED</span>
                  </span>
                </div>
                <div className="truncate text-slate-500" title={node.mtlsFingerprint}>
                  {node.mtlsFingerprint}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                Heartbeat: {new Date(node.lastSeen).toLocaleTimeString()}
              </span>
              <button
                onClick={() => onRevokeNode(node.id)}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer font-mono"
              >
                <Trash2 className="w-3 h-3" />
                <span>Revoke Cert</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard Hospital Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Onboard Clinical Partner Node</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hospital Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johns Hopkins Medical Institute"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-sans">Silo Identifier Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JHU-BALTIMORE"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-sans">Geographic Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North America (East)"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-sans">GPU Hardware Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NVIDIA H100-80GB"
                    value={gpuModel}
                    onChange={(e) => setGpuModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1 font-sans">Local DICOM Scans</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={localSamplesCount}
                    onChange={(e) => setLocalSamplesCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-md font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider text-xs px-4 py-2 rounded-md shadow-[0_0_15px_rgba(8,145,178,0.4)] cursor-pointer"
                >
                  {isSubmitting ? 'Issuing mTLS Cert...' : 'Issue Cert & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

