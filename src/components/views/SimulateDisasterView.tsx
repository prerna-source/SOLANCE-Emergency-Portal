import React from 'react';
import {
  Flame,
  Radio,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScenarioType } from '../../types';

export const SimulateDisasterView: React.FC = () => {
  const {
    state,
    setScenario,
    toggleSimulation,
    setSpeed,
    setDisasterType,
    setMagnitude,
    toggleRouteBlock,
    toggleRouteVerification,
    resetSimulation,
    setActiveTab,
    aiRecommendation,
  } = useSimulation();

  const scenarios: {
    id: ScenarioType;
    title: string;
    description: string;
    behavior: string;
    badge: string;
    badgeStyle: string;
    expectedResult: string;
  }[] = [
    {
      id: 'scenario-a',
      title: 'Scenario A: Blocked Primary → Verified Alternative',
      description: 'Primary NH-48 corridor is blocked by a massive landslide at Mile 14. An alternative corridor (South Ridge Bypass B-7) exists in map data and is actively verified clear by UAV-03 recon telemetry.',
      behavior: 'SOLACE AI reports primary blockage, identifies South Ridge Bypass B-7, confirms VERIFIED status, and issues formal dispatch clearance.',
      badge: 'VERIFIED ROUTE',
      badgeStyle: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      expectedResult: 'Recommendation: USE_ALTERNATIVE_VERIFIED',
    },
    {
      id: 'scenario-b',
      title: 'Scenario B: Blocked Primary → Unverified Alternative',
      description: 'Primary NH-48 is blocked due to structural overpass fissures. An alternative corridor exists in municipal GIS data, but has NO sensor or field confirmation.',
      behavior: 'SOLACE AI reports primary blockage, displays alternative corridor as "Possible Route", but explicitly badges it UNVERIFIED and warns against heavy transport without prior scouting.',
      badge: 'UNVERIFIED ROUTE',
      badgeStyle: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      expectedResult: 'Recommendation: CAUTION_ALTERNATIVE_UNVERIFIED',
    },
    {
      id: 'scenario-c',
      title: 'Scenario C: Total Isolation → Insufficient Information',
      description: 'Primary NH-48 is severed and all secondary bypasses are either destroyed or absent from the municipal graph database.',
      behavior: 'SOLACE AI strictly refuses to fabricate or hallucinate nonexistent roads. It states: "Insufficient information to identify an alternative route. Manual reconnaissance required."',
      badge: 'STRICT ZERO-HALLUCINATION',
      badgeStyle: 'bg-red-500/20 text-red-400 border-red-500/40',
      expectedResult: 'Recommendation: INSUFFICIENT_INFORMATION',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#17223b] via-[#131b2e] to-[#101626] border border-[#2a3b5c] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide text-white font-mono">
                Disaster Simulation Studio & Scenario Evaluator
              </h2>
              <p className="text-xs text-slate-300">
                Interactive disaster physics sandbox to demonstrate SOLACE AI strict verification guardrails live.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => toggleSimulation()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
              state.isRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {state.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{state.isRunning ? 'PAUSE SIMULATION' : 'RESUME SIMULATION'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#182238] border border-[#2a3b5c] text-slate-300 hover:text-white text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 3 Core Scenarios for Project Presentation */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Interactive Demo Scenarios (Select to Trigger Live AI Behavior)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scn) => {
            const isActive = state.activeScenario === scn.id;
            return (
              <div
                key={scn.id}
                onClick={() => setScenario(scn.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-[#1b253f] to-[#12192c] border-red-500 shadow-xl ring-2 ring-red-500/50'
                    : 'bg-[#131a2a] border-[#1e293b] hover:border-slate-500 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      {scn.id.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${scn.badgeStyle}`}>
                      {scn.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                    {scn.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {scn.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45] text-xs space-y-1 mb-3">
                    <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block">
                      SOLACE AI Response:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {scn.behavior}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono">
                  <span className="text-red-400 font-semibold">{scn.expectedResult}</span>
                  <span className="text-cyan-400 font-bold flex items-center space-x-1">
                    <span>{isActive ? '● ACTIVE' : 'ACTIVATE →'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Disaster Parameters & Road Graph Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Disaster Sliders */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazard Parameters</span>
          </h4>

          {/* Hazard Type Selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
              DISASTER CLASSIFICATION:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Earthquake', 'Flash Flood', 'Landslide', 'Cyclone'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDisasterType(type)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-all text-left ${
                    state.disasterType === type
                      ? 'bg-red-500/20 text-red-300 border-red-500'
                      : 'bg-[#0e1424] text-slate-400 border-[#1e2b45] hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Earthquake Magnitude Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Seismic Magnitude (Richter):</span>
              <span className="text-red-400 font-bold text-sm">M{state.earthquakeMagnitude}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="8.5"
              step="0.1"
              value={state.earthquakeMagnitude}
              onChange={(e) => setMagnitude(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#0e1424] rounded-lg appearance-none cursor-pointer accent-red-500 border border-[#1e293b]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>M5.0 Moderate</span>
              <span>M6.8 Severe</span>
              <span>M8.5 Catastrophic</span>
            </div>
          </div>

          {/* Active AI Recommendation Preview */}
          <div className="p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
              Live AI Decision State:
            </span>
            <div className="text-xs font-bold text-white font-mono mb-1">
              {aiRecommendation.recommendationDecision}
            </div>
            <p className="text-[11px] text-slate-300 leading-snug line-clamp-3">
              {aiRecommendation.detailedProtocol}
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mt-2 text-cyan-400 text-xs font-mono hover:underline flex items-center space-x-1"
            >
              <span>View On Live Tactical Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Road Network State Editor Table */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-[#131a2a] border border-[#1e293b]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Road Network Artery Status Table (Ground Truth Graph)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {state.routes.length} Monitored Segments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1424] text-slate-400 uppercase text-[10px] border-b border-[#1e293b]">
                <tr>
                  <th className="py-2.5 px-3">Corridor Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Dist/ETA</th>
                  <th className="py-2.5 px-3">Passability</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {state.routes.map((route) => (
                  <tr key={route.id} className="hover:bg-[#182238] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <div>{route.name}</div>
                      {route.blockageReason && (
                        <div className="text-[10px] text-red-400 truncate max-w-xs font-sans">
                          {route.blockageReason}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] text-slate-400">
                      {route.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {route.distanceKm}km / {route.estimatedMinutes}m
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          route.status === 'blocked'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {route.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          route.verified
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {route.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => toggleRouteBlock(route.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          route.status === 'blocked'
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {route.status === 'blocked' ? 'Clear' : 'Block'}
                      </button>
                      <button
                        onClick={() => toggleRouteVerification(route.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          route.verified
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        }`}
                      >
                        {route.verified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
