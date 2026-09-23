import React from 'react';
import { ShieldAlert, Activity, History, Bell, Settings, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'assessment', label: 'Risk assessment', icon: ShieldAlert, active: true },
    { id: 'monitoring', label: 'Live monitoring', icon: Activity, active: false },
    { id: 'history', label: 'Prediction history', icon: History, active: false },
    { id: 'caregiver', label: 'Caregiver alerts', icon: Bell, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: false },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">HeatGuard AI</h1>
            <span className="text-[11px] text-teal-400 font-medium">Early Warning System</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-200" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Disclaimer & Version */}
      <div className="p-4 m-4 rounded-xl bg-slate-850 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="font-bold text-slate-300">Hackathon Prototype</div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Early-warning decision support system.
        </p>
        <div className="pt-2 text-[10px] text-teal-400 font-mono">v1.0.4 (Random Forest)</div>
      </div>
    </aside>
  );
}
