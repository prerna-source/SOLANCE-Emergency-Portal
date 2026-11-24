import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { SimulateDisasterView } from './components/views/SimulateDisasterView';
import { IncidentsView } from './components/views/IncidentsView';
import { ResourcesView } from './components/views/ResourcesView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { useSimulation } from './context/SimulationContext';

export const AppContent: React.FC = () => {
  const { state } = useSimulation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-slate-100 font-sans select-none relative">
      {/* Scanline Overlay for subtle Tactical Command Center Feel */}
      <div className="absolute inset-0 scanlines pointer-events-none z-50 opacity-40" />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#0b0f19]">
          {state.activeTab === 'dashboard' && <DashboardView />}
          {state.activeTab === 'simulate' && <SimulateDisasterView />}
          {state.activeTab === 'incidents' && <IncidentsView />}
          {state.activeTab === 'resources' && <ResourcesView />}
          {state.activeTab === 'ai-assistant' && <AIAssistantView />}
          {state.activeTab === 'reports' && <ReportsView />}
          {state.activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
