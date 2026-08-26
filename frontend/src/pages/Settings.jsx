import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sliders, Database, WifiOff } from 'lucide-react';

export default function Settings({ isOffline }) {
  const [pollingInterval, setPollingInterval] = useState('10 Seconds');
  const [sensitivity, setSensitivity] = useState('Critical (< 30%)');
  const [offlineMode, setOfflineMode] = useState(isOffline || false);

  useEffect(() => {
    if (isOffline !== undefined) {
      setOfflineMode(isOffline);
    }
  }, [isOffline]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <SettingsIcon className="w-5 h-5 text-emerald-400" /> System Settings & Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage polling intervals, irrigation sensitivity thresholds, and offline data sync.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Telemetry Polling Interval
              </span>
              <p className="text-[11px] text-slate-400">Select live data sync frequency.</p>
            </div>
            <select 
              value={pollingInterval} 
              onChange={(e) => setPollingInterval(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option>5 Seconds</option>
              <option>10 Seconds</option>
              <option>30 Seconds</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" /> Soil Moisture Sensitivity Threshold
              </span>
              <p className="text-[11px] text-slate-400">Adjust AI irrigation trigger sensitivity.</p>
            </div>
            <select 
              value={sensitivity} 
              onChange={(e) => setSensitivity(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option>Strict (&lt; 35%)</option>
              <option>Critical (&lt; 30%)</option>
              <option>Relaxed (&lt; 25%)</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-cyan-400" /> Offline-First Fallback Mode
              </span>
              <p className="text-[11px] text-slate-400">
                {offlineMode ? '⚠️ Edge fallback caching active. Operating locally.' : 'Enable local browser caching to maintain dashboard operations during network drops.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={offlineMode} 
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}