import React from 'react';
import { Bot, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function AICommandCenter({ recommendations }) {
  const sectorWindows = {
    'North Block': '01:00 AM – 02:00 AM',
    'South Block': '02:15 AM – 03:15 AM',
    'East Block': '03:30 AM – 04:30 AM',
    'West Block': '04:45 AM – 05:45 AM'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <Bot className="w-5 h-5 text-emerald-400" /> AI Agronomist Command Center
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Smart AI system tracking live farm sensors and weather updates to manage automated irrigation.</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            4 Recommendations Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(z => {
            const isCrit = z.action === 'IRRIGATE';
            const isWarn = z.action === 'WARNING';
            const assignedWindow = sectorWindows[z.vineyard_zone_id] || '02:00 AM – 03:00 AM';

            return (
              <div 
                key={z.vineyard_zone_id} 
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition ${
                  isCrit 
                    ? 'bg-red-950/20 border-red-800/40 shadow-lg shadow-red-950/10' 
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-800/40 shadow-lg shadow-amber-950/10'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-red-500 animate-ping' : isWarn ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {z.vineyard_zone_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isCrit 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isCrit ? <ShieldAlert className="w-3 h-3" /> : isWarn ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isCrit ? 'ACTION REQUIRED' : isWarn ? 'WARNING' : 'OPTIMAL'}
                  </span>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Soil Moisture:</span>
                    <span className="font-mono font-bold text-slate-200">{z.soil_moisture_percent || z.soil_moisture}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AI Confidence:</span>
                    <span className="font-mono font-bold text-blue-400">{z.confidence_score}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> {assignedWindow}
                  </span>
                  <span className={`font-mono font-bold ${isCrit || isWarn ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {z.water_volume_liters > 0 ? `${z.water_volume_liters} Liters` : 'No Action'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}