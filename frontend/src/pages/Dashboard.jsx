import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Droplets, AlertTriangle, ShieldCheck, ArrowRight, Activity, Sliders, MapPin, LayoutDashboard } from 'lucide-react';

export default function Dashboard({ recommendations }) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        Loading live telemetry dashboard...
      </div>
    );
  }

  const totalSectors = recommendations.length;
  const irrigationCount = recommendations.filter(z => z.action === 'IRRIGATE').length;
  const warningCount = recommendations.filter(z => z.action === 'WARNING').length;
  const monitorCount = recommendations.filter(z => z.action === 'MONITOR' || z.action === 'STABLE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      {/* Dashboard Header with exact requested brand name */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" /> Veneto Vineyard AI Optimizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry monitoring and automated irrigation control system.</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> System Active
        </span>
      </div>

      {/* Top Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monitored Sectors</p>
            <h3 className="text-2xl font-black font-mono text-slate-100">{totalSectors}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Irrigation Required</p>
            <h3 className="text-2xl font-black font-mono text-red-400">{irrigationCount}</h3>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <Droplets className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Warning Status</p>
            <h3 className="text-2xl font-black font-mono text-amber-400">{warningCount}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Optimal / Monitor</p>
            <h3 className="text-2xl font-black font-mono text-emerald-400">{monitorCount}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* AI Agronomist Priority Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold flex items-center gap-2 text-slate-100">
            <Activity className="w-4 h-4 text-emerald-400" /> AI Agronomist Priority Overview
          </h3>
          <button 
            onClick={() => navigate('/ai')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            Open Command Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((zone) => {
            const isCrit = zone.action === 'IRRIGATE';
            const isWarn = zone.action === 'WARNING';
            return (
              <div 
                key={zone.vineyard_zone_id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                  isCrit ? 'bg-red-950/20 border-red-800/40' : isWarn ? 'bg-amber-950/20 border-amber-800/40' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {zone.vineyard_zone_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCrit ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isWarn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isCrit ? 'ACTION REQUIRED' : isWarn ? 'WARNING' : 'OPTIMAL'}
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${zone.soil_moisture_percent || zone.soil_moisture || 50}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400 font-semibold">Action: <strong className={isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}>{zone.action}</strong></span>
                  <button 
                    onClick={() => navigate('/vineyard')}
                    className="text-emerald-400 hover:underline font-bold text-[11px]"
                  >
                    View Sector →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-100">
              <MapPin className="w-4 h-4 text-emerald-400" /> Vineyard Sector Topology
            </h4>
            <p className="text-xs text-slate-400">Inspect real-time telemetry across North, South, East, and West blocks.</p>
          </div>
          <button 
            onClick={() => navigate('/vineyard')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            Open Vineyard Map →
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-100">
              <Sliders className="w-4 h-4 text-cyan-400" /> AI What-If Simulator Sandbox
            </h4>
            <p className="text-xs text-slate-400">Test custom weather & moisture scenarios against the decision engine.</p>
          </div>
          <button 
            onClick={() => navigate('/ai/simulator')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            Launch Simulator →
          </button>
        </div>
      </div>
    </div>
  );
}