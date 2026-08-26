import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AlertsCenter({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        Loading operational alert streams...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <Bell className="w-5 h-5 text-emerald-400" /> Operational Alerts Center
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Dynamic system event logs driven by live sector telemetry and AI triggers.</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            {recommendations.length} Active Feeds
          </span>
        </div>

        {/* Dynamic Alerts Generated from Live Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(z => {
            const isCrit = z.action === 'IRRIGATE';
            const isWarn = z.action === 'WARNING';
            const moisture = z.soil_moisture_percent || z.soil_moisture || 0;

            return (
              <div 
                key={z.vineyard_zone_id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition ${
                  isCrit 
                    ? 'bg-red-950/20 border-red-800/40' 
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-800/40'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isCrit 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isCrit ? <ShieldAlert className="w-3 h-3" /> : isWarn ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isCrit ? 'CRITICAL ACTION' : isWarn ? 'WARNING' : 'RESOLVED / STABLE'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Just now</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">{z.vineyard_zone_id} Telemetry Check</h4>
                  <p className="text-xs text-slate-400">
                    {isCrit 
                      ? `Soil moisture critically low at ${moisture}%. Immediate valve activation required.` 
                      : isWarn 
                      ? `Soil moisture trending down at ${moisture}%. Monitor closely.`
                      : `Sector stable at ${moisture}% soil moisture level.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}