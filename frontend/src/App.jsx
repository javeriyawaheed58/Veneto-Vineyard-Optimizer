import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { fetchRecommendations } from './services/api';

import Dashboard from './pages/Dashboard';
import VineyardOverview from './pages/VineyardOverview';
import SectorDetail from './pages/SectorDetail';
import AICommandCenter from './pages/AICommandCenter';
import WhatIfSimulator from './pages/WhatIfSimulator';
import TelemetryAnalytics from './pages/TelemetryAnalytics';
import WaterAnalytics from './pages/WaterAnalytics';
import IrrigationManagement from './pages/IrrigationManagement';
import AlertsCenter from './pages/AlertsCenter';
import SystemHealth from './pages/SystemHealth';
import Settings from './pages/Settings';

export default function App() {
  const [recommendations, setRecommendations] = useState([
    { vineyard_zone_id: 'North Block', soil_moisture: 24.5, temperature_c: 33.2, humidity_pct: 42, action: 'IRRIGATE', water_volume_liters: 325, confidence_score: 96, status_type: 'CRITICAL' },
    { vineyard_zone_id: 'South Block', soil_moisture: 38.2, temperature_c: 31.0, humidity_pct: 48, action: 'WARNING', water_volume_liters: 140, confidence_score: 91, status_type: 'WARNING' },
    { vineyard_zone_id: 'East Block', soil_moisture: 62.0, temperature_c: 27.5, humidity_pct: 63, action: 'MONITOR', water_volume_liters: 0, confidence_score: 97, status_type: 'OPTIMAL' },
    { vineyard_zone_id: 'West Block', soil_moisture: 74.5, temperature_c: 26.1, humidity_pct: 68, action: 'STABLE', water_volume_liters: 0, confidence_score: 99, status_type: 'STABLE' },
  ]);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadBackendData = async () => {
      const data = await fetchRecommendations();
      if (data) {
        setRecommendations(data);
        setIsOffline(false);
      } else {
        setIsOffline(true);
      }
    };

    loadBackendData();
    const interval = setInterval(loadBackendData, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="flex bg-[#030712] min-h-screen text-slate-100 font-sans antialiased">
        <Sidebar isOffline={isOffline} />
        <main className="flex-1 p-6 overflow-y-auto max-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard recommendations={recommendations} />} />
            <Route path="/vineyard" element={<VineyardOverview recommendations={recommendations} />} />
            <Route path="/vineyard/:id" element={<SectorDetail recommendations={recommendations} />} />
            <Route path="/ai" element={<AICommandCenter recommendations={recommendations} />} />
            <Route path="/ai/simulator" element={<WhatIfSimulator />} />
            <Route path="/analytics" element={<TelemetryAnalytics recommendations={recommendations} />} />
            <Route path="/analytics/water" element={<WaterAnalytics recommendations={recommendations} />} />
            <Route path="/irrigation" element={<IrrigationManagement recommendations={recommendations} />} />
            <Route path="/alerts" element={<AlertsCenter recommendations={recommendations} />} />
            <Route path="/system" element={<SystemHealth />} />
            <Route path="/settings" element={<Settings isOffline={isOffline} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}