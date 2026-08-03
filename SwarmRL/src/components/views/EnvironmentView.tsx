/**
 * SwarmRL - Disaster Zone Environment Configurator View
 */

import React from 'react';
import { Flame, Layers, Sliders, Wind } from 'lucide-react';
import { useSwarmStore } from '../../stores/useSwarmStore';

export const EnvironmentView: React.FC = () => {
  const { config, updateConfig, addLog } = useSwarmStore();

  const handleDensityChange = (density: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME') => {
    updateConfig({ obstacle_density: density });
    addLog('INFO', 'SIMULATION', `Obstacle density adjusted to ${density}. Regeneration scheduled.`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full max-w-4xl font-sans">
      <div>
        <h2 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
          <Flame className="w-5 h-5 text-[#C5A059]" />
          <span>Disaster Response Search Environment Configurator</span>
        </h2>
        <p className="text-xs text-white/50 font-light mt-0.5">
          Configure search grid dimensions, ruined building density, and atmospheric weather forces.
        </p>
      </div>

      <div className="bg-[#121212] border border-white/10 p-5 rounded-sm space-y-6 shadow-2xl">
        {/* Environment Dimensions */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span>Search Zone Bounds (Meters)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">Width (X): {config.width}m</label>
              <input
                type="range"
                min={60}
                max={200}
                step={10}
                value={config.width}
                onChange={(e) => updateConfig({ width: Number(e.target.value) })}
                className="w-full accent-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">Length (Z): {config.length}m</label>
              <input
                type="range"
                min={60}
                max={200}
                step={10}
                value={config.length}
                onChange={(e) => updateConfig({ length: Number(e.target.value) })}
                className="w-full accent-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">Ceiling (Y): {config.height}m</label>
              <input
                type="range"
                min={20}
                max={80}
                step={5}
                value={config.height}
                onChange={(e) => updateConfig({ height: Number(e.target.value) })}
                className="w-full accent-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* Ruined Building Density */}
        <div className="space-y-3 border-t border-white/10 pt-5">
          <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">Rubble & Building Obstacle Density</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
            {(['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] as const).map((density) => (
              <button
                key={density}
                onClick={() => handleDensityChange(density)}
                className={`py-2.5 rounded-sm border uppercase tracking-widest transition-all ${
                  config.obstacle_density === density
                    ? 'bg-[#C5A059] border-[#C5A059] text-black font-bold shadow-md'
                    : 'bg-[#0A0A0A] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>

        {/* Wind Simulation */}
        <div className="space-y-3 border-t border-white/10 pt-5">
          <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider flex items-center space-x-2">
            <Wind className="w-4 h-4 text-[#C5A059]" />
            <span>Atmospheric Wind & Gust Forces</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">Wind Strength: {config.wind.strength} m/s</label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={config.wind.strength}
                onChange={(e) =>
                  updateConfig({
                    wind: { ...config.wind, enabled: Number(e.target.value) > 0, strength: Number(e.target.value) },
                  })
                }
                className="w-full accent-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-white/50 block mb-1 uppercase text-[10px] tracking-wider">Wind Direction: {config.wind.direction}°</label>
              <input
                type="range"
                min={0}
                max={360}
                step={15}
                value={config.wind.direction}
                onChange={(e) =>
                  updateConfig({ wind: { ...config.wind, direction: Number(e.target.value) } })
                }
                className="w-full accent-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
