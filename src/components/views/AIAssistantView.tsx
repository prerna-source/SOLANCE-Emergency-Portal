import React, { useState } from 'react';
import {
  Bot,
  Send,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Cpu,
  FileCheck,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'solace';
  text: string;
  timestamp: string;
  badge?: string;
  verifiedStatus?: 'VERIFIED' | 'UNVERIFIED' | 'BLOCKED' | 'INSUFFICIENT';
}

export const AIAssistantView: React.FC = () => {
  const { state, activeIncident, aiRecommendation, selectIncident } = useSimulation();

  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'solace',
      text: `SOLACE Emergency Intelligence Core initialized. Active Incident Target: ${activeIncident.code} (${activeIncident.title}). Strict Anti-Hallucination Guardrails are ENGAGED. Ready to evaluate corridor passability and execute route verification audits.`,
      timestamp: 'Active Session',
      badge: 'STRICT GUARDRAILS ENFORCED',
    },
    {
      id: 'msg-init-2',
      sender: 'solace',
      text: aiRecommendation.detailedProtocol,
      timestamp: aiRecommendation.telemetryTimestamp,
      verifiedStatus:
        aiRecommendation.recommendationDecision === 'USE_PRIMARY' ||
        aiRecommendation.recommendationDecision === 'USE_ALTERNATIVE_VERIFIED'
          ? 'VERIFIED'
          : aiRecommendation.recommendationDecision === 'CAUTION_ALTERNATIVE_UNVERIFIED'
          ? 'UNVERIFIED'
          : 'INSUFFICIENT',
    },
  ]);

  const quickPrompts = [
    'Analyze Sector 12 evacuation corridor',
    'Why is NH-48 impassable?',
    'Evaluate South Ridge Bypass B-7 telemetry',
    'What is the protocol when all routes are cut off?',
    'Generate Situation Briefing for District Collector',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };

    let replyText = '';
    let status: ChatMessage['verifiedStatus'] = 'VERIFIED';

    const lowerQ = q.toLowerCase();

    if (lowerQ.includes('sector 12') || lowerQ.includes('evacuation') || lowerQ.includes('corridor')) {
      replyText = `SOLACE AUDIT REPORT for Sector 12:\n\n• Primary Corridor (NH-48): ${aiRecommendation.primaryRouteAnalysis.status.toUpperCase()} (${aiRecommendation.primaryRouteAnalysis.reason})\n• Alternative Corridor: ${
        aiRecommendation.alternativeRouteAnalysis.exists
          ? `${aiRecommendation.alternativeRouteAnalysis.routeName} — Status: ${aiRecommendation.alternativeRouteAnalysis.verificationBadge}`
          : 'None present in GIS graph'
      }\n• Action Directive: ${aiRecommendation.headlineRecommendation}\n\nCompliance Note: SOLACE strictly references active sensor nodes and refuses to generate hypothetical bypass roads.`;
      status = aiRecommendation.alternativeRouteAnalysis.verificationBadge === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED';
    } else if (lowerQ.includes('nh-48') || lowerQ.includes('impassable') || lowerQ.includes('blocked')) {
      const nh48 = state.routes.find((r) => r.id === 'route-nh48-primary');
      replyText = `TELEMETRY STATUS: NH-48 Express Corridor is currently ${nh48?.status.toUpperCase()}.\n\nObserved Cause: ${
        nh48?.blockageReason || 'Seismic surface fissure'
      }.\nDistance to hazard point: Mile Marker 14.\nAll automated dispatches along NH-48 have been locked to prevent rescue unit entrapment.`;
      status = 'BLOCKED';
    } else if (lowerQ.includes('south ridge') || lowerQ.includes('bypass') || lowerQ.includes('telemetry')) {
      const alt = state.routes.find((r) => r.id === 'route-south-ridge-alt');
      replyText = `CORRIDOR INSPECTION: South Ridge Bypass B-7.\n\n• Physical Passability: ${alt?.status.toUpperCase()}\n• Verification Status: ${
        alt?.verified ? 'VERIFIED (UAV-03 live drone feed confirmed clear)' : 'UNVERIFIED (Sensor ping offline)'
      }\n• Distance: ${alt?.distanceKm} km | Est. Travel Time: ${alt?.estimatedMinutes} minutes.\n\nGuardrail Rule Applied: ${
        alt?.verified
          ? 'Safe for immediate emergency dispatch.'
          : 'CAUTION: Safety not confirmed by field reconnaissance or sensor telemetry.'
      }`;
      status = alt?.verified ? 'VERIFIED' : 'UNVERIFIED';
    } else if (lowerQ.includes('cut off') || lowerQ.includes('all routes') || lowerQ.includes('isolated')) {
      replyText = `CRITICAL TOTAL ISOLATION PROTOCOL:\n\nIf all registered corridors are severed or absent from the GIS database, SOLACE AI is mathematically constrained from inventing speculative routes. The system issues: "Insufficient information to identify an alternative route. Manual reconnaissance required." Air winch evacuation (NDRF/IAF Helicopter) or immediate UAV reconnaissance must be deployed.`;
      status = 'INSUFFICIENT';
    } else {
      replyText = `COMMAND DIRECTIVE for ${activeIncident.title}:\n\n${aiRecommendation.detailedProtocol}\n\nStrict Verification telemetry validated at ${aiRecommendation.telemetryTimestamp}. No hallucinations detected in road graph traversal.`;
      status = 'VERIFIED';
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'solace',
      text: replyText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      verifiedStatus: status,
    };

    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    if (!textToSend) setInputQuery('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-8.5rem)]">
      {/* Left Chat & Query Terminal */}
      <div className="lg:col-span-7 flex flex-col rounded-xl bg-[#131a2a] border border-[#1e293b] shadow-2xl overflow-hidden h-full">
        {/* Terminal Header */}
        <div className="p-4 border-b border-[#1e293b] bg-[#0e1424] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-1.5">
                <span>SOLACE AI Emergency Console</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ONLINE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Active Ground Truth Synced to Simulation State
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold">Zero-Hallucination Guardrails</span>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-[#0b0f19] border-b border-[#1e293b] flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 shrink-0">
            Presets:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-[#182238] hover:bg-[#22304d] border border-[#2a3b5c] text-[10px] text-slate-300 font-mono whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {chatHistory.map((msg) => {
            const isAi = msg.sender === 'solace';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  <span
                    className={`text-[10px] font-bold ${
                      isAi ? 'text-red-400' : 'text-cyan-400'
                    }`}
                  >
                    {isAi ? 'SOLACE AI' : 'COMMAND OPERATOR'}
                  </span>
                  {msg.verifiedStatus && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        msg.verifiedStatus === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : msg.verifiedStatus === 'UNVERIFIED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {msg.verifiedStatus}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-xl p-3.5 rounded-xl whitespace-pre-line leading-relaxed ${
                    isAi
                      ? 'bg-[#0e1424] border border-[#1e2b45] text-slate-200'
                      : 'bg-red-600/20 border border-red-500/40 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1e293b] bg-[#0e1424]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask SOLACE AI for route safety, roadblock causes, or recon instructions..."
              className="flex-1 bg-[#131b2e] border border-[#1e2b45] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-red-500/60"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/50"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Guardrails Telemetry & Policy Inspector */}
      <div className="lg:col-span-5 flex flex-col space-y-4 overflow-y-auto">
        {/* Guardrail Rules Overview */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Strict AI Guardrail Architecture</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE & ENFORCED
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
              <span className="text-emerald-400 font-bold font-mono text-[11px] block mb-0.5">
                Rule 1: Primary Artery First
              </span>
              <p className="text-slate-300 text-[11px]">
                Always identifies the incident location and evaluates primary corridor. If blocked, automatically audits secondary paths.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
              <span className="text-amber-400 font-bold font-mono text-[11px] block mb-0.5">
                Rule 2: Verification Transparency
              </span>
              <p className="text-slate-300 text-[11px]">
                Alternative routes MUST display an explicit verification badge: <strong>VERIFIED</strong> (sensor/drone confirmed) or <strong>UNVERIFIED</strong> (exists on map, safety unconfirmed).
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0e1424] border border-[#1e2b45]">
              <span className="text-red-400 font-bold font-mono text-[11px] block mb-0.5">
                Rule 3: Anti-Hallucination & Refusal
              </span>
              <p className="text-slate-300 text-[11px]">
                Never invents roads. If no verified path exists, SOLACE explicitly states: <em>&ldquo;Insufficient information to identify an alternative route. Manual reconnaissance required.&rdquo;</em>
              </p>
            </div>
          </div>
        </div>

        {/* Live Ground Truth Graph State */}
        <div className="p-4 rounded-xl bg-[#131a2a] border border-[#1e293b] space-y-3">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Active Road Graph Traversal</span>
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {state.routes.map((r) => (
              <div
                key={r.id}
                className="p-2 rounded bg-[#0e1424] border border-[#1e2b45] flex items-center justify-between"
              >
                <div>
                  <span className="text-white font-semibold block text-[11px]">{r.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {r.distanceKm}km • {r.status}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      r.status === 'blocked'
                        ? 'bg-red-500/20 text-red-400'
                        : r.verified
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {r.status === 'blocked' ? 'BLOCKED' : r.verified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
