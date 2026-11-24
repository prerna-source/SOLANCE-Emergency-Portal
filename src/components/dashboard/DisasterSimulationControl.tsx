import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScenarioType } from '../../types';

export const DisasterSimulationControl: React.FC = () => {
  const {
    state,
    toggleSimulation,
    setSpeed,
    setScenario,
    toggleRouteBlock,
    toggleRouteVerification,
    resetSimulation,
  } = useSimulation();

  const primaryRoute = state.routes.find((r) => r.id === 'route-nh48-primary');
  const altRoute = state.routes.find((r) => r.id === 'route-south-ridge-alt');

  const scenarios: {
    id: ScenarioType;
    label: string;
    sublabel: string;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'scenario-a',
      label: 'Scenario A',
      sublabel: 'Blocked Primary → Verified Alt',
      badge: 'VERIFIED',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    },
    {
      id: 'scenario-b',
      label: 'Scenario B',
      sublabel: 'Blocked Primary → Unverified Alt',
      badge: 'UNVERIFIED',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    },
    {
      id: 'scenario-c',
      label: 'Scenario C',
      sublabel: 'Total Isolation → Insufficient Info',
      badge: 'NO ROUTE',
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40',
    },
  ];

  return (
    <div className="flex flex-col rounded-xl bg-[#131a2a] border border-[#1e293b] p-4 shadow-xl justify-between h-full">
      {/* Header with Play/Pause & Speed */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Disaster Simulation Control
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Real-time incident & road graph state
              </p>
            </div>
          </div>

          {/* Play/Pause & Speed */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleSimulation()}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                state.isRunning
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {state.isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>START</span>
                </>
              )}
            </button>

            {/* Speed Selection */}
            <div className="flex items-center bg-[#0e1424] rounded-lg border border-[#1e2b45] p-0.5 text-[10px] font-mono">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    state.speed === spd
                      ? 'bg-red-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Scenario Quick-Selector */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
              Demo Scenarios (One-Click Test):
            </span>
            <span className="text-[10px] font-mono text-slate-400">Project Pres. Modes</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {scenarios.map((scn) => {
              const isActive = state.activeScenario === scn.id;
              return (
                <button
                  key={scn.id}
                  onClick={() => setScenario(scn.id)}
                  className={`p-2 rounded-lg text-left transition-all border relative flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-br from-[#1a253e] to-[#141d33] border-red-500 shadow-md shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#0e1424] border-[#1e2b45] hover:border-slate-500 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-black font-mono text-white">{scn.label}</span>
                    <span className={`text-[8px] font-mono font-bold px-1 rounded ${scn.badgeColor}`}>
                      {scn.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium leading-tight">
                    {scn.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Road Network Switches */}
        <div className="mt-3 pt-2.5 border-t border-[#1e293b]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
            Manual Route State Overrides:
          </span>

          <div className="space-y-2">
            {/* Primary Route Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  NH-48 Primary Corridor
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  State:{' '}
                  <span
                    className={
                      primaryRoute?.status === 'blocked' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'
                    }
                  >
                    {primaryRoute?.status === 'blocked' ? 'BLOCKED (Landslide)' : 'CLEAR (Traffic Flowing)'}
                  </span>
                </span>
              </div>
              <button
                onClick={() => toggleRouteBlock('route-nh48-primary')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  primaryRoute?.status === 'blocked'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {primaryRoute?.status === 'blocked' ? 'Unblock Road' : 'Block Road'}
              </button>
            </div>

            {/* Alternative Route Toggle */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  South Ridge Bypass B-7
                </span>
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <span
                    className={
                      altRoute?.status === 'blocked' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'
                    }
                  >
                    {altRoute?.status === 'blocked' ? 'BLOCKED' : 'CLEAR'}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span
                    className={
                      altRoute?.verified ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                    }
                  >
                    {altRoute?.verified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => toggleRouteBlock('route-south-ridge-alt')}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    altRoute?.status === 'blocked'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {altRoute?.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
                <button
                  onClick={() => toggleRouteVerification('route-south-ridge-alt')}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    altRoute?.verified
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {altRoute?.verified ? 'Verified' : 'Unverify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
        <span>Active State: {state.activeScenario.toUpperCase()}</span>
        <button
          onClick={resetSimulation}
          className="text-cyan-400 hover:underline flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
};
