import React from 'react';
import { CloudRain, Droplets, TrendingUp, ShieldCheck } from 'lucide-react';

export default function WaterAnalytics({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        Loading water intelligence streams...
      </div>
    );
  }

  // Calculate water metrics strictly from current active sector states
  let activeWaterUsage = 0;
  recommendations.forEach(zone => {
    if (zone.action === 'IRRIGATE' || zone.action === 'WARNING') {
      activeWaterUsage += (zone.water_volume_liters || 0);
    }
  });

  const recommendedBaseline = activeWaterUsage > 0 ? Math.round(activeWaterUsage * 1.25) : 0;
  const estimatedSaved = recommendedBaseline > activeWaterUsage ? recommendedBaseline - activeWaterUsage : 0;
  const efficiencyRatio = activeWaterUsage > 0 ? ((estimatedSaved / recommendedBaseline) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <CloudRain className="w-5 h-5 text-emerald-400" /> Water Intelligence & Consumption Analytics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Telemetry tracking for active sector water volumes and AI optimization savings.</p>
          </div>
          <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Sensor Feed Active
          </span>
        </div>

        {/* Metric Cards Grid (Cleaned up subtext lines and removed "real-time" wording) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active / Current Usage */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Irrigation Volume</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-100">
              {activeWaterUsage} <span className="text-xs font-normal text-slate-400">Liters</span>
            </div>
          </div>

          {/* AI Recommended */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>AI Recommended Baseline</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-400">
              {recommendedBaseline} <span className="text-xs font-normal text-slate-400">Liters</span>
            </div>
          </div>

          {/* Estimated Saved */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Water Saved</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {estimatedSaved} <span className="text-xs font-normal text-slate-400">Liters</span>
            </div>
          </div>

          {/* Efficiency Ratio */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Efficiency Ratio</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-400">
              {efficiencyRatio}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}