import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Navigation,
  Send,
  Cpu,
  Lock,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const IncidentAnalysisAI: React.FC = () => {
  const { activeIncident, aiRecommendation, state, dispatchTeam, selectRoute } = useSimulation();

  // SVG Circular Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aiRecommendation.riskScore / 100) * circumference;

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#ef4444'; // Red
    if (score >= 60) return '#f97316'; // Orange
    if (score >= 40) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  const getDecisionBadge = () => {
    switch (aiRecommendation.recommendationDecision) {
      case 'USE_PRIMARY':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: 'PRIMARY CORRIDOR CLEARED',
          icon: CheckCircle2,
        };
      case 'USE_ALTERNATIVE_VERIFIED':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: 'ALTERNATIVE APPROVED (VERIFIED)',
          icon: CheckCircle2,
        };
      case 'CAUTION_ALTERNATIVE_UNVERIFIED':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: 'POSSIBLE ROUTE (UNVERIFIED — CAUTION)',
          icon: AlertTriangle,
        };
      case 'INSUFFICIENT_INFORMATION':
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/40',
          text: 'INSUFFICIENT INFORMATION (NO SAFE ROUTE)',
          icon: XCircle,
        };
    }
  };

  const decisionBadge = getDecisionBadge();
  const DecisionIcon = decisionBadge.icon;

  return (
    <div className="flex flex-col rounded-xl bg-[#131a2a] border border-[#1e293b] p-4 shadow-xl justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                SOLACE AI Routing & Guardrails
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Target: {activeIncident.code} — {activeIncident.location}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
            <Lock className="w-2.5 h-2.5" />
            <span>ANTI-HALLUCINATION STRICT</span>
          </div>
        </div>

        {/* Circular Gauge and Incident Details */}
        <div className="mt-3 grid grid-cols-12 gap-3 items-center">
          {/* Circular SVG Risk Gauge */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Dynamic Value Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={getRiskColor(aiRecommendation.riskScore)}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black font-mono text-white">
                  {aiRecommendation.riskScore}%
                </span>
                <span className="text-[9px] font-bold tracking-tight text-slate-400 uppercase">
                  Risk Level
                </span>
              </div>
            </div>
            <span
              className="mt-1 text-[10px] font-mono font-bold uppercase tracking-wider"
              style={{ color: getRiskColor(aiRecommendation.riskScore) }}
            >
              {aiRecommendation.riskLevel}
            </span>
          </div>

          {/* Quick Route Status Summary Box */}
          <div className="col-span-8 space-y-2">
            {/* Primary Route Pill */}
            <div className="p-2 rounded-lg bg-[#0e1424] border border-[#1e2b45] text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-slate-400 font-mono">PRIMARY ARTERY:</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    aiRecommendation.primaryRouteAnalysis.status === 'blocked'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {aiRecommendation.primaryRouteAnalysis.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white font-medium truncate text-[11px]">
                {aiRecommendation.primaryRouteAnalysis.routeName}
              </p>
              {aiRecommendation.primaryRouteAnalysis.reason && (
                <p className="text-[10px] text-red-400/90 truncate mt-0.5 font-mono">
                  {aiRecommendation.primaryRouteAnalysis.reason}
                </p>
              )}
            </div>

            {/* Alternative Route Pill */}
            <div className="p-2 rounded-lg bg-[#0e1424] border border-[#1e2b45] text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-slate-400 font-mono">ALTERNATIVE SCAN:</span>
                {aiRecommendation.alternativeRouteAnalysis.exists ? (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                      aiRecommendation.alternativeRouteAnalysis.verificationBadge === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {aiRecommendation.alternativeRouteAnalysis.verificationBadge}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400">
                    NONE FOUND
                  </span>
                )}
              </div>
              <p className="text-white font-medium truncate text-[11px]">
                {aiRecommendation.alternativeRouteAnalysis.routeName || 'No Alternative in Map Data'}
              </p>
            </div>
          </div>
        </div>

        {/* Decision Badge & Action Recommendation Box */}
        <div className="mt-3 p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
          <div className="flex items-center space-x-1.5 mb-1">
            <span
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${decisionBadge.bg}`}
            >
              <DecisionIcon className="w-3 h-3" />
              <span>{decisionBadge.text}</span>
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-snug line-clamp-3">
            {aiRecommendation.detailedProtocol}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between">
        <button
          onClick={() => {
            const team = state.rescueTeams.find((t) => t.status === 'standby' || t.status === 'deployed');
            if (team) dispatchTeam(team.id, activeIncident.id);
          }}
          className="flex-1 mr-2 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-md shadow-red-950/50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Deploy Rescue Unit</span>
        </button>
        <button
          onClick={() => {
            if (aiRecommendation.alternativeRouteAnalysis.routeId) {
              selectRoute(aiRecommendation.alternativeRouteAnalysis.routeId);
            } else if (aiRecommendation.primaryRouteAnalysis.routeId) {
              selectRoute(aiRecommendation.primaryRouteAnalysis.routeId);
            }
          }}
          className="p-2 rounded-lg bg-[#182238] hover:bg-[#202e4c] text-cyan-400 text-xs border border-[#2a3b5c] transition-colors"
          title="Inspect Recommended Route on Map"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
