import React from 'react';
import { Activity } from 'lucide-react';

export default function IrrigationManagement({ recommendations }) {
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
              <Activity className="w-5 h-5 text-emerald-400" /> Irrigation Management & Active Schedules
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated valve windows, water volume allocations, and confidence metrics.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Sector</th>
                <th className="p-3">AI Decision</th>
                <th className="p-3">Water Volume</th>
                <th className="p-3">Optimal Window</th>
                <th className="p-3">AI Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recommendations.map(z => {
                const assignedWindow = sectorWindows[z.vineyard_zone_id] || '02:00 AM – 03:00 AM';
                const isCrit = z.action === 'IRRIGATE';
                const isWarn = z.action === 'WARNING';

                return (
                  <tr key={z.vineyard_zone_id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-slate-100">{z.vineyard_zone_id}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        isCrit 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : isWarn
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {z.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{z.water_volume_liters} Liters</td>
                    <td className="p-3 font-mono text-slate-300">{assignedWindow}</td>
                    <td className="p-3 font-mono font-bold text-blue-400">{z.confidence_score}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}