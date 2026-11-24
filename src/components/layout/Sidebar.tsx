import React from 'react';
import {
  LayoutDashboard,
  Flame,
  AlertTriangle,
  Boxes,
  Bot,
  FileText,
  Settings,
  ShieldAlert,
  HeartHandshake,
  Activity,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Sidebar: React.FC = () => {
  const { state, setActiveTab, activeIncident, aiRecommendation } = useSimulation();
  const isLight = state.theme === 'light';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'simulate',
      label: 'Simulate Disaster',
      icon: Flame,
      badge: state.activeScenario.replace('scenario-', 'Scn. ').toUpperCase(),
      badgeColor: isLight
        ? 'bg-amber-100 text-amber-800 border border-amber-300'
        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      badge: state.incidents.filter((i) => i.status !== 'resolved').length.toString(),
      badgeColor: isLight
        ? 'bg-red-100 text-red-800 border border-red-300'
        : 'bg-red-500/20 text-red-400 border border-red-500/30',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: Bot,
      badge: 'STRICT',
      badgeColor: isLight
        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`w-64 border-r flex flex-col justify-between shrink-0 select-none z-30 transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#0e1424] border-[#1e293b] text-slate-100'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'border-slate-200' : 'border-[#1e293b]'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 shadow-lg shadow-red-500/20 ring-1 ring-red-400/30">
              <ShieldAlert className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`font-extrabold text-xl tracking-wider font-mono ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  SOLACE
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                  v2.4
                </span>
              </div>
              <p
                className={`text-[10px] tracking-tight font-medium ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                AI Emergency Command
              </p>
            </div>
          </div>
        </div>

        {/* System Status Pill */}
        <div className="px-3 pt-3">
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#131b2e] border-[#1e2b45]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Guardrails Active
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                isLight
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              100% VERIFIED
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 mt-1">
          <div
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider ${
              isLight ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            Command Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof state.activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? isLight
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-600 pl-2.5 shadow-sm'
                      : 'bg-gradient-to-r from-red-600/20 to-red-900/10 text-white border-l-4 border-red-500 pl-2.5 shadow-sm shadow-red-950/40'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? isLight
                          ? 'text-red-600'
                          : 'text-red-400'
                        : isLight
                        ? 'text-slate-400 group-hover:text-slate-700'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isLight
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-[#1e293b] text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Motto Card */}
      <div
        className={`p-3 space-y-3 border-t transition-colors duration-200 ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-[#0b0f19]/60 border-[#1e293b]'
        }`}
      >
        {/* Active Incident Quick Telemetry */}
        <div
          className={`p-2.5 rounded-lg border text-xs ${
            isLight
              ? 'bg-white border-slate-200 shadow-sm'
              : 'bg-[#131b2e] border-[#1e2b45]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-red-500 animate-pulse" />
              <span
                className={`font-mono text-[10px] ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                FOCUS TARGET
              </span>
            </span>
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-semibold">
              {activeIncident.code}
            </span>
          </div>
          <p
            className={`font-medium truncate text-[11px] ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            {activeIncident.title}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              Risk Score:
            </span>
            <span className="text-red-600 dark:text-red-400 font-bold">
              {aiRecommendation.riskScore}%
            </span>
          </div>
        </div>

        {/* Motto Card: "Not Me, But You" */}
        <div
          className={`p-3 rounded-xl border shadow-sm ${
            isLight
              ? 'bg-gradient-to-br from-amber-50 to-orange-50/60 border-amber-200'
              : 'bg-gradient-to-br from-[#1a2238] to-[#121829] border-amber-500/20'
          }`}
        >
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-wide uppercase">
              Core Philosophy
            </span>
          </div>
          <blockquote
            className={`text-xs font-semibold italic ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            &ldquo;Not Me, But You&rdquo;
          </blockquote>
          <p
            className={`text-[9px] mt-1 leading-tight ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Humanitarian crisis prioritization & zero-compromise emergency routing verification.
          </p>
        </div>
      </div>
    </aside>
  );
};
