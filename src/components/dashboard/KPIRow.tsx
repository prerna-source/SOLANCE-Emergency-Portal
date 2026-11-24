import React from 'react';
import { AlertCircle, Users, Truck, Home, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const KPIRow: React.FC = () => {
  const { kpis, state, setActiveTab } = useSimulation();
  const isLight = state.theme === 'light';

  const cards = [
    {
      id: 'incidents',
      title: 'Active Incidents',
      value: kpis.activeIncidentsCount,
      subValue: '2 Critical, 2 High, 1 Moderate',
      trend: '+1 in last 20m',
      icon: AlertCircle,
      accent: isLight
        ? 'border-red-200 text-red-600 bg-white hover:bg-red-50/40'
        : 'border-red-500/30 text-red-400 bg-[#131a2a] hover:bg-[#182238]',
      badgeBg: isLight
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-red-500/10 text-red-400 border border-red-500/30',
      iconBg: isLight ? 'bg-red-100 text-red-600' : 'bg-red-500/20 text-red-400',
      tabTarget: 'incidents' as const,
    },
    {
      id: 'affected',
      title: 'People Affected',
      value: kpis.peopleAffectedCount.toLocaleString(),
      subValue: '68 Trapped Civilians Under Triage',
      trend: 'Estimated population at risk',
      icon: Users,
      accent: isLight
        ? 'border-sky-200 text-sky-600 bg-white hover:bg-sky-50/40'
        : 'border-cyan-500/30 text-cyan-400 bg-[#131a2a] hover:bg-[#182238]',
      badgeBg: isLight
        ? 'bg-sky-50 text-sky-700 border border-sky-200'
        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
      iconBg: isLight ? 'bg-sky-100 text-sky-600' : 'bg-cyan-500/20 text-cyan-400',
      tabTarget: 'incidents' as const,
    },
    {
      id: 'teams',
      title: 'Rescue Teams Deployed',
      value: `${kpis.rescueTeamsDeployedCount} / ${state.rescueTeams.length}`,
      subValue: '1 USAR en-route, 3 deployed on ground',
      trend: '100% active dispatch rate',
      icon: Truck,
      accent: isLight
        ? 'border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50/40'
        : 'border-emerald-500/30 text-emerald-400 bg-[#131a2a] hover:bg-[#182238]',
      badgeBg: isLight
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      iconBg: isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400',
      tabTarget: 'resources' as const,
    },
    {
      id: 'shelters',
      title: 'Shelters Available',
      value: `${kpis.sheltersAvailableCount} Open`,
      subValue: `${kpis.shelterOccupancyRate}% Total Capacity Filled (${kpis.totalShelterCapacity} beds)`,
      trend: 'Food & medical supplies intact',
      icon: Home,
      accent: isLight
        ? 'border-purple-200 text-purple-600 bg-white hover:bg-purple-50/40'
        : 'border-purple-500/30 text-purple-400 bg-[#131a2a] hover:bg-[#182238]',
      badgeBg: isLight
        ? 'bg-purple-50 text-purple-700 border border-purple-200'
        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
      iconBg: isLight ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400',
      tabTarget: 'resources' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => setActiveTab(card.tabTarget)}
            className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md group relative overflow-hidden ${card.accent}`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold tracking-wide uppercase ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {card.title}
              </span>
              <div
                className={`p-2 rounded-lg ${card.iconBg} group-hover:scale-110 transition-transform shadow-sm`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {card.value}
              </span>
            </div>

            {/* Subtitle details */}
            <div
              className={`mt-2 text-[11px] truncate ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {card.subValue}
            </div>

            {/* Bottom trend pill */}
            <div
              className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                isLight ? 'border-slate-100' : 'border-[#1e293b]'
              }`}
            >
              <span
                className={`flex items-center space-x-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>{card.trend}</span>
              </span>
              <span
                className={`font-semibold ${
                  isLight
                    ? 'text-slate-600 group-hover:text-slate-900'
                    : 'text-slate-400 group-hover:text-white'
                } transition-colors`}
              >
                View →
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
