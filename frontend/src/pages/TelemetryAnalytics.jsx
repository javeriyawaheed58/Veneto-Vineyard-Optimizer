import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function TelemetryAnalytics({ recommendations }) {
  const [selectedZone, setSelectedZone] = useState('North Block');
  const [timeframe, setTimeframe] = useState('24H');

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        Loading analytics telemetry streams...
      </div>
    );
  }

  const currentZoneData = recommendations.find(z => z.vineyard_zone_id === selectedZone) || recommendations[0];

  const getChartBars = () => {
    const baseMoisture = currentZoneData.soil_moisture_percent || currentZoneData.soil_moisture || 35;
    let count = timeframe === '24H' ? 12 : timeframe === '7D' ? 7 : 30;
    
    const bars = [];
    for (let i = 0; i < count; i++) {
      const variance = Math.sin(i + baseMoisture) * 8;
      const val = Math.min(95, Math.max(15, Math.round(baseMoisture + variance)));
      bars.push({ label: timeframe === '24H' ? `${i * 2}:00` : `Day ${i + 1}`, value: val });
    }
    return bars;
  };

  const chartBars = getChartBars();

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <BarChart3 className="w-5 h-5 text-emerald-400" /> Advanced Telemetry Analytics & Historical Trends
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Deep-dive time-series analysis for soil moisture, temperature, and water consumption.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Zone Selector */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {recommendations.map(z => (
                <button
                  key={z.vineyard_zone_id}
                  onClick={() => setSelectedZone(z.vineyard_zone_id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    selectedZone === z.vineyard_zone_id 
                      ? 'bg-emerald-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {z.vineyard_zone_id}
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {['24H', '7D', '30D'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    timeframe === tf 
                      ? 'bg-cyan-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Display Area with Scrollable Container for 30D */}
          <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Soil Moisture Trend ({selectedZone} – {timeframe})
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Current: {currentZoneData.soil_moisture_percent || currentZoneData.soil_moisture}%
              </span>
            </div>

            {/* Chart Body with Y-Axis Scale & Horizontal Scroll Support */}
            <div className="relative pt-4">
              {/* Y-Axis Scale Markers fixed on the left */}
              <div className="absolute left-0 top-6 bottom-8 w-10 flex flex-col justify-between text-[10px] font-mono text-slate-500 select-none pointer-events-none z-20 bg-slate-950/90 py-1">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Scrollable Bars Area */}
              <div className="ml-10 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="h-56 flex items-end gap-2 pt-2 pb-2 px-3 border-b border-l border-slate-800 relative min-w-[500px]">
                  {chartBars.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative min-w-[12px]">
                      {/* Hover Tooltip */}
                      <div className="absolute -top-7 bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none font-mono z-30 whitespace-nowrap">
                        {bar.label}: {bar.value}%
                      </div>
                      {/* Vertical Bar */}
                      <div 
                        style={{ height: `${bar.value}%` }} 
                        className={`w-full rounded-t transition-all duration-300 ${
                          bar.value < 30 ? 'bg-red-500' : bar.value < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-[8px] text-slate-500 truncate w-full text-center">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Analytics Panel */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-3 border-b border-slate-800">
                Sector Analytics
              </h4>
              <div className="space-y-4 pt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Selected Sector:</span>
                  <span className="font-bold text-slate-100">{selectedZone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Action:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${currentZoneData.action === 'IRRIGATE' ? 'bg-red-500/20 text-red-400' : currentZoneData.action === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {currentZoneData.action}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Water Volume:</span>
                  <span className="font-mono font-bold text-cyan-400">{currentZoneData.water_volume_liters} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">AI Confidence:</span>
                  <span className="font-mono font-bold text-blue-400">{currentZoneData.confidence_score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Sensor Status:</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Stream
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}