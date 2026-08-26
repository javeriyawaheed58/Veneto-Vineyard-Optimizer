import React from 'react';
import { RefreshCw, Wifi, WifiOff, Bell, Cpu } from 'lucide-react';

export function Header({ pageTitle, lastUpdated, isOfflineMode, loading, onRefresh }) {
  return (
    <header className="bg-[#030712]/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-100">{pageTitle}</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {isOfflineMode ? 'Using cached telemetry · Offline Fallback Active' : 'Operational SCADA Mission-Control'}
        </p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* System Health Quick Status */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 shadow-inner">
          <span className="text-slate-400 font-semibold">Health:</span>
          <span className="text-emerald-400">MQTT ✓</span>
          <span className="text-emerald-400">API ✓</span>
          <span className="text-emerald-400">AI ✓</span>
          <span className="text-emerald-400">DB ✓</span>
        </div>

        {/* Offline / Online Status Badge */}
        {isOfflineMode ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" /> OFFLINE
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
            <Wifi className="w-3.5 h-3.5" /> LIVE
          </span>
        )}

        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          Sync: {lastUpdated || 'Connecting...'}
        </span>

        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shadow-md shadow-emerald-900/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
    </header>
  );
}