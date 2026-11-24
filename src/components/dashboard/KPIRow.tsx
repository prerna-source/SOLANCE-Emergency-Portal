import React from 'react';
import { AlertCircle, Users, Truck, Home, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const KPIRow: React.FC = () => {
  const { kpis, state, setActiveTab } = useSimulation();

  const cards = [
    {
      id: 'incidents',
      title: 'Active Incidents',
      value: kpis.activeIncidentsCount,
      subValue: '2 Critical, 2 High, 1 Moderate',
      trend: '+1 in last 20m',
      icon: AlertCircle,
      accent: 'border-red-500/30 text-red-400 bg-red-950/20',
      badgeBg: 'bg-red-500/10 text-red-400 border border-red-500/30',
      iconBg: 'bg-red-500/20 text-red-400',
      tabTarget: 'incidents' as const,
    },
    {
      id: 'affected',
      title: 'People Affected',
      value: kpis.peopleAffectedCount.toLocaleString(),
      subValue: '68 Trapped Civilians Under Triage',
      trend: 'Estimated population at risk',
      icon: Users,
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      tabTarget: 'incidents' as const,
    },
    {
      id: 'teams',
      title: 'Rescue Teams Deployed',
      value: `${kpis.rescueTeamsDeployedCount} / ${state.rescueTeams.length}`,
      subValue: '1 USAR en-route, 3 deployed on ground',
      trend: '100% active dispatch rate',
      icon: Truck,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      tabTarget: 'resources' as const,
    },
    {
      id: 'shelters',
      title: 'Shelters Available',
      value: `${kpis.sheltersAvailableCount} Open`,
      subValue: `${kpis.shelterOccupancyRate}% Total Capacity Filled (${kpis.totalShelterCapacity} beds)`,
      trend: 'Food & medical supplies intact',
      icon: Home,
      accent: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
      badgeBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
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
            className={`p-4 rounded-xl bg-[#131a2a] border ${card.accent} hover:bg-[#182238] transition-all cursor-pointer shadow-lg hover:shadow-xl group relative overflow-hidden`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.iconBg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {card.value}
              </span>
            </div>

            {/* Subtitle details */}
            <div className="mt-2 text-[11px] text-slate-400 truncate">
              {card.subValue}
            </div>

            {/* Bottom trend pill */}
            <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 flex items-center space-x-1">
                <Activity className="w-3 h-3 text-slate-400" />
                <span>{card.trend}</span>
              </span>
              <span className="text-slate-400 group-hover:text-white transition-colors">
                View →
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
