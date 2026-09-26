import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Header() {
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

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 px-5 sm:px-7 py-4 shadow-sm shrink-0">
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-mono">{timeStr}</span>
        </div>
      </div>
    </header>
  );
}
