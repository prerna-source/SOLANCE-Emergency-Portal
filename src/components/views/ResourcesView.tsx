import React from 'react';
import {
  Boxes,
  Truck,
  Home,
  Heart,
  MapPin,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ResourcesView: React.FC = () => {
  const { state, dispatchTeam } = useSimulation();
  const isLight = state.theme === 'light';

  return (
    <div className="space-y-6">
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
            <Boxes className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Resource Inventory & Logistics Command</span>
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Active tracking for Rescue Fleets, Mass Shelters, and Emergency Trauma Centers.
          </p>
        </div>
      </div>

      {/* 1. Rescue Teams Section */}
      <div>
        <h3
          className={`text-sm font-bold uppercase font-mono tracking-wider mb-3 flex items-center space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Deployed Rescue Squads & Heavy Equipment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.rescueTeams.map((team) => (
            <div
              key={team.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-[#131a2a] border-[#1e293b] text-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {team.callsign}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      team.status === 'deployed'
                        ? isLight
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : team.status === 'en_route'
                        ? isLight
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : isLight
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {team.status.toUpperCase()}
                  </span>
                </div>

                <p
                  className={`text-xs font-semibold mb-1 ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {team.vehicleType}
                </p>
                <p
                  className={`text-[11px] flex items-center space-x-1 mb-2 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">{team.location}</span>
                </p>

                <div
                  className={`p-2 rounded-lg border text-[10px] font-mono space-y-1 mb-2 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#0e1424] border-[#1e2b45]'
                  }`}
                >
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Leader:</span>
                    <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}>
                      {team.leader}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Personnel:</span>
                    <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-200'}>
                      {team.personnel} operatives
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Telemetry Battery:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {team.batteryPercent}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono text-slate-400 block">
                    Specialized Gear:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {team.equipment.map((eq) => (
                      <span
                        key={eq}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                          isLight
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-[#182238] text-slate-300 border-[#2a3b5c]'
                        }`}
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`pt-2 border-t ${
                  isLight ? 'border-slate-200' : 'border-[#1e293b]'
                }`}
              >
                <button
                  onClick={() => dispatchTeam(team.id, state.selectedIncidentId)}
                  className={`w-full py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                    isLight
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  Reassign / Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Shelters Section */}
      <div>
        <h3
          className={`text-sm font-bold uppercase font-mono tracking-wider mb-3 flex items-center space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Evacuation Shelters & Relief Camps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.shelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);
            return (
              <div
                key={shelter.id}
                className={`p-4 rounded-xl border space-y-3 shadow-sm hover:shadow-md transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-[#131a2a] border-[#1e293b] text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-sm font-bold truncate ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {shelter.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      occupancyPct >= 90
                        ? isLight
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : occupancyPct >= 70
                        ? isLight
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : isLight
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {occupancyPct}% FULL
                  </span>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {shelter.location}
                </p>

                {/* Occupancy Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                      Occupancy:
                    </span>
                    <span
                      className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}
                    >
                      {shelter.currentOccupancy} / {shelter.totalCapacity}
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 overflow-hidden border ${
                      isLight
                        ? 'bg-slate-100 border-slate-200'
                        : 'bg-[#0e1424] border-[#1e293b]'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        occupancyPct >= 90
                          ? 'bg-red-500'
                          : occupancyPct >= 70
                          ? 'bg-amber-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#0e1424] border-[#1e2b45]'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                      Medical Station:
                    </span>
                    <span
                      className={
                        shelter.medicalAidAvailable
                          ? isLight
                            ? 'text-emerald-700 font-bold'
                            : 'text-emerald-400'
                          : 'text-slate-400'
                      }
                    >
                      {shelter.medicalAidAvailable ? 'Active Staffed' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                      Rations Remaining:
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {shelter.foodSuppliesDays} Days
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Hospitals Section */}
      <div>
        <h3
          className={`text-sm font-bold uppercase font-mono tracking-wider mb-3 flex items-center space-x-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Trauma Centers & Hospital Bed Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className={`p-4 rounded-xl border space-y-3 shadow-sm hover:shadow-md transition-all ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-[#131a2a] border-[#1e293b] text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4
                  className={`text-sm font-bold truncate ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {hosp.name}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isLight
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  LEVEL {hosp.traumaCenterLevel} TRAUMA
                </span>
              </div>

              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {hosp.location}
              </p>

              <div
                className={`p-3 rounded-lg border grid grid-cols-2 gap-3 text-center font-mono ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0e1424] border-[#1e2b45]'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] block ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    Total Beds
                  </span>
                  <span
                    className={`font-bold text-base ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {hosp.totalBeds}
                  </span>
                </div>
                <div className={`border-l ${isLight ? 'border-slate-200' : 'border-[#1e2b45]'}`}>
                  <span
                    className={`text-[10px] block ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    ICU Beds Free
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    {hosp.icuBedsAvailable}
                  </span>
                </div>
              </div>

              <div
                className={`flex items-center justify-between text-xs font-mono ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <span>Triage Load:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold uppercase">
                  {hosp.triageStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
