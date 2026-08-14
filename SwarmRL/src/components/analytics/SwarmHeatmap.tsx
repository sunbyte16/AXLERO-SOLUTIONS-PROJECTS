/**
 * SwarmRL - D3 Swarm Density & Collision Hotspot Heatmap Component
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, AlertTriangle, Eye, Flame, Layers, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { CollisionEvent, DroneAgentState, EnvironmentConfig, ObstacleState } from '../../types';

interface SwarmHeatmapProps {
  agents: DroneAgentState[];
  collisions: CollisionEvent[];
  obstacles: ObstacleState[];
  config: EnvironmentConfig;
}

export type HeatmapMode = 'DENSITY' | 'COLLISIONS' | 'COMPOSITE';

export const SwarmHeatmap: React.FC<SwarmHeatmapProps> = ({
  agents,
  collisions,
  obstacles,
  config,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Heatmap View Configuration
  const [mode, setMode] = useState<HeatmapMode>('COMPOSITE');
  const [gridBins, setGridBins] = useState<number>(30); // 30x30 grid resolution
  const [showObstacles, setShowObstacles] = useState<boolean>(true);
  const [showCollisions, setShowCollisions] = useState<boolean>(true);
  const [showLiveDrones, setShowLiveDrones] = useState<boolean>(true);
  const [decayMode, setDecayMode] = useState<boolean>(false);

  // Accumulated Grid Memory: 2D array [gridBins][gridBins]
  const densityMatrixRef = useRef<number[][]>(
    Array.from({ length: 30 }, () => Array(30).fill(0))
  );
  const collisionMatrixRef = useRef<number[][]>(
    Array.from({ length: 30 }, () => Array(30).fill(0))
  );

  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [peakDensity, setPeakDensity] = useState<number>(0);
  const [trackedCollisions, setTrackedCollisions] = useState<number>(0);

  // Reset accumulator when gridBins or config bounds change
  const handleResetHeatmap = () => {
    densityMatrixRef.current = Array.from({ length: gridBins }, () => Array(gridBins).fill(0));
    collisionMatrixRef.current = Array.from({ length: gridBins }, () => Array(gridBins).fill(0));
    setTotalVisits(0);
    setPeakDensity(0);
    setTrackedCollisions(0);
  };

  // Re-initialize matrices if gridBins changes
  useEffect(() => {
    handleResetHeatmap();
  }, [gridBins, config.width, config.length]);

  // Map world coordinate (x, z) to matrix bin indices [i, j]
  const getBinIndices = (x: number, z: number): [number, number] | null => {
    const halfW = config.width / 2;
    const halfL = config.length / 2;

    if (x < -halfW || x > halfW || z < -halfL || z > halfL) return null;

    const normX = (x + halfW) / config.width;  // [0, 1]
    const normZ = (z + halfL) / config.length; // [0, 1]

    const i = Math.min(gridBins - 1, Math.max(0, Math.floor(normX * gridBins)));
    const j = Math.min(gridBins - 1, Math.max(0, Math.floor(normZ * gridBins)));

    return [i, j];
  };

  // Process live agent locations & collision events on each telemetry step
  useEffect(() => {
    if (!agents || agents.length === 0) return;

    const densityMat = densityMatrixRef.current;
    const collisionMat = collisionMatrixRef.current;

    // Optional subtle decay to favor recent agent density over time
    if (decayMode) {
      for (let r = 0; r < gridBins; r++) {
        for (let c = 0; c < gridBins; c++) {
          densityMat[r][c] *= 0.992;
        }
      }
    }

    let visitsAdded = 0;
    let newMaxDensity = 0;

    // Increment agent density
    agents.forEach((agent) => {
      const idxs = getBinIndices(agent.position.x, agent.position.z);
      if (idxs) {
        const [i, j] = idxs;
        densityMat[i][j] += 1;
        visitsAdded++;
      }
    });

    // Increment collision matrix from latest collision events
    collisions.forEach((c) => {
      const idxs = getBinIndices(c.position.x, c.position.z);
      if (idxs) {
        const [i, j] = idxs;
        collisionMat[i][j] += 1;
      }
    });

    // Calculate max density
    for (let r = 0; r < gridBins; r++) {
      for (let c = 0; c < gridBins; c++) {
        if (densityMat[r][c] > newMaxDensity) {
          newMaxDensity = densityMat[r][c];
        }
      }
    }

    setTotalVisits((prev) => prev + visitsAdded);
    setPeakDensity(newMaxDensity);
    setTrackedCollisions(collisions.length);
  }, [agents, collisions, decayMode, gridBins, config]);

  // Main D3 Rendering Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const containerWidth = containerRef.current.clientWidth || 600;
    const containerHeight = Math.min(520, Math.max(380, containerWidth * 0.75));

    const margin = { top: 35, right: 90, bottom: 45, left: 55 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // D3 Scales for Physical Space
    const halfW = config.width / 2;
    const halfL = config.length / 2;

    const xScale = d3.scaleLinear().domain([-halfW, halfW]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-halfL, halfL]).range([height, 0]); // Inverted for top-down map Z

    // Cell size in pixels
    const cellWidth = width / gridBins;
    const cellHeight = height / gridBins;

    // Color Scales
    // Gold/Amber/Red luxury scale for density
    const maxVal = Math.max(1, peakDensity);
    const densityColorScale = d3
      .scaleSequential()
      .domain([0, maxVal])
      .interpolator(d3.interpolateYlOrRd);

    // Collision Color Scale
    const collisionColorScale = d3
      .scaleSequential()
      .domain([0, Math.max(1, d3.max(collisionMatrixRef.current.flat()) || 1)])
      .interpolator(d3.interpolateReds);

    // 1. Draw Grid Background Matrix Cells
    const densityMat = densityMatrixRef.current;
    const collisionMat = collisionMatrixRef.current;

    for (let i = 0; i < gridBins; i++) {
      for (let j = 0; j < gridBins; j++) {
        const xWorldMin = -halfW + (i / gridBins) * config.width;
        const zWorldMin = -halfL + (j / gridBins) * config.length;

        const px = xScale(xWorldMin);
        const py = yScale(zWorldMin + config.length / gridBins); // Top-left corner in SVG

        const countVisits = densityMat[i][j];
        const countCollisions = collisionMat[i][j];

        let fillColor = '#121212';
        let opacity = 0.85;

        if (mode === 'DENSITY') {
          fillColor = countVisits > 0 ? densityColorScale(countVisits) : '#121212';
        } else if (mode === 'COLLISIONS') {
          fillColor = countCollisions > 0 ? collisionColorScale(countCollisions) : '#121212';
        } else {
          // COMPOSITE Mode
          if (countCollisions > 0) {
            fillColor = '#EF4444'; // Red hotspot
            opacity = Math.min(1.0, 0.4 + (countCollisions / 5) * 0.6);
          } else if (countVisits > 0) {
            fillColor = densityColorScale(countVisits);
          }
        }

        const rect = g
          .append('rect')
          .attr('x', px)
          .attr('y', py)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', fillColor)
          .attr('opacity', opacity)
          .attr('stroke', '#1E1E1E')
          .attr('stroke-width', 0.5)
          .attr('class', 'transition-all duration-150 hover:stroke-[#C5A059] hover:stroke-2 cursor-pointer');

        // Tooltip Interaction via D3
        rect.on('mousemove', (event) => {
          if (!tooltipRef.current) return;
          const [mouseX, mouseY] = d3.pointer(event, containerRef.current);

          const xStart = xWorldMin.toFixed(1);
          const xEnd = (xWorldMin + config.width / gridBins).toFixed(1);
          const zStart = zWorldMin.toFixed(1);
          const zEnd = (zWorldMin + config.length / gridBins).toFixed(1);

          tooltipRef.current.style.display = 'block';
          tooltipRef.current.style.left = `${mouseX + 15}px`;
          tooltipRef.current.style.top = `${mouseY - 10}px`;
          tooltipRef.current.innerHTML = `
            <div class="font-mono text-[11px] bg-[#0A0A0A] border border-[#C5A059]/40 p-2.5 rounded-sm shadow-2xl text-white space-y-1">
              <div class="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">Grid Cell Telemetry</div>
              <div>Bounds: X [${xStart}m, ${xEnd}m] | Z [${zStart}m, ${zEnd}m]</div>
              <div class="flex items-center space-x-2 text-[#E8D09E]">
                <span>Agent Visits:</span>
                <span class="font-bold">${Math.round(countVisits)}</span>
                <span class="text-white/40">(${((countVisits / Math.max(1, totalVisits)) * 100).toFixed(1)}%)</span>
              </div>
              <div class="flex items-center space-x-2 ${countCollisions > 0 ? 'text-red-400 font-bold' : 'text-white/50'}">
                <span>Collisions Recorded:</span>
                <span>${countCollisions}</span>
              </div>
            </div>
          `;
        });

        rect.on('mouseleave', () => {
          if (tooltipRef.current) {
            tooltipRef.current.style.display = 'none';
          }
        });
      }
    }

    // 2. Draw Disaster Obstacle Footprints Overlay
    if (showObstacles && obstacles.length > 0) {
      const obstacleGroup = g.append('g').attr('class', 'obstacle-footprints');

      obstacles.forEach((obs) => {
        const obsX = xScale(obs.position.x - obs.size.x / 2);
        const obsY = yScale(obs.position.z + obs.size.z / 2);
        const obsW = (obs.size.x / config.width) * width;
        const obsH = (obs.size.z / config.length) * height;

        obstacleGroup
          .append('rect')
          .attr('x', obsX)
          .attr('y', obsY)
          .attr('width', Math.max(2, obsW))
          .attr('height', Math.max(2, obsH))
          .attr('fill', 'rgba(255, 255, 255, 0.08)')
          .attr('stroke', '#C5A059')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3')
          .append('title')
          .text(`Ruin Hazard: ${obs.id} (${obs.type})`);
      });
    }

    // 3. Draw Collision Point Hotspots Overlay
    if (showCollisions && collisions.length > 0) {
      const collisionGroup = g.append('g').attr('class', 'collision-hotspots');

      collisions.forEach((c) => {
        const cx = xScale(c.position.x);
        const cy = yScale(c.position.z);

        // Outer pulsing ring
        collisionGroup
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#EF4444')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .attr('class', 'animate-ping');

        // Center collision icon marker
        collisionGroup
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 3.5)
          .attr('fill', '#EF4444')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1);
      });
    }

    // 4. Draw Live Drone Positions & Direction Vectors
    if (showLiveDrones && agents.length > 0) {
      const droneGroup = g.append('g').attr('class', 'live-drones');

      agents.forEach((agent) => {
        const dx = xScale(agent.position.x);
        const dy = yScale(agent.position.z);

        // Drone dot
        droneGroup
          .append('circle')
          .attr('cx', dx)
          .attr('cy', dy)
          .attr('r', agent.status === 'COLLIDED' ? 4 : 3)
          .attr('fill', agent.status === 'COLLIDED' ? '#EF4444' : '#E8D09E')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1);

        // Yaw orientation direction vector line
        if (agent.status !== 'COLLIDED') {
          const arrowLen = 10;
          const targetDx = dx + Math.cos(agent.orientation.yaw) * arrowLen;
          const targetDy = dy - Math.sin(agent.orientation.yaw) * arrowLen;

          droneGroup
            .append('line')
            .attr('x1', dx)
            .attr('y1', dy)
            .attr('x2', targetDx)
            .attr('y2', targetDy)
            .attr('stroke', '#C5A059')
            .attr('stroke-width', 1.5);
        }
      });
    }

    // 5. Axes & Gridlines
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat((d) => `${d}m`);
    const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat((d) => `${d}m`);

    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .attr('color', '#525252')
      .selectAll('text')
      .attr('fill', '#A3A3A3')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(yAxis)
      .attr('color', '#525252')
      .selectAll('text')
      .attr('fill', '#A3A3A3')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Title label
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F5F5F5')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.1em')
      .attr('font-family', 'sans-serif')
      .text(`DISASTER ZONE SEARCH MAP (${config.width}M × ${config.length}M)`);

    // 6. Draw D3 Color Legend Scale Bar on Right
    const legendWidth = 12;
    const legendHeight = height;
    const legendG = svg
      .append('g')
      .attr('transform', `translate(${margin.left + width + 25}, ${margin.top})`);

    // Create linear gradient for legend
    const defs = svg.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'heatmap-legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%') // Bottom is 0
      .attr('x2', '0%')
      .attr('y2', '0%');  // Top is Max

    const colorStops = d3.range(0, 1.05, 0.2);
    colorStops.forEach((t) => {
      let c = densityColorScale(t * maxVal);
      if (mode === 'COLLISIONS') c = collisionColorScale(t * Math.max(1, trackedCollisions));
      linearGradient
        .append('stop')
        .attr('offset', `${t * 100}%`)
        .attr('stop-color', c);
    });

    legendG
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#heatmap-legend-gradient)')
      .attr('stroke', '#262626')
      .attr('stroke-width', 1);

    const legendScale = d3
      .scaleLinear()
      .domain([0, mode === 'COLLISIONS' ? Math.max(1, trackedCollisions) : maxVal])
      .range([legendHeight, 0]);

    const legendAxis = d3
      .axisRight(legendScale)
      .ticks(5)
      .tickFormat((d) => `${Math.round(Number(d))}`);

    legendG
      .append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .attr('color', '#525252')
      .selectAll('text')
      .attr('fill', '#A3A3A3')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    legendG
      .append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#C5A059')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text('INTENSITY');
  }, [
    agents,
    collisions,
    obstacles,
    config,
    mode,
    gridBins,
    showObstacles,
    showCollisions,
    showLiveDrones,
    peakDensity,
    trackedCollisions,
    totalVisits,
  ]);

  return (
    <div className="bg-[#121212] border border-white/10 p-5 rounded-sm shadow-2xl space-y-4 font-sans relative">
      {/* Tooltip Overlay */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-50 transition-opacity duration-150"
        style={{ display: 'none' }}
      />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="font-semibold text-xs text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#C5A059]" />
            <span>D3 Swarm Trajectory Density & Collision Hotspots</span>
          </h3>
          <p className="text-[11px] text-white/50 font-light mt-0.5">
            Spatial distribution of agent flight paths, obstacle proximity, and risk accumulation.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-1 bg-[#0A0A0A] p-1 rounded-sm border border-white/10 text-xs font-mono">
          <button
            onClick={() => setMode('DENSITY')}
            className={`px-2.5 py-1 rounded-sm transition-all text-[10px] uppercase tracking-wider ${
              mode === 'DENSITY'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Density
          </button>
          <button
            onClick={() => setMode('COLLISIONS')}
            className={`px-2.5 py-1 rounded-sm transition-all text-[10px] uppercase tracking-wider ${
              mode === 'COLLISIONS'
                ? 'bg-red-500 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Hotspots
          </button>
          <button
            onClick={() => setMode('COMPOSITE')}
            className={`px-2.5 py-1 rounded-sm transition-all text-[10px] uppercase tracking-wider ${
              mode === 'COMPOSITE'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Composite
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#0A0A0A] p-3 rounded-sm border border-white/5">
        <div>
          <span className="text-white/40 uppercase text-[9px] block">Accumulated Visits</span>
          <span className="text-[#F5F5F5] font-bold text-sm">{totalVisits.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-white/40 uppercase text-[9px] block">Peak Cell Density</span>
          <span className="text-[#C5A059] font-bold text-sm">{Math.round(peakDensity)} steps</span>
        </div>
        <div>
          <span className="text-white/40 uppercase text-[9px] block">Disaster Obstacles</span>
          <span className="text-white/80 font-bold text-sm">{obstacles.length} hazards</span>
        </div>
        <div>
          <span className="text-white/40 uppercase text-[9px] block">Hotspot Events</span>
          <span className="text-red-400 font-bold text-sm">{collisions.length} incidents</span>
        </div>
      </div>

      {/* Main D3 Canvas Container */}
      <div ref={containerRef} className="w-full relative bg-[#0A0A0A] border border-white/5 rounded-sm overflow-hidden p-2">
        <svg ref={svgRef} className="w-full h-auto block" />
      </div>

      {/* Toolbar & Filter Layer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/70 font-mono pt-1">
        <div className="flex flex-wrap items-center space-x-4">
          <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showObstacles}
              onChange={(e) => setShowObstacles(e.target.checked)}
              className="accent-[#C5A059] rounded-sm"
            />
            <span className="text-[10px] uppercase tracking-wider">Ruins Footprints</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showCollisions}
              onChange={(e) => setShowCollisions(e.target.checked)}
              className="accent-red-500 rounded-sm"
            />
            <span className="text-[10px] uppercase tracking-wider">Collision Highlights</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showLiveDrones}
              onChange={(e) => setShowLiveDrones(e.target.checked)}
              className="accent-[#C5A059] rounded-sm"
            />
            <span className="text-[10px] uppercase tracking-wider">Active Swarm Dots</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={decayMode}
              onChange={(e) => setDecayMode(e.target.checked)}
              className="accent-[#C5A059] rounded-sm"
            />
            <span className="text-[10px] uppercase tracking-wider">Decaying Memory</span>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-[10px]">
            <span className="text-white/40 uppercase">Grid Bins:</span>
            <select
              value={gridBins}
              onChange={(e) => setGridBins(Number(e.target.value))}
              className="bg-[#0A0A0A] border border-white/10 text-white rounded-sm px-1.5 py-0.5"
            >
              <option value={20}>20 × 20</option>
              <option value={30}>30 × 30</option>
              <option value={40}>40 × 40</option>
            </select>
          </div>

          <button
            onClick={handleResetHeatmap}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 text-[#C5A059] text-[10px] uppercase tracking-wider border border-[#C5A059]/30 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear Buffer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
