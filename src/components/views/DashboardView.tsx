import React from 'react';
import { KPIRow } from '../dashboard/KPIRow';
import { LiveDisasterMap } from '../dashboard/LiveDisasterMap';
import { RecentAlerts } from '../dashboard/RecentAlerts';
import { IncidentAnalysisAI } from '../dashboard/IncidentAnalysisAI';
import { DisasterSimulationControl } from '../dashboard/DisasterSimulationControl';
import { AffectedZoneOverview } from '../dashboard/AffectedZoneOverview';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* 1. Top KPI Row (4 Cards) */}
      <KPIRow />

      {/* 2. Main Dashboard Grid (Live Disaster Map Center-Left + Recent Alerts Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center Live Disaster Map */}
        <div className="lg:col-span-8">
          <LiveDisasterMap />
        </div>

        {/* Right Recent Alerts Feed */}
        <div className="lg:col-span-4">
          <RecentAlerts />
        </div>
      </div>

      {/* 3. Bottom Analytics Row (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IncidentAnalysisAI />
        <DisasterSimulationControl />
        <AffectedZoneOverview />
      </div>
    </div>
  );
};
