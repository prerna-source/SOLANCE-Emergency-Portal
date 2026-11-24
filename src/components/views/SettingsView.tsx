import React from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  ShieldCheck,
  Cpu,
  Monitor,
  PhoneCall,
  UserCheck,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const SettingsView: React.FC = () => {
  const { state, toggleAudio, resetSimulation } = useSimulation();

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>SOLACE System Configuration & Parameters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Command terminal preferences, guardrail thresholds, and telemetry frequencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tactical Audio & Alerts */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>Tactical Sound & Alert Tones</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
            <div>
              <span className="text-xs font-semibold text-white block">
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
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-[#182238] border-[#2a3b5c] text-slate-400'
              }`}
            >
              {state.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Anti-Hallucination Guardrails Policy */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Verification Guardrails</span>
          </h3>

          <div className="p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Zero-Hallucination Lock:</span>
              <span className="text-emerald-400 font-bold">100% ENFORCED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Route Verification Gate:</span>
              <span className="text-cyan-400 font-bold">STRICT BOOLEAN</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Refusal Threshold:</span>
              <span className="text-red-400 font-bold">ZERO SPECULATION</span>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines Directory */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
            <PhoneCall className="w-4 h-4 text-red-400" />
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
                className="p-2 rounded bg-[#0e1424] border border-[#1e2b45] flex items-center justify-between"
              >
                <span className="text-slate-300">{contact.name}</span>
                <span className="text-red-400 font-bold">{contact.num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operator Profile & Reset */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5 mb-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Operator Authentication</span>
            </h3>

            <div className="p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45] space-y-1 text-xs font-mono">
              <div className="text-white font-bold">Cmdr. V. Sharma</div>
              <div className="text-slate-400 text-[11px]">Badge: INC-CMD-NORTH-01</div>
              <div className="text-emerald-400 text-[10px]">Access Level: Tier-1 Incident Commander</div>
            </div>
          </div>

          <button
            onClick={resetSimulation}
            className="w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 mt-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Purge Memory & Reset Simulation Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
