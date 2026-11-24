import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Users,
  Clock,
  Shield,
  Truck,
  Send,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { Incident, Severity } from '../../types';

export const IncidentsView: React.FC = () => {
  const { state, selectIncident, dispatchTeam, setActiveTab } = useSimulation();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedForModal, setSelectedForModal] = useState<Incident | null>(null);

  const filteredIncidents = state.incidents.filter((inc) => {
    if (filterSeverity === 'all') return true;
    return inc.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Incident Management & Triage Registry</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time incident log, casualty impact assessments, and tactical dispatch assignments.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#0e1424] p-1 rounded-lg border border-[#1e2b45] text-xs font-mono">
          {(['all', 'critical', 'high', 'moderate'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1 rounded transition-all font-semibold ${
                filterSeverity === lvl
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((incident) => {
          const isSelected = state.selectedIncidentId === incident.id;
          const assignedTeam = state.rescueTeams.find((t) => t.id === incident.assignedTeamId);

          return (
            <div
              key={incident.id}
              onClick={() => selectIncident(incident.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1b253f] to-[#12192c] border-red-500 shadow-xl ring-2 ring-red-500/50'
                  : 'bg-[#131a2a] border-[#1e293b] hover:border-slate-500 text-slate-300'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-red-400">
                    {incident.code}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${getSeverityBadge(
                        incident.severity
                      )}`}
                    >
                      {incident.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {incident.reportedTime}
                    </span>
                  </div>
                </div>

                {/* Title & Location */}
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                  {incident.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-3">
                  {incident.description}
                </p>

                {/* Casualty Metrics Box */}
                <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45] grid grid-cols-3 gap-2 text-center text-xs font-mono mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Affected</span>
                    <span className="text-white font-bold text-sm">{incident.peopleAffected}</span>
                  </div>
                  <div className="border-x border-[#1e2b45]">
                    <span className="text-[10px] text-slate-400 block">Trapped</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {incident.trappedCivilians}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Confirmed</span>
                    <span className="text-red-400 font-bold text-sm">
                      {incident.casualtiesConfirmed}
                    </span>
                  </div>
                </div>

                {/* Assigned Team */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unit:</span>
                  </span>
                  <span className="text-white font-semibold">
                    {assignedTeam ? assignedTeam.callsign : 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForModal(incident);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#182238] hover:bg-[#202e4c] border border-[#2a3b5c] text-cyan-400 text-xs font-mono font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Assign Unit</span>
                </button>
                <button
                  onClick={() => {
                    selectIncident(incident.id);
                    setActiveTab('dashboard');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-semibold transition-colors flex items-center space-x-1"
                >
                  <span>Map Focus →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      {selectedForModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#131a2a] border border-[#2a3b5c] rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <h3 className="text-sm font-bold text-white font-mono">
                Deploy Unit to {selectedForModal.code}
              </h3>
              <button
                onClick={() => setSelectedForModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select an available rescue squad to deploy to{' '}
              <span className="text-white font-semibold">{selectedForModal.title}</span>.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.rescueTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-lg bg-[#0e1424] border border-[#1e2b45] flex items-center justify-between hover:border-slate-500 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{team.callsign}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {team.type} • {team.personnel} personnel • Battery: {team.batteryPercent}%
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      dispatchTeam(team.id, selectedForModal.id);
                      setSelectedForModal(null);
                    }}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-semibold transition-colors"
                  >
                    Deploy
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedForModal(null)}
              className="w-full py-2 rounded-lg bg-[#182238] text-slate-300 text-xs font-mono hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
