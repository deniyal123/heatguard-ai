import React, { useState } from 'react';
import { Thermometer, Droplets, Sun, User, Activity, Heart, AlertCircle, RotateCcw, Play, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RiskForm({ formData, setFormData, onSubmit, onReset, isLoading, onApplyPreset }) {
  const [validationError, setValidationError] = useState(null);

  const presets = [
    {
      id: 'low',
      label: 'Preset 1: Low Risk (Normal conditions)',
      data: {
        temperature: 24,
        humidity: 45,
        wbgt: 20,
        age: 28,
        activity: 'Resting',
        hydration: 'Good',
        heart_rate: 72,
        symptoms: 'None'
      }
    },
    {
      id: 'high',
      label: 'Preset 2: High Risk (Elevated strain)',
      data: {
        temperature: 34,
        humidity: 75,
        wbgt: 31,
        age: 55,
        activity: 'Moderate work',
        hydration: 'Uncertain',
        heart_rate: 118,
        symptoms: 'Dizziness'
      }
    },
    {
      id: 'veryhigh',
      label: 'Preset 3: Very High Risk (Severe heat stroke warning)',
      data: {
        temperature: 39,
        humidity: 82,
        wbgt: 35,
        age: 68,
        activity: 'Heavy work',
        hydration: 'Low',
        heart_rate: 145,
        symptoms: 'Confusion'
      }
    }
  ];

  const handleInputChange = (field, value) => {
    setValidationError(null);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const found = presets.find(p => p.id === selectedId);
    if (found) {
      onApplyPreset(found.data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation checks
    if (formData.heart_rate < 30 || formData.heart_rate > 220) {
      setValidationError('Heart rate must be between 30 and 220 BPM.');
      return;
    }
    if (formData.temperature < 0 || formData.temperature > 60) {
      setValidationError('Temperature must be between 0 and 60°C.');
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="card-healthcare p-6 space-y-6">
      
      {/* Top Bar: Preset Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Enter Assessment Parameters</h3>
          <p className="text-xs text-slate-500">Provide 8 environmental & physiological indicators</p>
        </div>

        {/* Demo Preset Dropdown */}
        <div className="w-full sm:w-auto">
          <select
            onChange={handlePresetSelect}
            defaultValue=""
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="" disabled>⚡ Use demo scenario...</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Validation Alert */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* GROUP 1: Environmental conditions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
            <Thermometer className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Environmental conditions
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Temperature */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Ambient Temp (°C)</label>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {formData.temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="48"
                step="0.5"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full accent-teal-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18°C</span>
                <span>33°C</span>
                <span>48°C</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Humidity (%)</label>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {formData.humidity}%
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                step="1"
                value={formData.humidity}
                onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15%</span>
                <span>55%</span>
                <span>95%</span>
              </div>
            </div>

            {/* WBGT */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">WBGT Index (°C)</label>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {formData.wbgt}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="42"
                step="0.5"
                value={formData.wbgt}
                onChange={(e) => handleInputChange('wbgt', parseFloat(e.target.value))}
                className="w-full accent-amber-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15°C (Safe)</span>
                <span>28°C (High)</span>
                <span>42°C</span>
              </div>
            </div>

          </div>
        </div>

        {/* GROUP 2: Personal factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
            <User className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Personal factors
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Age */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Age (Years)</label>
                <span className="font-mono font-bold text-slate-800 bg-slate-200/60 px-2 py-0.5 rounded">
                  {formData.age} yrs
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="85"
                step="1"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full accent-slate-700 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Activity level */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Activity level</label>
              <select
                value={formData.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Resting">Resting (Low exertion)</option>
                <option value="Moderate work">Moderate work (Outdoor labor)</option>
                <option value="Heavy work">Heavy work (Strenuous physical)</option>
              </select>
            </div>

            {/* Hydration status */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Hydration status</label>
              <select
                value={formData.hydration}
                onChange={(e) => handleInputChange('hydration', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Good">Good (Well hydrated)</option>
                <option value="Uncertain">Uncertain (Inadequate fluid intake)</option>
                <option value="Low">Low (Dehydrated)</option>
              </select>
            </div>

          </div>
        </div>

        {/* GROUP 3: Physiological signals */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
            <Heart className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Physiological signals
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Heart Rate */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Heart Rate (BPM)</label>
                <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {formData.heart_rate} BPM
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                step="1"
                value={formData.heart_rate}
                onChange={(e) => handleInputChange('heart_rate', parseInt(e.target.value))}
                className="w-full accent-rose-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Symptoms */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Reported Symptoms</label>
              <select
                value={formData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="None">None (No symptoms)</option>
                <option value="Dizziness">Dizziness</option>
                <option value="Headache">Headache</option>
                <option value="Nausea">Nausea</option>
                <option value="Confusion">Confusion (Severe Warning)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Action Buttons: Primary & Secondary */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Prediction...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Predict risk</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset form</span>
          </button>

        </div>

      </form>
    </div>
  );
}
