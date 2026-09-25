import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Clock, Info, Bell, FileText, Check, ArrowUpRight } from 'lucide-react';

export default function RiskResultCard({ result, onNotifyCaregiver }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!result) return null;

  const { risk_class, probability, contributing_factors, recommended_action, timestamp, input_summary } = result;

  const riskConfig = {
    'Low risk': { cardBg:'bg-emerald-50/70 border-emerald-200', badge:'risk-low-badge', text:'text-emerald-800', meterColor:'bg-emerald-500', icon:ShieldCheck, iconBg:'bg-emerald-100 text-emerald-700' },
    'Moderate risk': { cardBg:'bg-amber-50/70 border-amber-200', badge:'risk-moderate-badge', text:'text-amber-800', meterColor:'bg-amber-500', icon:AlertTriangle, iconBg:'bg-amber-100 text-amber-700' },
    'High risk': { cardBg:'bg-orange-50/70 border-orange-200', badge:'risk-orange-badge', text:'text-orange-800', meterColor:'bg-orange-500', icon:AlertTriangle, iconBg:'bg-orange-100 text-orange-700' },
    'Very high risk': { cardBg:'bg-rose-50/80 border-rose-300', badge:'risk-veryhigh-badge', text:'text-rose-900', meterColor:'bg-rose-600', icon:AlertOctagon, iconBg:'bg-rose-100 text-rose-700' }
  };

  const cfg = riskConfig[risk_class] || riskConfig['Low risk'];
  const Icon = cfg.icon;
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  return (
    <div className={`card-healthcare p-5 sm:p-6 border ${cfg.cardBg} space-y-5 transition-all`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${cfg.iconBg} shadow-sm`}><Icon className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Latest assessment</div>
            <h2 className={`text-2xl font-black tracking-tight ${cfg.text}`}>{risk_class}</h2>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Updated {formattedTime}</div>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.badge}`}>{probability}% risk</div>
      </div>

      <div className="p-4 rounded-2xl bg-white/80 border border-white/80 shadow-sm">
        <div className="flex items-end justify-between mb-2">
          <div><span className="text-[10px] text-slate-500 block">Risk probability</span><span className={`text-3xl font-black tracking-tight ${cfg.text}`}>{probability}%</span></div>
          <ArrowUpRight className={`w-5 h-5 ${cfg.text}`} />
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${cfg.meterColor}`} style={{ width:`${Math.max(5, Math.min(100, probability))}%` }} /></div>
        <div className="flex justify-between mt-1.5 text-[9px] font-semibold text-slate-400 font-mono"><span>Low</span><span>Moderate</span><span>Critical</span></div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-teal-600" />Recommended action</span>
          <span className="text-[10px] text-slate-400 font-mono">{formattedTime}</span>
        </div>
        <p className={`text-sm font-bold ${cfg.text} leading-relaxed`}>“{recommended_action}”</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button onClick={() => setAcknowledged(!acknowledged)} className={`px-3 py-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${acknowledged ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}><Check className="w-3.5 h-3.5" />{acknowledged ? 'Acknowledged' : 'Acknowledge'}</button>
          <button onClick={onNotifyCaregiver} className="px-3 py-2 rounded-xl border border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100 text-[11px] font-semibold flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" />Notify caregiver</button>
          <button onClick={() => setShowDetailsModal(!showDetailsModal)} className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[11px] font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" />Details</button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 flex items-center gap-1.5"><Info className="w-4 h-4 text-teal-600" />What influenced this result?</h4>
        <div className="grid gap-2">
          {(contributing_factors || []).map((factor, idx) => (
            <div key={idx} className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs flex items-center gap-2 shadow-sm">
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.meterColor}`} />
              <span className="font-medium text-slate-800">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {showDetailsModal && (
        <div className="p-4 bg-[#10233f] text-slate-100 rounded-2xl text-[11px] space-y-2 font-mono">
          <div className="font-bold text-teal-300 border-b border-white/10 pb-2 flex items-center gap-2"><FileText className="w-3.5 h-3.5" />Technical assessment summary</div>
          <div><strong>Inputs:</strong> {input_summary}</div>
          <div><strong>Engine:</strong> Random Forest Classifier (Synthetic Demo)</div>
          <div><strong>Timestamp:</strong> {timestamp}</div>
        </div>
      )}
    </div>
  );
}
