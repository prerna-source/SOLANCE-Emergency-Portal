import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  MapPin,
  Truck,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { Incident, Severity } from '../../types';

export const IncidentsView: React.FC = () => {
  const { state, selectIncident, dispatchTeam, setActiveTab } = useSimulation();
  const isLight = state.theme === 'light';
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedForModal, setSelectedForModal] = useState<Incident | null>(null);

  const filteredIncidents = state.incidents.filter((inc) => {
    if (filterSeverity === 'all') return true;
    return inc.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return isLight
          ? 'bg-red-100 text-red-800 border border-red-300'
          : 'bg-red-500/20 text-red-400 border border-red-500/40';
      case 'high':
        return isLight
          ? 'bg-orange-100 text-orange-800 border border-orange-300'
          : 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
      case 'moderate':
        return isLight
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'low':
        return isLight
          ? 'bg-sky-100 text-sky-800 border border-sky-300'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'resolved':
        return isLight
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition-colors duration-200 ${
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
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Incident Management & Triage Registry</span>
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Real-time incident log, casualty impact assessments, and tactical dispatch assignments.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div
          className={`flex items-center space-x-1.5 p-1 rounded-lg border text-xs font-mono ${
            isLight
              ? 'bg-slate-100 border-slate-200'
              : 'bg-[#0e1424] border-[#1e2b45]'
          }`}
        >
          {(['all', 'critical', 'high', 'moderate'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1 rounded transition-all font-semibold ${
                filterSeverity === lvl
                  ? 'bg-red-600 text-white'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
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
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md ${
                isSelected
                  ? isLight
                    ? 'bg-red-50/50 border-red-500 ring-2 ring-red-400 shadow-md'
                    : 'bg-gradient-to-b from-[#1b253f] to-[#12192c] border-red-500 shadow-xl ring-2 ring-red-500/50'
                  : isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  : 'bg-[#131a2a] border-[#1e293b] hover:border-slate-500 text-slate-300'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
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
                    <span
                      className={`text-[10px] font-mono ${
                        isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {incident.reportedTime}
                    </span>
                  </div>
                </div>

                {/* Title & Location */}
                <h3
                  className={`text-sm font-bold mb-1 leading-snug ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {incident.title}
                </h3>
                <p
                  className={`text-xs flex items-center space-x-1 mb-3 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">{incident.location}</span>
                </p>

                {/* Description */}
                <p
                  className={`text-xs mb-4 leading-relaxed line-clamp-3 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {incident.description}
                </p>

                {/* Casualty Metrics Box */}
                <div
                  className={`p-2.5 rounded-lg border grid grid-cols-3 gap-2 text-center text-xs font-mono mb-3 ${
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
                      Affected
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {incident.peopleAffected}
                    </span>
                  </div>
                  <div className={`border-x ${isLight ? 'border-slate-200' : 'border-[#1e2b45]'}`}>
                    <span
                      className={`text-[10px] block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Trapped
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                      {incident.trappedCivilians}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Confirmed
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                      {incident.casualtiesConfirmed}
                    </span>
                  </div>
                </div>

                {/* Assigned Team */}
                <div
                  className={`flex items-center justify-between text-xs font-mono mb-3 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Unit:</span>
                  </span>
                  <span
                    className={`font-semibold ${
                      isLight ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    {assignedTeam ? assignedTeam.callsign : 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-slate-200' : 'border-[#1e293b]'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForModal(incident);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-mono font-semibold transition-colors flex items-center justify-center space-x-1 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                      : 'bg-[#182238] hover:bg-[#202e4c] border-[#2a3b5c] text-cyan-400'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Assign Unit</span>
                </button>
                <button
                  onClick={() => {
                    selectIncident(incident.id);
                    setActiveTab('dashboard');
                  }}
                  className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-semibold transition-colors flex items-center space-x-1 shadow-sm"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`border rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#131a2a] border-[#2a3b5c] text-white'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-slate-200' : 'border-[#1e293b]'
              }`}
            >
              <h3 className="text-sm font-bold font-mono">
                Deploy Unit to {selectedForModal.code}
              </h3>
              <button
                onClick={() => setSelectedForModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Select an available rescue squad to deploy to{' '}
              <span className="font-semibold">{selectedForModal.title}</span>.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.rescueTeams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-[#0e1424] border-[#1e2b45] hover:border-slate-500'
                  }`}
                >
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {team.callsign}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {team.type} • {team.personnel} personnel • Battery: {team.batteryPercent}%
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      dispatchTeam(team.id, selectedForModal.id);
                      setSelectedForModal(null);
                    }}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-semibold transition-colors shadow-sm"
                  >
                    Deploy
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedForModal(null)}
              className={`w-full py-2 rounded-lg text-xs font-mono transition-colors ${
                isLight
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-[#182238] text-slate-300 hover:text-white'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
