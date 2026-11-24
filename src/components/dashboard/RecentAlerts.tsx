import React, { useState } from 'react';
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertNotification } from '../../types';

export const RecentAlerts: React.FC = () => {
  const { state, selectIncident, dismissAlert, selectRoute } = useSimulation();
  const [filter, setFilter] = useState<'all' | 'Critical' | 'Moderate' | 'Info'>('all');

  const filteredAlerts = state.alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.priority === filter;
  });

  const getPriorityBadge = (priority: AlertNotification['priority']) => {
    switch (priority) {
      case 'Critical':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          icon: AlertCircle,
          border: 'border-l-red-500',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: AlertTriangle,
          border: 'border-l-amber-500',
        };
      case 'Info':
        return {
          bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
          icon: Info,
          border: 'border-l-cyan-500',
        };
      default:
        return {
          bg: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
          icon: Bell,
          border: 'border-l-slate-500',
        };
    }
  };

  const handleAlertClick = (alert: AlertNotification) => {
    if (alert.incidentId) {
      selectIncident(alert.incidentId);
    }
    if (alert.routeId) {
      selectRoute(alert.routeId);
    }
  };

  return (
    <div className="flex flex-col h-[540px] rounded-xl bg-[#131a2a] border border-[#1e293b] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0e1424]">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-red-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Recent Alerts Feed</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              {filteredAlerts.length} live tactical broadcasts
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1">
          {(['all', 'Critical', 'Moderate', 'Info'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                filter === lvl
                  ? 'bg-red-500 text-white'
                  : 'bg-[#182238] text-slate-400 hover:text-white'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
            <span>No active alerts under this filter</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const badge = getPriorityBadge(alert.priority);
            const Icon = badge.icon;
            const isRelatedIncident = alert.incidentId === state.selectedIncidentId;

            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-3 rounded-lg border-l-4 ${badge.border} bg-[#0e1424]/90 hover:bg-[#182238] border border-[#1e293b] cursor-pointer transition-all group relative ${
                  isRelatedIncident ? 'ring-1 ring-red-500/50 shadow-md shadow-red-950/40' : ''
                }`}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border ${badge.bg}`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span>{alert.priority.toUpperCase()}</span>
                    </span>
                    {isRelatedIncident && (
                      <span className="text-[9px] font-mono font-bold text-red-400 animate-pulse">
                        ● ACTIVE FOCUS
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      title="Dismiss Alert"
                      className="text-slate-400 hover:text-red-400 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-red-300 transition-colors">
                  {alert.title}
                </h4>

                {/* Message */}
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {alert.message}
                </p>

                {/* Bottom Callout */}
                <div className="mt-2 pt-1.5 border-t border-[#1e293b]/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{alert.incidentId ? `Linked: ${alert.incidentId}` : 'Broadcast'}</span>
                  <span className="text-cyan-400 flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Target</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-2.5 bg-[#0e1424] border-t border-[#1e293b] text-center text-[10px] font-mono text-slate-400">
        💡 Click any alert to auto-focus map coordinates & trigger SOLACE AI rerouting analysis.
      </div>
    </div>
  );
};
