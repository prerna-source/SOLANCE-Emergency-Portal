import React, { useState, useEffect } from 'react';
import {
  Search,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  UserCheck,
  Megaphone,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Header: React.FC = () => {
  const {
    state,
    setSearchQuery,
    toggleAudio,
    triggerEmergencyBroadcast,
    resetSimulation,
    setActiveTab,
  } = useSimulation();

  const [time, setTime] = useState<{ local: string; zulu: string }>({
    local: '',
    zulu: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const localStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const zuluStr = now.toISOString().slice(11, 19) + 'Z';
      setTime({ local: localStr, zulu: zuluStr });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0e1424] border-b border-[#1e293b] px-6 flex items-center justify-between z-20 shrink-0">
      {/* Search Input Bar */}
      <div className="flex items-center space-x-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents, locations, routes..."
            className="w-full bg-[#131b2e] border border-[#1e2b45] rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all font-mono"
          />
          {state.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Pulsing Green LIVE indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-sm shadow-emerald-950/40">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider text-emerald-400 font-mono">
            LIVE TELEMETRY
          </span>
          <span className="text-[10px] text-emerald-500 font-mono">14ms</span>
        </div>

        {/* Real-Time Clock */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#131b2e] border border-[#1e2b45] text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">{time.local} IST</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{time.zulu}</span>
        </div>

        {/* Disaster Status Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-red-300 font-medium">M{state.earthquakeMagnitude} Tremor Alert</span>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center space-x-3">
        {/* Audio Toggle */}
        <button
          onClick={() => toggleAudio()}
          title={state.audioAlertsEnabled ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
          className={`p-2 rounded-lg border transition-all ${
            state.audioAlertsEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-950/50'
              : 'bg-[#131b2e] border-[#1e2b45] text-slate-400 hover:text-slate-200'
          }`}
        >
          {state.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Emergency Broadcast Button */}
        <button
          onClick={triggerEmergencyBroadcast}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-red-900/40 border border-red-400/30 transition-all active:scale-95"
        >
          <Megaphone className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Broadcast Alert</span>
        </button>

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation Graph to Default"
          className="p-2 rounded-lg bg-[#131b2e] border border-[#1e2b45] text-slate-400 hover:text-white hover:border-slate-600 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Operator Profile Badge */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-[#1e293b]">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-cyan-500/30">
              VS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0e1424] rounded-full"></span>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white flex items-center space-x-1">
              <span>Cmdr. V. Sharma</span>
              <UserCheck className="w-3 h-3 text-cyan-400 inline" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Sector 1 Incident Commander</p>
          </div>
        </div>
      </div>
    </header>
  );
};
