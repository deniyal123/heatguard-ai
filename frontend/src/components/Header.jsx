import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, User, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function Header({ health }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPythonOnline = health?.python_ml_status === 'online';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        
        {/* Mobile Title Logo (Visible on mobile/tablet) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="p-1.5 rounded-lg bg-teal-600 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-base">HeatGuard AI</span>
        </div>

        {/* Date & Time */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono">{timeStr}</span>
        </div>

        {/* Top Header Indicators */}
        <div className="flex items-center gap-3">
          
          {/* Demo Mode Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Demo Mode Active</span>
          </div>

          {/* System API Status */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 font-medium">
            <span className={`w-2 h-2 rounded-full ${isPythonOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isPythonOnline ? 'Random Forest ML Online' : 'Rules Engine Fallback'}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SJ
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-bold text-slate-900 leading-tight">Dr. Sarah Jenkins</div>
              <div className="text-[10px] text-slate-500">Safety Supervisor</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
