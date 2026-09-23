import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RiskForm from './components/RiskForm';
import RiskResultCard from './components/RiskResultCard';
import HistoryTable from './components/HistoryTable';
import LiveTelemetry from './components/LiveTelemetry';
import CaregiverHub from './components/CaregiverHub';
import ModelMetricsView from './components/ModelMetricsView';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [health, setHealth] = useState(null);

  // Initial Form Data
  const initialForm = {
    temperature: 28.0,
    humidity: 55.0,
    wbgt: 24.0,
    age: 35,
    activity: 'Moderate work',
    hydration: 'Good',
    heart_rate: 85,
    symptoms: 'None'
  };

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchHealth = () => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => {
        console.error('Health fetch failed:', err);
        setHealth({ status: 'offline', python_ml_status: 'offline' });
      });
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (e, customData = null) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = customData || formData;

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details?.join(', ') || 'Prediction request failed');
      }

      const data = await res.json();
      setResult(data);

      if (data.risk_class === 'Very high risk') {
        showToast('🚨 Critical Warning: Very High Risk detected! Emergency protocol recommended.', 'danger');
      } else if (data.risk_class === 'High risk') {
        showToast('⚠️ High Risk Warning: Immediate rest & shade required.', 'warning');
      } else {
        showToast('✅ Heat risk assessment calculated.', 'success');
      }

    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Unable to communicate with API server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setResult(null);
    setError(null);
    showToast('Form reset to default parameters.', 'info');
  };

  const handleApplyPreset = (presetData) => {
    setFormData(presetData);
    handlePredict(null, presetData);
  };

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 selection:bg-teal-600 selection:text-white">
      
      {/* Left Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Right Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header health={health} />

        {/* Disclaimer Banner */}
        <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 text-center font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Disclaimer:</strong> HeatGuard AI provides early-warning support and does not replace professional medical care.
          </span>
        </div>

        {/* Toast Popup Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className={`px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold flex items-center gap-2 ${
              toast.type === 'danger' ? 'bg-rose-900 text-white border-rose-700' :
              toast.type === 'warning' ? 'bg-amber-900 text-white border-amber-700' :
              'bg-slate-900 text-white border-slate-700'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{toast.msg}</span>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Main Title & Subtitle */}
          {activeTab === 'assessment' && (
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Heat risk assessment</h1>
              <p className="text-xs text-slate-500 max-w-2xl">
                Enter environmental metrics, individual demographics, and physiological signals to compute early-warning heat strain risk and personalized actions.
              </p>
            </div>
          )}

          {/* Error Alert Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-rose-700 underline text-xs">Dismiss</button>
            </div>
          )}

          {/* PAGE 1: Risk Assessment */}
          {activeTab === 'assessment' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Side */}
              <div className="lg:col-span-7">
                <RiskForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handlePredict}
                  onReset={handleReset}
                  isLoading={isLoading}
                  onApplyPreset={handleApplyPreset}
                />
              </div>

              {/* Result Side */}
              <div className="lg:col-span-5 space-y-6">
                {result ? (
                  <RiskResultCard
                    result={result}
                    onNotifyCaregiver={() => {
                      showToast('Caregiver notified of risk alert.', 'warning');
                    }}
                  />
                ) : (
                  <div className="card-healthcare p-8 text-center text-slate-500 space-y-3">
                    <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-800">No Assessment Computed Yet</h3>
                      <p className="text-xs text-slate-500">
                        Adjust the form parameters or select a <strong>Demo Scenario</strong> to evaluate risk.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* PAGE 2: Live Telemetry Tab */}
          {activeTab === 'monitoring' && <LiveTelemetry />}

          {/* PAGE 3: Prediction History Tab */}
          {activeTab === 'history' && <HistoryTable />}

          {/* PAGE 4: Caregiver Dispatch Hub */}
          {activeTab === 'caregiver' && (
            <CaregiverHub
              onSendAlertSuccess={() => showToast('Caregiver emergency dispatch activated.', 'warning')}
            />
          )}

          {/* PAGE 5: AI Model Metrics & Settings */}
          {activeTab === 'settings' && <ModelMetricsView />}

          {/* History Log below assessment on main page for hackathon convenience */}
          {activeTab === 'assessment' && (
            <div className="pt-4">
              <HistoryTable />
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>HeatGuard AI</strong> • Healthcare Early-Warning System
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              React Vite • Express API • FastAPI ML Service
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
