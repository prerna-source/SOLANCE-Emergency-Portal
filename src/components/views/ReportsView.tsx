import React from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ReportsView: React.FC = () => {
  const { state, kpis, activeIncident, aiRecommendation } = useSimulation();
  const isLight = state.theme === 'light';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Action Header */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#131a2a] border-[#1e293b]'
        }`}
      >
        <div>
          <h2
            className={`text-base font-bold font-mono flex items-center space-x-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <FileText className="w-5 h-5 text-red-500" />
            <span>Emergency Situation Report (SitRep #04)</span>
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Official Crisis Assessment for State Disaster Management Authority (SDMA) & NDRF Command.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-[#182238] hover:bg-[#202e4c] border-[#2a3b5c] text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => alert('SitRep JSON/PDF snapshot generated successfully.')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-semibold transition-colors shadow-md shadow-red-950/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Briefing</span>
          </button>
        </div>
      </div>

      {/* Printable SitRep Document Sheet */}
      <div
        className={`p-6 rounded-xl border space-y-6 shadow-xl transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#131a2a] border-[#1e293b] text-slate-200'
        }`}
      >
        {/* Document Header */}
        <div
          className={`border-b pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
            isLight ? 'border-slate-200' : 'border-[#2a3b5c]'
          }`}
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                OFFICIAL SITREP
              </span>
              <span className="text-xs font-mono text-slate-500">
                REF: SOLACE/EQ-{new Date().toISOString().slice(0, 10)}/004
              </span>
            </div>
            <h1
              className={`text-lg font-black mt-1 font-mono ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              SOLACE EMERGENCY INCIDENT COMMAND ASSESSMENT
            </h1>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <div>ISSUED: {new Date().toLocaleDateString()}</div>
            <div className="font-semibold text-red-600 dark:text-red-400">STATUS: LEVEL-3 STATE EMERGENCY</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div
            className={`p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <span className="text-[10px] text-slate-400 block">TOTAL AFFECTED</span>
            <span className="text-lg font-bold text-sky-600 dark:text-cyan-400">
              {kpis.peopleAffectedCount}
            </span>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <span className="text-[10px] text-slate-400 block">ACTIVE SITES</span>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {kpis.activeIncidentsCount} Incidents
            </span>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <span className="text-[10px] text-slate-400 block">UNITS DEPLOYED</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {kpis.rescueTeamsDeployedCount} Squads
            </span>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#0e1424] border-[#1e2b45]'
            }`}
          >
            <span className="text-[10px] text-slate-400 block">SHELTER CAPACITY</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {kpis.shelterOccupancyRate}% Filled
            </span>
          </div>
        </div>

        {/* Active Incident Routing Audit */}
        <div className="space-y-3">
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider flex items-center space-x-1.5 border-b pb-2 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-white border-[#1e293b]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>SOLACE AI Route Verification & Dispatch Directive</span>
          </h3>

          <div
            className={`p-4 rounded-lg border space-y-2 text-xs font-mono ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-[#0e1424] border-[#1e2b45] text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-500">PRIORITY TARGET:</span>
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activeIncident.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">PRIMARY ARTERY (NH-48):</span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                {aiRecommendation.primaryRouteAnalysis.status.toUpperCase()} (
                {aiRecommendation.primaryRouteAnalysis.reason})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">ALTERNATIVE ROUTE STATUS:</span>
              <span
                className={
                  aiRecommendation.alternativeRouteAnalysis.verificationBadge === 'VERIFIED'
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-amber-600 dark:text-amber-400 font-bold'
                }
              >
                {aiRecommendation.alternativeRouteAnalysis.routeName || 'None in Map Data'} (
                {aiRecommendation.alternativeRouteAnalysis.verificationBadge})
              </span>
            </div>
            <div
              className={`mt-2 pt-2 border-t leading-relaxed font-sans ${
                isLight ? 'border-slate-200 text-slate-700' : 'border-[#1e2b45] text-slate-300'
              }`}
            >
              <strong>OPERATIONAL DIRECTIVE:</strong> {aiRecommendation.detailedProtocol}
            </div>
          </div>
        </div>

        {/* Priority Action Checklist */}
        <div className="space-y-3">
          <h3
            className={`text-xs font-bold uppercase font-mono tracking-wider border-b pb-2 ${
              isLight ? 'text-slate-900 border-slate-200' : 'text-white border-[#1e293b]'
            }`}
          >
            Multi-Agency Action Item Directives
          </h3>

          <div className="space-y-2 text-xs">
            {[
              {
                agency: 'NDRF & USAR Alpha-1',
                task: 'Maintain deployment towards Sector 12 structural collapse via verified South Ridge Bypass B-7.',
                status: 'In Progress',
              },
              {
                agency: 'Combat Engineers (ENG-02)',
                task: 'Station bulldozers at NH-48 Mile Marker 14 to begin debris clearance and fissure grading.',
                status: 'Dispatched',
              },
              {
                agency: 'District Health & Metro Trauma',
                task: 'Maintain 42 ICU beds on standby; mobilize mobile surgical triage vans towards South Crossing.',
                status: 'Standby',
              },
              {
                agency: 'Municipal Disaster Control',
                task: 'Establish satellite Wi-Fi and water tankers at National Sports Stadium and West Civic Center.',
                status: 'Operational',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#0e1424] border-[#1e2b45]'
                }`}
              >
                <div>
                  <span className="text-sky-600 dark:text-cyan-400 font-mono font-bold text-[11px] block">
                    {item.agency}
                  </span>
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                    {item.task}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    isLight
                      ? 'bg-white text-slate-700 border-slate-200'
                      : 'bg-[#182238] text-slate-300 border-[#2a3b5c]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signoff */}
        <div
          className={`pt-4 border-t flex justify-between text-xs font-mono ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-[#2a3b5c] text-slate-400'
          }`}
        >
          <div>
            <div className="font-semibold">COMMAND OPERATOR: Cmdr. V. Sharma</div>
            <div className="text-[10px] text-slate-400">Incident Commander — Sector 1</div>
          </div>
          <div className="text-right">
            <div>MOTTO: &ldquo;NOT ME, BUT YOU&rdquo;</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              VERIFIED BY SOLACE ENGINE v2.4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
