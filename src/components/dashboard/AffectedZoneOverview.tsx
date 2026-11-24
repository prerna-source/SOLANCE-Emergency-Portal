import React from 'react';
import { PieChart, Building2, Trees, Zap, Droplets, Wifi } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AffectedZoneOverview: React.FC = () => {
  const { kpis, state } = useSimulation();
  const isLight = state.theme === 'light';

  // Donut chart calculations: 68% Urban, 32% Rural
  const urbanPercent = 68;
  const ruralPercent = 32;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const urbanStroke = (urbanPercent / 100) * circumference;
  const ruralStroke = (ruralPercent / 100) * circumference;

  const totalCivilians = kpis.peopleAffectedCount;
  const urbanCivilians = Math.round((totalCivilians * urbanPercent) / 100);
  const ruralCivilians = totalCivilians - urbanCivilians;

  // Infrastructure damage status
  const infraStats = [
    {
      name: 'Power Grid',
      status: '62% Operational',
      percent: 62,
      icon: Zap,
      color: isLight ? 'text-amber-600' : 'text-amber-400',
      bar: isLight ? 'bg-amber-500' : 'bg-amber-400',
    },
    {
      name: 'Water Mains',
      status: '48% Damaged',
      percent: 52,
      icon: Droplets,
      color: isLight ? 'text-sky-600' : 'text-cyan-400',
      bar: isLight ? 'bg-sky-500' : 'bg-cyan-400',
    },
    {
      name: 'Telecom & 5G',
      status: '84% Operational',
      percent: 84,
      icon: Wifi,
      color: isLight ? 'text-emerald-600' : 'text-emerald-400',
      bar: isLight ? 'bg-emerald-500' : 'bg-emerald-400',
    },
  ];

  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-xl justify-between h-full transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-[#131a2a] border-[#1e293b]'
      }`}
    >
      {/* Header */}
      <div>
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-200' : 'border-[#1e293b]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`p-1.5 rounded-lg border ${
                isLight
                  ? 'bg-sky-100 text-sky-700 border-sky-200'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}
            >
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`text-xs font-bold tracking-wide uppercase font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Affected Zone Overview
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Urban vs. Rural Demographic Impact
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
              isLight
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            RADIUS {state.affectedRadiusKm} KM
          </span>
        </div>

        {/* Donut Chart & Demographic Split */}
        <div className="mt-3 grid grid-cols-12 gap-3 items-center">
          {/* SVG Donut Chart */}
          <div className="col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={isLight ? '#e2e8f0' : '#1e293b'}
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Urban Segment (Blue/Cyan) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeDasharray={`${urbanStroke} ${circumference}`}
                  strokeDashoffset="0"
                  fill="transparent"
                />
                {/* Rural Segment (Purple/Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#9333ea"
                  strokeWidth="12"
                  strokeDasharray={`${ruralStroke} ${circumference}`}
                  strokeDashoffset={`-${urbanStroke}`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span
                  className={`text-sm font-extrabold font-mono leading-tight ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {totalCivilians}
                </span>
                <span
                  className={`text-[8px] uppercase tracking-tighter font-mono ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  POP. AFFECTED
                </span>
              </div>
            </div>
          </div>

          {/* Demographic Breakdown Numbers */}
          <div className="col-span-7 space-y-2">
            {/* Urban */}
            <div
              className={`p-2 rounded-lg border flex items-center justify-between ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#0e1424] border-[#1e2b45]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      isLight ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    Urban Sector
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {urbanCivilians.toLocaleString()} civilians
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-cyan-400">
                {urbanPercent}%
              </span>
            </div>

            {/* Rural */}
            <div
              className={`p-2 rounded-lg border flex items-center justify-between ${
                isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#0e1424] border-[#1e2b45]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trees className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      isLight ? 'text-slate-800' : 'text-white'
                    }`}
                  >
                    Rural Outskirts
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {ruralCivilians.toLocaleString()} civilians
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {ruralPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Infrastructure Resilience Status Bars */}
        <div
          className={`mt-3 pt-2.5 border-t space-y-2 ${
            isLight ? 'border-slate-200' : 'border-[#1e293b]'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
            Critical Infrastructure Lifelines:
          </span>
          {infraStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={`flex items-center space-x-1.5 ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${item.color}`} />
                    <span>{item.name}</span>
                  </span>
                  <span className="text-slate-400 text-[10px]">{item.status}</span>
                </div>
                <div
                  className={`w-full rounded-full h-1.5 overflow-hidden border ${
                    isLight
                      ? 'bg-slate-100 border-slate-200'
                      : 'bg-[#0e1424] border-[#1e293b]'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${item.bar} transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`pt-2 text-[10px] font-mono flex items-center justify-between border-t mt-3 ${
          isLight
            ? 'border-slate-200 text-slate-500'
            : 'border-[#1e293b] text-slate-400'
        }`}
      >
        <span>Triage Priority: High-Density High Rises</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          Field Hospital Alpha Online
        </span>
      </div>
    </div>
  );
};
