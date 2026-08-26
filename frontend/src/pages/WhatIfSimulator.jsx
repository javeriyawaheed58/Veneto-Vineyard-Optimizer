import React, { useState } from 'react';
import { Sliders, Play, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function WhatIfSimulator() {
  const [rain, setRain] = useState(2);
  const [temp, setTemp] = useState(28);
  const [moisture, setMoisture] = useState(35);
  const [simulatedResult, setSimulatedResult] = useState(null);

  const runSimulation = () => {
    // Dynamic rule calculation based on user slider input
    const isCritical = moisture < 30 || (moisture < 45 && rain < 5);
    setSimulatedResult({
      action: isCritical ? 'IRRIGATE' : 'MONITOR',
      volume: isCritical ? Math.round((40 - moisture) * 12) : 0,
      reason: isCritical 
        ? `Soil moisture (${moisture}%) is below optimal threshold with expected rain (${rain}mm). Immediate irrigation advised during window 02:00 AM - 03:00 AM.`
        : `Soil moisture (${moisture}%) and ambient temperature (${temp}°C) are within stable operational limits. No immediate valve action required.`
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <Sliders className="w-5 h-5 text-emerald-400" /> AI What-If Decision Simulator Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Test custom meteorological scenarios to evaluate real-time AI decision support output.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sliders Control Panel */}
          <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Rain Forecast: <strong className="text-cyan-400 font-mono">{rain} mm</strong></span>
                <span className="text-slate-500">Max 20 mm</span>
              </div>
              <input 
                type="range" min="0" max="20" value={rain} 
                onChange={(e) => setRain(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Temperature: <strong className="text-amber-400 font-mono">{temp}°C</strong></span>
                <span className="text-slate-500">Max 40°C</span>
              </div>
              <input 
                type="range" min="15" max="40" value={temp} 
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Soil Moisture: <strong className="text-blue-400 font-mono">{moisture}%</strong></span>
                <span className="text-slate-500">Max 80%</span>
              </div>
              <input 
                type="range" min="10" max="80" value={moisture} 
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <button 
              onClick={runSimulation}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Run Simulation Model
            </button>
          </div>

          {/* Right Simulation Output Panel with Sandbox Badge on Top Right */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 relative">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Simulation Output</h4>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Interactive Model Sandbox
                </span>
              </div>

              {simulatedResult ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold">AI Recommendation:</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      simulatedResult.action === 'IRRIGATE' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {simulatedResult.action} {simulatedResult.volume > 0 && `(${simulatedResult.volume} L)`}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    {simulatedResult.reason}
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center text-slate-500 text-xs space-y-2">
                  <Sliders className="w-8 h-8 opacity-40 text-slate-400" />
                  <p>Adjust sliders and click "Run Simulation Model" to test custom meteorological scenarios.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}