import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Bot, Sliders, BarChart3, CloudRain, Bell, Cpu, Settings, Activity, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react';

export default function Sidebar({ isOffline }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Vineyard Overview', path: '/vineyard', icon: MapPin },
    { name: 'AI Command Center', path: '/ai', icon: Bot },
    { name: 'What-If Simulator', path: '/ai/simulator', icon: Sliders },
    { name: 'Telemetry Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Water Analytics', path: '/analytics/water', icon: CloudRain },
    { name: 'Irrigation Management', path: '/irrigation', icon: Activity },
    { name: 'Alerts Center', path: '/alerts', icon: Bell },
    { name: 'System Health', path: '/system', icon: Cpu },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#030712] border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 transition-all duration-300`}>
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-emerald-400 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500 animate-pulse" /> VENETO VINEYARD
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">AI Control System</p>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer mx-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
            !isOffline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            {!isOffline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>LIVE SYSTEM ACTIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>OFFLINE – EDGE SYNC</span>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}