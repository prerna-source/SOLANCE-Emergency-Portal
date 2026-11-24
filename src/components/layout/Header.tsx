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
  Sun,
  Moon,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Header: React.FC = () => {
  const {
    state,
    setSearchQuery,
    toggleAudio,
    triggerEmergencyBroadcast,
    resetSimulation,
    toggleTheme,
  } = useSimulation();

  const isLight = state.theme === 'light';

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
    <header
      className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 border-b transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#0e1424] border-[#1e293b]'
      }`}
    >
      {/* Search Input Bar */}
      <div className="flex items-center space-x-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents, locations, routes..."
            className={`w-full rounded-lg pl-10 pr-4 py-2 text-xs font-mono transition-all focus:outline-none focus:ring-1 ${
              isLight
                ? 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500/60 focus:ring-red-500/20'
                : 'bg-[#131b2e] border border-[#1e2b45] text-slate-200 placeholder-slate-400 focus:border-red-500/60 focus:ring-red-500/30'
            }`}
          />
          {state.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Pulsing Green LIVE indicator */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border shadow-sm ${
            isLight
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-950/40'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
            LIVE TELEMETRY
          </span>
          <span className="text-[10px] text-emerald-500 font-mono">14ms</span>
        </div>

        {/* Real-Time Clock */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-700'
              : 'bg-[#131b2e] border-[#1e2b45] text-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          <span className="font-semibold text-slate-900 dark:text-white">{time.local} IST</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-slate-500 dark:text-slate-400">{time.zulu}</span>
        </div>

        {/* Disaster Status Badge */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
            isLight
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-red-950/30 border-red-500/30 text-red-300'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-500 dark:text-red-400 animate-pulse" />
          <span className="font-medium">M{state.earthquakeMagnitude} Tremor Alert</span>
        </div>
      </div>

      {/* Right Controls & Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={() => toggleTheme()}
          title={isLight ? 'Switch to Tactical Dark Mode' : 'Switch to Clean White Light Mode'}
          className={`p-2 rounded-lg border transition-all flex items-center space-x-1.5 text-xs font-mono font-semibold ${
            isLight
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
          }`}
        >
          {isLight ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline text-[11px]">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline text-[11px]">Dark Mode</span>
            </>
          )}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => toggleAudio()}
          title={state.audioAlertsEnabled ? 'Mute Tactical Audio' : 'Enable Tactical Audio'}
          className={`p-2 rounded-lg border transition-all ${
            state.audioAlertsEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 dark:text-amber-400 shadow-sm'
              : isLight
              ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              : 'bg-[#131b2e] border-[#1e2b45] text-slate-400 hover:text-slate-200'
          }`}
        >
          {state.audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Emergency Broadcast Button */}
        <button
          onClick={triggerEmergencyBroadcast}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-red-900/30 border border-red-400/30 transition-all active:scale-95"
        >
          <Megaphone className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Broadcast Alert</span>
        </button>

        {/* Reset Simulation */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation Graph to Default"
          className={`p-2 rounded-lg border transition-all ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
              : 'bg-[#131b2e] border-[#1e2b45] text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Operator Profile Badge */}
        <div
          className={`flex items-center space-x-2.5 pl-3 border-l ${
            isLight ? 'border-slate-200' : 'border-[#1e293b]'
          }`}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-cyan-500/30 shadow-sm">
              VS
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
                isLight ? 'border-white' : 'border-[#0e1424]'
              }`}
            ></span>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold flex items-center space-x-1 text-slate-900 dark:text-white">
              <span>Cmdr. V. Sharma</span>
              <UserCheck className="w-3 h-3 text-cyan-500 dark:text-cyan-400 inline" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Sector 1 Incident Commander
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
