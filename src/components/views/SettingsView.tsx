import React from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  RefreshCw,
  BellRing,
  Sun,
  Moon,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SettingsView: React.FC = () => {
  const { state, toggleAudio, resetSimulation, toggleTheme } = useSimulation();
  const isLight = state.theme === 'light';

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#131a2a] border-[#1e293b]'
        }`}
      >
        <div>
          <h2
            className={`text-base font-bold font-mono flex items-center space-x-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <Settings className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            <span>SOLACE System Configuration & Parameters</span>
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Command terminal preferences, visual theme styling, and telemetry frequencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Theme Mode (White / Dark) */}
        <div
          className={`p-4 rounded-xl border space-y-3 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Display Theme Styling</span>
          </h3>

          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <div>
              <span
                className={`text-xs font-semibold block ${
                  isLight ? 'text-slate-800' : 'text-white'
                }`}
              >
                {isLight ? 'Crisp White Theme (Light Mode)' : 'Tactical Command Center (Dark Mode)'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Toggle between high-contrast white background and dark tactical HUD
              </span>
            </div>
            <button
              onClick={() => toggleTheme()}
              className={`p-2 rounded-lg border font-mono text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-cyan-400" />}
              <span>{isLight ? 'Light Active' : 'Dark Active'}</span>
            </button>
          </div>
        </div>

        {/* Tactical Audio & Alerts */}
        <div
          className={`p-4 rounded-xl border space-y-3 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <BellRing className="w-4 h-4 text-amber-500" />
            <span>Tactical Sound & Alert Tones</span>
          </h3>

          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <div>
              <span
                className={`text-xs font-semibold block ${
                  isLight ? 'text-slate-800' : 'text-white'
                }`}
              >
                Web Audio Tactical Sound Effects
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time radar pings, dispatch fanfares, and warning sirens
              </span>
            </div>
            <button
              onClick={() => toggleAudio()}
              className={`p-2 rounded-lg border transition-all ${
                state.audioAlertsEnabled
                  ? isLight
                    ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
                    : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : isLight
                  ? 'bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-[#182238] border-[#2a3b5c] text-slate-400'
              }`}
            >
              {state.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Anti-Hallucination Guardrails Policy */}
        <div
          className={`p-4 rounded-xl border space-y-3 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Strict Verification Guardrails</span>
          </h3>

          <div
            className={`p-3 rounded-lg border space-y-2 text-xs font-mono ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-[#0e1424] border-[#1e2b45] text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Zero-Hallucination Lock:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% ENFORCED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Route Verification Gate:</span>
              <span className="text-sky-600 dark:text-cyan-400 font-bold">STRICT BOOLEAN</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Refusal Threshold:</span>
              <span className="text-red-600 dark:text-red-400 font-bold">ZERO SPECULATION</span>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines Directory */}
        <div
          className={`p-4 rounded-xl border space-y-3 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-red-500" />
            <span>Emergency Lifeline Contacts</span>
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'National Emergency Response', num: '112' },
              { name: 'NDRF Central Command Cell', num: '011-24363260' },
              { name: 'Disaster Medical Ambulance', num: '108' },
              { name: 'Fire & Hazmat Dispatch', num: '101' },
            ].map((contact, idx) => (
              <div
                key={idx}
                className={`p-2 rounded border flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0e1424] border-[#1e2b45]'
                }`}
              >
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                  {contact.name}
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold">{contact.num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operator Profile & Reset */}
        <div
          className={`p-4 rounded-xl border space-y-3 flex flex-col justify-between md:col-span-2 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <div>
            <h3
              className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 mb-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <span>Operator Authentication</span>
            </h3>

            <div
              className={`p-3 rounded-lg border space-y-1 text-xs font-mono ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#0e1424] border-[#1e2b45]'
              }`}
            >
              <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Cmdr. V. Sharma
              </div>
              <div className="text-slate-500 text-[11px]">Badge: INC-CMD-NORTH-01</div>
              <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                Access Level: Tier-1 Incident Commander
              </div>
            </div>
          </div>

          <button
            onClick={resetSimulation}
            className={`w-full py-2 rounded-lg border text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 mt-2 ${
              isLight
                ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                : 'bg-red-600/20 hover:bg-red-600/30 border-red-500/40 text-red-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge Memory & Reset Simulation Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
