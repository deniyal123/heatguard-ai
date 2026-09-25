import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Sparkles, Wifi, WifiOff } from 'lucide-react';

export default function Header({ health }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPythonOnline = health?.python_ml_status === 'online';

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-5 sm:px-7 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="md:hidden p-2 rounded-xl bg-teal-600 text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{timeStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-100 text-teal-800 rounded-full text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Demo workspace</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[11px] text-slate-600 font-medium">
            {isPythonOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden sm:inline">{isPythonOnline ? 'ML service online' : 'Rules fallback active'}</span>
            <span className="sm:hidden">{isPythonOnline ? 'Online' : 'Fallback'}</span>
          </div>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-[#dce8ff] text-[#3b55a1] flex items-center justify-center font-bold text-xs shadow-sm">
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
