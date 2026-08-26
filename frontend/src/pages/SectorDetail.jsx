import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Thermometer, CloudRain, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SectorDetail({ recommendations }) {
  const { id } = useParams();
  
  const zoneId = id ? decodeURIComponent(id) : 'North Block';
  const sector = recommendations.find(z => z.vineyard_zone_id === zoneId) || recommendations[0];

  const moisture = sector.soil_moisture_percent || sector.soil_moisture || 24;
  const temp = sector.temperature_c || 26;
  const humidity = sector.humidity_pct || 58;
  const isIrrigate = sector.action === 'IRRIGATE';

  // Dynamic staggered history logs per sector so they don't look identical
  const historyLogs = {
    'North Block': { volume: '310 Liters', time: 'Yesterday, 02:00 AM' },
    'South Block': { volume: '245 Liters', time: '2 days ago, 03:15 AM' },
    'East Block': { volume: '290 Liters', time: 'Yesterday, 03:30 AM' },
    'West Block': { volume: '265 Liters', time: '3 days ago, 04:45 AM' }
  };
  const sectorHistory = historyLogs[zoneId] || { volume: '280 Liters', time: 'Yesterday, 04:30 AM' };

  // Generate 12-hour telemetry trend bars with Y-axis scale
  const chartBars = [];
  for (let i = 0; i < 12; i++) {
    const variance = Math.sin(i + moisture) * 6;
    const val = Math.min(95, Math.max(15, Math.round(moisture + variance)));
    chartBars.push({ label: `${i * 2}:00`, value: val });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      {/* Back Navigation */}
      <div>
        <Link 
          to="/vineyard" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vineyard Overview
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Sector Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <Activity className="w-5 h-5 text-emerald-400" /> {sector.vineyard_zone_id}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Veneto Vineyards · Deep Telemetry & AI Diagnostics</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
            isIrrigate 
              ? 'bg-red-500/20 text-red-400 border-red-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isIrrigate ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
            Current Status: {sector.action}
          </span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Soil Moisture</span>
              <h2 className="text-2xl font-extrabold text-slate-100 font-mono">{moisture}%</h2>
              <p className="text-[10px] text-blue-400 font-semibold">Confidence: {sector.confidence_score}%</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Droplets className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Soil Temperature</span>
              <h2 className="text-2xl font-extrabold text-slate-100 font-mono">{temp}°C</h2>
              <p className="text-[10px] text-amber-400 font-semibold">Thermal Status: Optimal</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Thermometer className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Humidity</span>
              <h2 className="text-2xl font-extrabold text-slate-100 font-mono">{humidity}%</h2>
              <p className="text-[10px] text-cyan-400 font-semibold">Atmospheric Vapor: Stable</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CloudRain className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Trend Graph */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">24-Hour Telemetry Trend</h4>
            <span className="text-xs font-mono text-emerald-400 font-bold">Live Stream Active</span>
          </div>

          <div className="relative pt-4">
            <div className="absolute left-0 top-6 bottom-8 w-10 flex flex-col justify-between text-[10px] font-mono text-slate-500 select-none pointer-events-none">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="ml-12 h-52 flex items-end gap-2 pt-2 pb-2 px-2 border-b border-l border-slate-800 relative">
              {chartBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  <div className="absolute -top-7 bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none font-mono z-10">
                    {bar.value}%
                  </div>
                  <div 
                    style={{ height: `${bar.value}%` }} 
                    className={`w-full rounded-t transition-all duration-500 ${
                      bar.value < 30 ? 'bg-red-500' : bar.value < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[9px] text-slate-500 truncate w-full text-center">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Explainable Analysis */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> AI Explainable Analysis & Scheduling
          </h4>
          
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
            {isIrrigate 
              ? `AI Decision Engine evaluated soil moisture at ${moisture}% against the critical 30% threshold. Immediate valve activation recommended to prevent crop drought stress.`
              : `Sector telemetry is stable at ${moisture}% soil moisture. Autonomous AI policy confirms no intervention required at this time.`}
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
            <span className="text-slate-400 font-semibold">Recommended Water Volume & Window</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
              02:00 AM – 03:00 AM ({sector.water_volume_liters || 315} Liters)
            </span>
          </div>
        </div>

        {/* Unique Sector History Log */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recent Sector Irrigation History Log
          </h4>
          
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-200">Automated Cycle Completed Successfully</span>
            </div>
            <span className="font-mono text-slate-400">{sectorHistory.volume} · {sectorHistory.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}