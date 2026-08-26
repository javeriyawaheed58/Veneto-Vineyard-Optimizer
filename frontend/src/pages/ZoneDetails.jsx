import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Droplets, Thermometer, CloudRain, LineChart, HelpCircle, History, CheckCircle2 } from 'lucide-react';

export default function ZoneDetails({ recommendations }) {
  const { zoneId } = useParams();
  const zone = recommendations.find(z => z.vineyard_zone_id === zoneId) || recommendations[0];

  if (!zone) {
    return (
      <div className="space-y-4">
        <Link to="/vineyard" className="text-xs text-emerald-400 hover:underline">← Back to Vineyard Overview</Link>
        <p className="text-slate-400">Sector data not found.</p>
      </div>
    );
  }

  const isIrrigate = zone.action === "IRRIGATE";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Link 
        to="/vineyard"
        className="inline-flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Vineyard Overview
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">{zone.vineyard_zone_id}</h2>
              <p className="text-xs text-slate-400">Veneto Vineyards · Deep Telemetry & AI Diagnostics</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 ${
            isIrrigate ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isIrrigate ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            Current Status: {zone.action}
          </span>
        </div>

        {/* Current Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Soil Moisture</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{zone.soil_moisture_percent}%</p>
              <p className="text-[10px] text-amber-400 mt-0.5">Confidence: {zone.confidence_score}%</p>
            </div>
            <Droplets className="w-8 h-8 text-blue-400 opacity-80" />
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Soil Temperature</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{zone.soil_temp}°C</p>
            </div>
            <Thermometer className="w-8 h-8 text-orange-400 opacity-80" />
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Humidity</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{zone.humidity_percent}%</p>
            </div>
            <CloudRain className="w-8 h-8 text-indigo-400 opacity-80" />
          </div>
        </div>

        {/* 24-Hour Telemetry Chart Section */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-8">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-emerald-400" /> 24-Hour Telemetry Trend
          </h3>
          <div className="h-40 flex items-end justify-between gap-2 px-2 pt-6 border-b border-l border-slate-800 relative">
            {[42, 45, 48, 50, 46, 40, 35, zone.soil_moisture_percent, 55, 60, 64, 68].map((val, idx) => (
              <div key={idx} className="w-full bg-slate-900 rounded-t h-full flex items-end">
                <div className="w-full bg-emerald-500 rounded-t transition-all duration-500" style={{ height: `${val}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" /> AI Explainable Analysis & Scheduling
          </h3>
          <p className="text-xs text-slate-300 bg-slate-900 p-4 rounded-lg border border-slate-800 leading-relaxed">
            "{zone.reason}"
          </p>

          {isIrrigate && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-medium">Recommended Water Volume & Window</span>
              <span className="text-sm font-bold text-emerald-400">02:00 AM – 03:00 AM ({zone.water_volume_liters} L)</span>
            </div>
          )}
        </div>

        {/* Irrigation History Log */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" /> Recent Sector Irrigation History Log
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Cycle Completed</span>
              <span className="text-slate-400">285 Liters · Yesterday, 04:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}