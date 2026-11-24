import React from 'react';
import {
  Boxes,
  Truck,
  Home,
  Heart,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ResourcesView: React.FC = () => {
  const { state, dispatchTeam } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span>Resource Inventory & Logistics Command</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active tracking for Rescue Fleets, Mass Shelters, and Emergency Trauma Centers.
          </p>
        </div>
      </div>

      {/* 1. Rescue Teams Section */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3 flex items-center space-x-2">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Deployed Rescue Squads & Heavy Equipment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.rescueTeams.map((team) => (
            <div
              key={team.id}
              className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {team.callsign}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      team.status === 'deployed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : team.status === 'en_route'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {team.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-semibold mb-1">{team.vehicleType}</p>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1 mb-2">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{team.location}</span>
                </p>

                <div className="p-2 rounded-lg bg-[#0e1424] border border-[#1e2b45] text-[10px] font-mono space-y-1 mb-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Leader:</span>
                    <span className="text-slate-200">{team.leader}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Personnel:</span>
                    <span className="text-slate-200">{team.personnel} operatives</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Telemetry Battery:</span>
                    <span className="text-emerald-400 font-bold">{team.batteryPercent}%</span>
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
                        className="px-1.5 py-0.5 rounded bg-[#182238] text-[9px] font-mono text-slate-300"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e293b]">
                <button
                  onClick={() => dispatchTeam(team.id, state.selectedIncidentId)}
                  className="w-full py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold transition-all"
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
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3 flex items-center space-x-2">
          <Home className="w-4 h-4 text-purple-400" />
          <span>Evacuation Shelters & Relief Camps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.shelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);
            return (
              <div
                key={shelter.id}
                className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">{shelter.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      occupancyPct >= 90
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : occupancyPct >= 70
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {occupancyPct}% FULL
                  </span>
                </div>

                <p className="text-xs text-slate-400">{shelter.location}</p>

                {/* Occupancy Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="text-white font-bold">
                      {shelter.currentOccupancy} / {shelter.totalCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-[#0e1424] rounded-full h-2 overflow-hidden border border-[#1e293b]">
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

                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45] text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Medical Station:</span>
                    <span className={shelter.medicalAidAvailable ? 'text-emerald-400' : 'text-slate-500'}>
                      {shelter.medicalAidAvailable ? 'Active Staffed' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rations Remaining:</span>
                    <span className="text-amber-400 font-bold">{shelter.foodSuppliesDays} Days</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Hospitals Section */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-3 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-cyan-400" />
          <span>Trauma Centers & Hospital Bed Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {state.hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white truncate">{hosp.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  LEVEL {hosp.traumaCenterLevel} TRAUMA
                </span>
              </div>

              <p className="text-xs text-slate-400">{hosp.location}</p>

              <div className="p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45] grid grid-cols-2 gap-3 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Beds</span>
                  <span className="text-white font-bold text-base">{hosp.totalBeds}</span>
                </div>
                <div className="border-l border-[#1e2b45]">
                  <span className="text-[10px] text-slate-400 block">ICU Beds Free</span>
                  <span className="text-emerald-400 font-bold text-base">
                    {hosp.icuBedsAvailable}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Triage Load:</span>
                <span className="text-amber-400 font-bold uppercase">{hosp.triageStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
