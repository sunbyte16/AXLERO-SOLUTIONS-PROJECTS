import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Activity,
  Box,
  Brain,
} from 'lucide-react';
import { MedicalScan } from '../types';

interface MRIViewerProps {
  scans: MedicalScan[];
}

export const MRIViewer: React.FC<MRIViewerProps> = ({ scans }) => {
  const [selectedScanId, setSelectedScanId] = useState<string>(
    scans[0]?.id || 'scan-bra-001'
  );
  const [currentSlice, setCurrentSlice] = useState<number>(78);
  const [viewPlane, setViewPlane] = useState<'AXIAL' | 'SAGITTAL' | 'CORONAL'>('AXIAL');
  const [showPrediction, setShowPrediction] = useState(true);
  const [showGroundTruth, setShowGroundTruth] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [contrastLevel] = useState<number>(1.1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentScan = scans.find((s) => s.id === selectedScanId) || scans[0];

  // Canvas Drawing Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear Canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    // 1. Draw Simulated Anatomical Brain MRI Scan
    ctx.save();
    ctx.filter = `contrast(${contrastLevel * 100}%)`;

    // Skull boundary
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.05, radius * 1.2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#334155';
    ctx.fill();

    // Brain Parenchyma Tissue
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.98, radius * 1.12, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Ventricles (Internal CSF structure)
    ctx.beginPath();
    ctx.ellipse(centerX - 15, centerY - 10, 20, 45, 0.2, 0, 2 * Math.PI);
    ctx.ellipse(centerX + 15, centerY - 10, 20, 45, -0.2, 0, 2 * Math.PI);
    ctx.fillStyle = '#020617';
    ctx.fill();

    // Brain Gyri & Sulci texture loops
    for (let i = 0; i < 18; i++) {
      const angle = (i * Math.PI) / 9;
      const x = centerX + Math.cos(angle) * (radius * 0.6);
      const y = centerY + Math.sin(angle) * (radius * 0.7);
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, 2 * Math.PI);
      ctx.fillStyle = '#475569';
      ctx.globalAlpha = 0.35;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // 2. Render 3D U-Net Tumor Segmentation Overlay
    const sliceFactor = Math.sin((currentSlice / (currentScan?.sliceCount || 155)) * Math.PI);
    const tumorRadius = 38 * sliceFactor;

    if (tumorRadius > 4) {
      const tumorX = centerX + 45;
      const tumorY = centerY - 35;

      // Predicted Segmentation Mask (Cyan Glow)
      if (showPrediction) {
        ctx.save();
        ctx.globalAlpha = overlayOpacity;
        ctx.beginPath();
        ctx.ellipse(tumorX, tumorY, tumorRadius, tumorRadius * 0.82, 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = '#06b6d4'; // Cyan
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // High-density Necrotic Core
        ctx.beginPath();
        ctx.ellipse(tumorX + 5, tumorY - 2, tumorRadius * 0.45, tumorRadius * 0.4, 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#f43f5e'; // Red
        ctx.fill();
        ctx.restore();
      }

      // Ground Truth Contour (Yellow Outline)
      if (showGroundTruth) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(tumorX - 2, tumorY + 1, tumorRadius * 1.02, tumorRadius * 0.85, 0.28, 0, 2 * Math.PI);
        ctx.strokeStyle = '#eab308'; // Yellow Ground Truth
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Grid overlays & crosshair
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
  }, [selectedScanId, currentSlice, viewPlane, showPrediction, showGroundTruth, overlayOpacity, contrastLevel, currentScan]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono">
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
              3D Medical Image Segmentation
            </span>
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
              MONAI / PyTorch 3D U-Net
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span>Interactive DICOM / NIfTI 3D Slice Viewer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Inspect ground truth vs 3D U-Net predicted tumor segmentation masks across Axial, Sagittal, and Coronal planes.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs bg-slate-950 border border-slate-800 p-1.5 rounded-xl font-mono">
          {(['AXIAL', 'SAGITTAL', 'CORONAL'] as const).map((plane) => (
            <button
              key={plane}
              onClick={() => setViewPlane(plane)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                viewPlane === plane
                  ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {plane}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display Column */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-semibold text-slate-200">
              {currentScan?.patientStudyId} &bull; {currentScan?.modality}
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              Slice {currentSlice} / {currentScan?.sliceCount} ({viewPlane})
            </span>
          </div>

          {/* HTML5 Canvas Rendering */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex items-center justify-center p-2 w-full max-w-md aspect-square">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full object-contain rounded-xl"
            />

            {/* Overlaid Slice HUD Info */}
            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-300 space-y-0.5">
              <div>Dim: {currentScan?.dimensions}</div>
              <div>Pixel: {currentScan?.pixelSpacing}</div>
            </div>

            {/* Legend Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] flex items-center gap-3 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                <span>3D U-Net Pred</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                <span>Ground Truth</span>
              </span>
            </div>
          </div>

          {/* Slice Navigation Slider */}
          <div className="w-full space-y-2 pt-2 font-mono">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium font-sans">Slice Navigation:</span>
              <span className="text-cyan-400 font-bold">
                Slice #{currentSlice}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={currentScan?.sliceCount || 155}
              value={currentSlice}
              onChange={(e) => setCurrentSlice(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer h-2 border border-slate-800"
            />
          </div>
        </div>

        {/* Controls & Clinical Metrics Sidebar */}
        <div className="space-y-6">
          {/* Scan Selector & Diagnosis Card */}
          <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Select DICOM MRI Study</span>
            </h3>

            <select
              value={selectedScanId}
              onChange={(e) => setSelectedScanId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none font-mono"
            >
              {scans.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.patientStudyId} - {s.diagnosis}
                </option>
              ))}
            </select>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 font-sans">
              <div className="text-slate-500 text-[10px] font-bold uppercase">Diagnosis:</div>
              <div className="text-white font-bold">{currentScan?.diagnosis}</div>
              <div className="text-slate-500 text-[10px] font-bold uppercase mt-2">Anatomical Region:</div>
              <div className="text-cyan-300 font-bold font-mono">{currentScan?.anatomicalRegion}</div>
            </div>
          </div>

          {/* Segmentation Metrics */}
          <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>3D U-Net Segmentation Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-bold uppercase font-sans">Dice Score:</span>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1">
                  {currentScan?.currentSliceDiceScore}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] font-bold uppercase font-sans">Mean IoU:</span>
                <div className="text-2xl font-extrabold text-indigo-300 mt-1">
                  {currentScan?.currentSliceIoU}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span className="font-sans text-[11px]">Predicted Volume:</span>
                <strong className="text-cyan-300">{currentScan?.predictedVolumeCm3} cm³</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans text-[11px]">Ground Truth Volume:</span>
                <strong className="text-amber-300">{currentScan?.groundTruthVolumeCm3} cm³</strong>
              </div>
            </div>
          </div>

          {/* Display Toggles */}
          <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Mask Display & Contrast</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrediction}
                  onChange={(e) => setShowPrediction(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
                <span>Show 3D U-Net Prediction Mask</span>
              </label>

              <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGroundTruth}
                  onChange={(e) => setShowGroundTruth(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
                <span>Show Radiologist Ground Truth Contour</span>
              </label>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Mask Opacity:</span>
                <span className="text-white font-mono">{Math.round(overlayOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 rounded cursor-pointer h-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

