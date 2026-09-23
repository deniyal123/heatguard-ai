import React from 'react';
import { User, ShieldCheck, Heart, Save, CheckCircle2 } from 'lucide-react';

export default function UserProfile({ profile, setProfile, onSave }) {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (onSave) onSave(profile);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Vulnerable Individual Baseline Profile</h2>
          <p className="text-xs text-slate-400">Configure physiological baseline and vulnerability indicators</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Full Name / Subject ID</label>
            <input
              type="text"
              value={profile.name || 'John Doe (Outdoor Worker)'}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Occupation Category</label>
            <select
              value={profile.occupation || 'Outdoor Construction'}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Outdoor Construction">Outdoor Construction / Heavy Work</option>
              <option value="Agriculture / Farming">Agriculture / Farming</option>
              <option value="Athlete / Physical Training">Athlete / Physical Training</option>
              <option value="Elderly Resident">Elderly Resident (High Risk)</option>
              <option value="Military / First Responder">Military / First Responder</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Baseline Resting HR (BPM)</label>
            <input
              type="number"
              value={profile.baselineHR || 72}
              onChange={(e) => setProfile({ ...profile, baselineHR: parseInt(e.target.value) })}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Emergency Supervisor Phone</label>
            <input
              type="text"
              value={profile.supervisorPhone || '+1 (555) 019-2834'}
              onChange={(e) => setProfile({ ...profile, supervisorPhone: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="font-semibold text-slate-300 block">Pre-Existing Risk Factors</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Cardiovascular Condition', 'Hypertension', 'Previous Heat Exhaustion', 'Acclimatized to Heat'].map((cond) => (
              <label key={cond} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 cursor-pointer">
                <input type="checkbox" defaultChecked={cond.includes('Construction') || cond.includes('Previous')} className="accent-teal-500" />
                <span>{cond}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Settings</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
