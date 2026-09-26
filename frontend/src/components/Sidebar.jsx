import React from 'react';
import { ShieldAlert, History, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'assessment', label: 'Risk management', icon: ShieldAlert },
    { id: 'history', label: 'Prediction history', icon: History },
  ];

  return (
    <aside className="w-64 h-screen overflow-hidden bg-[#10233f] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#1b3859]">
      <div>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-400 text-[#10233f] shadow-lg shadow-teal-400/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">HeatGuard AI</h1>
            <span className="text-[10px] text-teal-300 font-semibold tracking-wide">EARLY WARNING PLATFORM</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-[0.16em]">Workspace</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? 'bg-teal-500 text-[#10233f] shadow-lg shadow-teal-950/30' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3"><Icon className="w-4 h-4" /><span>{item.label}</span></div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-teal-300 text-[10px] font-bold uppercase tracking-wider"><Sparkles className="w-3.5 h-3.5" /> Prototype mode</div>
        <p className="text-[10px] text-slate-400 leading-relaxed">Synthetic predictions for demonstration and hackathon validation.</p>
        <div className="pt-1 text-[10px] text-slate-500 font-mono">v1.0.4 • Random Forest</div>
      </div>
    </aside>
  );
}
