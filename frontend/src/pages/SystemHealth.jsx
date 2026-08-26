import React from 'react';
import { Cpu } from 'lucide-react';

export default function SystemHealth() {
  const statuses = [
    { name: 'MQTT Broker', status: 'Connected', ok: true },
    { name: 'FastAPI Backend', status: 'Healthy', ok: true },
    { name: 'SQLite Database', status: 'Healthy', ok: true },
    { name: 'AI Decision Engine', status: 'Ready', ok: true },
    { name: 'Weather API', status: 'Connected', ok: true },
    { name: 'Frontend Client', status: 'Online', ok: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" /> Infrastructure & System Health
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry architecture monitoring.</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            Latency: 82 ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map(s => (
            <div key={s.name} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{s.name}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}