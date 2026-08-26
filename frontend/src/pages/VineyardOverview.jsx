import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Clock } from 'lucide-react';

export default function VineyardOverview({ recommendations }) {
  const sectorWindows = {
    'North Block': '01:00 AM – 02:00 AM',
    'South Block': '02:15 AM – 03:15 AM',
    'East Block': '03:30 AM – 04:30 AM',
    'West Block': '04:45 AM – 05:45 AM'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <MapPin className="w-5 h-5 text-emerald-400" /> Vineyard Overview & Sector Monitoring
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select any active vineyard block to inspect deep telemetry and AI diagnostics.</p>
          </div>
        </div>

        {/* Grid of Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(z => {
            const isCrit = z.action === 'IRRIGATE';
            const isWarn = z.action === 'WARNING';
            const moisture = z.soil_moisture_percent || z.soil_moisture || 24;
            const assignedWindow = sectorWindows[z.vineyard_zone_id] || '02:00 AM – 03:00 AM';

            return (
              <div key={z.vineyard_zone_id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> {z.vineyard_zone_id}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isCrit 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {z.action}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Soil Moisture</span>
                    <span className="font-mono font-bold text-slate-100">{moisture}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Water Volume</span>
                    <span className="font-mono font-bold text-cyan-400">{z.water_volume_liters || 0} Liters</span>
                  </div>
                </div>

                {/* Irrigation Window Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Optimal Window:
                  </span>
                  <span className="font-mono font-semibold text-slate-200">{assignedWindow}</span>
                </div>

                <Link
                  to={`/vineyard/${encodeURIComponent(z.vineyard_zone_id)}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  View Sector Deep Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}