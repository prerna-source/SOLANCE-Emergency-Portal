import React from 'react';
import {
  Flame,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ScenarioType } from '../../types';

export const SimulateDisasterView: React.FC = () => {
  const {
    state,
    setScenario,
    toggleSimulation,
    setDisasterType,
    setMagnitude,
    toggleRouteBlock,
    toggleRouteVerification,
    resetSimulation,
    setActiveTab,
    aiRecommendation,
  } = useSimulation();

  const isLight = state.theme === 'light';

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
      badgeStyle: isLight
        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      expectedResult: 'Recommendation: USE_ALTERNATIVE_VERIFIED',
    },
    {
      id: 'scenario-b',
      title: 'Scenario B: Blocked Primary → Unverified Alternative',
      description: 'Primary NH-48 is blocked due to structural overpass fissures. An alternative corridor exists in municipal GIS data, but has NO sensor or field confirmation.',
      behavior: 'SOLACE AI reports primary blockage, displays alternative corridor as "Possible Route", but explicitly badges it UNVERIFIED and warns against heavy transport without prior scouting.',
      badge: 'UNVERIFIED ROUTE',
      badgeStyle: isLight
        ? 'bg-amber-100 text-amber-800 border border-amber-300'
        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
      expectedResult: 'Recommendation: CAUTION_ALTERNATIVE_UNVERIFIED',
    },
    {
      id: 'scenario-c',
      title: 'Scenario C: Total Isolation → Insufficient Information',
      description: 'Primary NH-48 is severed and all secondary bypasses are either destroyed or absent from the municipal graph database.',
      behavior: 'SOLACE AI strictly refuses to fabricate or hallucinate nonexistent roads. It states: "Insufficient information to identify an alternative route. Manual reconnaissance required."',
      badge: 'STRICT ZERO-HALLUCINATION',
      badgeStyle: isLight
        ? 'bg-red-100 text-red-800 border border-red-300'
        : 'bg-red-500/20 text-red-400 border border-red-500/40',
      expectedResult: 'Recommendation: INSUFFICIENT_INFORMATION',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div
        className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-gradient-to-r from-[#17223b] via-[#131b2e] to-[#101626] border-[#2a3b5c]'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <div
              className={`p-2 rounded-lg border ${
                isLight
                  ? 'bg-red-100 text-red-600 border-red-200'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2
                className={`text-lg font-black tracking-wide font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Disaster Simulation Studio & Scenario Evaluator
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
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
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-colors ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#182238] border-[#2a3b5c] text-slate-300 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 3 Core Scenarios for Project Presentation */}
      <div>
        <h3
          className={`text-sm font-bold uppercase font-mono tracking-wider mb-3 flex items-center space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Interactive Demo Scenarios (Select to Trigger Live AI Behavior)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scn) => {
            const isActive = state.activeScenario === scn.id;
            return (
              <div
                key={scn.id}
                onClick={() => setScenario(scn.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isActive
                    ? isLight
                      ? 'bg-red-50/60 border-red-500 ring-2 ring-red-400 shadow-md'
                      : 'bg-gradient-to-b from-[#1b253f] to-[#12192c] border-red-500 shadow-xl ring-2 ring-red-500/50'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    : 'bg-[#131a2a] border-[#1e293b] hover:border-slate-500 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono font-bold uppercase ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {scn.id.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${scn.badgeStyle}`}>
                      {scn.badge}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-bold mb-2 leading-tight ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {scn.title}
                  </h4>
                  <p
                    className={`text-xs mb-3 leading-relaxed ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {scn.description}
                  </p>

                  <div
                    className={`p-2.5 rounded-lg border text-xs space-y-1 mb-3 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-[#0e1424] border-[#1e2b45]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono font-bold text-sky-600 dark:text-cyan-400 block">
                      SOLACE AI Response:
                    </span>
                    <p
                      className={`text-[11px] leading-snug ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {scn.behavior}
                    </p>
                  </div>
                </div>

                <div
                  className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                    isLight ? 'border-slate-200' : 'border-[#1e293b]'
                  }`}
                >
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {scn.expectedResult}
                  </span>
                  <span className="text-sky-600 dark:text-cyan-400 font-bold flex items-center space-x-1">
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
        <div
          className={`lg:col-span-4 p-4 rounded-xl border space-y-4 shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <h4
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Hazard Parameters</span>
          </h4>

          {/* Hazard Type Selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-500 block mb-1.5">
              DISASTER CLASSIFICATION:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Earthquake', 'Flash Flood', 'Landslide', 'Cyclone'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDisasterType(type)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-all text-left ${
                    state.disasterType === type
                      ? isLight
                        ? 'bg-red-50 text-red-800 border-red-300 font-bold'
                        : 'bg-red-500/20 text-red-300 border-red-500'
                      : isLight
                      ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                Seismic Magnitude (Richter):
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                M{state.earthquakeMagnitude}
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="8.5"
              step="0.1"
              value={state.earthquakeMagnitude}
              onChange={(e) => setMagnitude(parseFloat(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-600 border ${
                isLight ? 'bg-slate-200 border-slate-300' : 'bg-[#0e1424] border-[#1e293b]'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>M5.0 Moderate</span>
              <span>M6.8 Severe</span>
              <span>M8.5 Catastrophic</span>
            </div>
          </div>

          {/* Active AI Recommendation Preview */}
          <div
            className={`p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block mb-1">
              Live AI Decision State:
            </span>
            <div
              className={`text-xs font-bold font-mono mb-1 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {aiRecommendation.recommendationDecision}
            </div>
            <p
              className={`text-[11px] leading-snug line-clamp-3 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {aiRecommendation.detailedProtocol}
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`mt-2 text-xs font-mono hover:underline flex items-center space-x-1 ${
                isLight ? 'text-sky-700 font-semibold' : 'text-cyan-400'
              }`}
            >
              <span>View On Live Tactical Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Road Network State Editor Table */}
        <div
          className={`lg:col-span-8 p-4 rounded-xl border shadow-sm transition-colors duration-200 ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#131a2a] border-[#1e293b]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h4
              className={`text-xs font-bold uppercase font-mono tracking-wider ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Road Network Artery Status Table (Ground Truth Graph)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {state.routes.length} Monitored Segments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead
                className={`uppercase text-[10px] border-b ${
                  isLight
                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                    : 'bg-[#0e1424] text-slate-400 border-[#1e293b]'
                }`}
              >
                <tr>
                  <th className="py-2.5 px-3">Corridor Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Dist/ETA</th>
                  <th className="py-2.5 px-3">Passability</th>
                  <th className="py-2.5 px-3">Verification</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLight ? 'divide-slate-200' : 'divide-[#1e293b]'
                }`}
              >
                {state.routes.map((route) => (
                  <tr
                    key={route.id}
                    className={`transition-colors ${
                      isLight ? 'hover:bg-slate-50' : 'hover:bg-[#182238]'
                    }`}
                  >
                    <td
                      className={`py-2.5 px-3 font-semibold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      <div>{route.name}</div>
                      {route.blockageReason && (
                        <div className="text-[10px] text-red-600 dark:text-red-400 truncate max-w-xs font-sans">
                          {route.blockageReason}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] text-slate-400">
                      {route.type}
                    </td>
                    <td
                      className={`py-2.5 px-3 ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {route.distanceKm}km / {route.estimatedMinutes}m
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          route.status === 'blocked'
                            ? isLight
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isLight
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
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
                            ? isLight
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isLight
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {route.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => toggleRouteBlock(route.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          route.status === 'blocked'
                            ? isLight
                              ? 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : isLight
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {route.status === 'blocked' ? 'Clear' : 'Block'}
                      </button>
                      <button
                        onClick={() => toggleRouteVerification(route.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          route.verified
                            ? isLight
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : isLight
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
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
