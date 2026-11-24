import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Shield,
  Truck,
  Home,
  Heart,
  AlertTriangle,
  Compass,
  Radio,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { RouteSegment, Incident } from '../../types';

export const LiveDisasterMap: React.FC = () => {
  const {
    state,
    selectIncident,
    selectRoute,
    toggleRouteBlock,
    toggleRouteVerification,
    activeIncident,
    aiRecommendation,
  } = useSimulation();

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showEpicenter, setShowEpicenter] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [hoveredRoute, setHoveredRoute] = useState<RouteSegment | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ type: string; title: string; subtitle: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Helper to convert coordinate arrays to SVG path string
  const getRouteSvgPath = (coords: [number, number][]) => {
    if (!coords || coords.length === 0) return '';
    return coords.reduce((acc, curr, index) => {
      return index === 0 ? `M ${curr[0]} ${curr[1]}` : `${acc} L ${curr[0]} ${curr[1]}`;
    }, '');
  };

  // Determine route style based on simulation status & verification
  const getRouteStyle = (route: RouteSegment) => {
    if (route.status === 'blocked') {
      return {
        stroke: '#ef4444',
        strokeDasharray: '8,6',
        className: 'route-flow',
        glow: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8))',
        labelBg: 'bg-red-950/90 text-red-300 border-red-500/50',
      };
    }
    if (route.verified) {
      return {
        stroke: '#10b981',
        strokeDasharray: 'none',
        className: 'route-flow-fast',
        glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.85))',
        labelBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
      };
    }
    // Clear but Unverified (Amber dashed)
    return {
      stroke: '#f59e0b',
      strokeDasharray: '6,4',
      className: 'route-flow',
      glow: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.75))',
      labelBg: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
    };
  };

  return (
    <div className="relative flex flex-col rounded-xl bg-[#131a2a] border border-[#1e293b] shadow-2xl overflow-hidden h-[540px]">
      {/* Top Map Header & Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {/* Disaster Active Epicenter Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/50 backdrop-blur-md shadow-lg shadow-red-950/60">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-wider text-white font-mono">
                  EARTHQUAKE SIMULATION ACTIVE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500 text-white font-mono">
                  M{state.earthquakeMagnitude}
                </span>
              </div>
              <p className="text-[9px] text-red-300 font-mono">
                Epicenter: 28°36'N 77°12'E | Radius: {state.affectedRadiusKm} km
              </p>
            </div>
          </div>

          {/* Scenario Indicator Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1424]/90 border border-[#2a3b5c] backdrop-blur-md text-[11px] font-mono text-slate-300">
            <span className="text-slate-400">Mode:</span>
            <span className="text-amber-400 font-semibold uppercase">
              {state.activeScenario === 'scenario-a' && 'Scn A: Blocked → Verified Alt'}
              {state.activeScenario === 'scenario-b' && 'Scn B: Blocked → Unverified Alt'}
              {state.activeScenario === 'scenario-c' && 'Scn C: Total Isolation'}
              {state.activeScenario === 'custom' && 'Custom Manual Override'}
            </span>
          </div>
        </div>

        {/* Map Control Tools */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Tactical Grid"
            className={`p-2 rounded-lg backdrop-blur-md border text-xs transition-all ${
              showGrid
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowEpicenter(!showEpicenter)}
            title="Toggle Epicenter Wave"
            className={`p-2 rounded-lg backdrop-blur-md border text-xs transition-all ${
              showEpicenter
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-lg bg-[#0e1424]/80 border border-[#1e293b] text-slate-300 hover:text-white backdrop-blur-md"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-lg bg-[#0e1424]/80 border border-[#1e293b] text-slate-300 hover:text-white backdrop-blur-md"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="p-2 rounded-lg bg-[#0e1424]/80 border border-[#1e293b] text-slate-300 hover:text-white backdrop-blur-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden bg-[#0a0f1c]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(20, 30, 55, 0.45) 0%, rgba(10, 15, 28, 1) 100%)',
        }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="tacticalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#172238" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="#253555" />
            </pattern>
            {/* Road Pulse Gradient */}
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="verifiedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            {/* Epicenter Radial Gradient */}
            <radialGradient id="epicenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.45)" />
              <stop offset="40%" stopColor="rgba(239, 68, 68, 0.15)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Background Tactical Grid */}
          {showGrid && <rect width="1000" height="650" fill="url(#tacticalGrid)" />}

          {/* Topographic Hazard Contours / Rivers */}
          <path
            d="M 120 0 Q 150 180 180 320 T 300 500 T 520 650"
            fill="none"
            stroke="#162c46"
            strokeWidth="14"
            opacity="0.5"
          />
          <path
            d="M 120 0 Q 150 180 180 320 T 300 500 T 520 650"
            fill="none"
            stroke="#1f3e63"
            strokeWidth="4"
            opacity="0.8"
          />
          <text x="195" y="310" fill="#2d527c" fontSize="10" fontFamily="monospace" letterSpacing="2">
            RIVER YAMUNA WEST TRIBUTARY
          </text>

          {/* Epicenter Hazard Glow & Rings */}
          {showEpicenter && (
            <g transform={`translate(${state.epicenter[0]}, ${state.epicenter[1]})`}>
              <circle cx="0" cy="0" r="140" fill="url(#epicenterGlow)" />
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                className="wave-ring-1"
              />
              <circle
                cx="0"
                cy="0"
                r="60"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.8"
                className="wave-ring-2"
              />
              <circle
                cx="0"
                cy="0"
                r="95"
                fill="none"
                stroke="#f87171"
                strokeWidth="1.2"
                className="wave-ring-3"
              />
              {/* Center point */}
              <circle cx="0" cy="0" r="6" fill="#ef4444" />
              <circle cx="0" cy="0" r="12" fill="none" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3,3" />
              <text x="14" y="4" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="monospace">
                M{state.earthquakeMagnitude} SEISMIC EPICENTER
              </text>
            </g>
          )}

          {/* Visual Road Network Polylines */}
          <g>
            {state.routes.map((route) => {
              const pathD = getRouteSvgPath(route.coordinates);
              const style = getRouteStyle(route);
              const isSelected = state.selectedRouteId === route.id;
              const isHovered = hoveredRoute?.id === route.id;

              return (
                <g
                  key={route.id}
                  className="cursor-pointer group"
                  onClick={() => selectRoute(route.id)}
                  onMouseEnter={() => setHoveredRoute(route)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  {/* Outer glow line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={isSelected || isHovered ? 10 : 6}
                    opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.2}
                    style={{ filter: style.glow }}
                  />

                  {/* Core Road Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={isSelected ? 4.5 : 3}
                    strokeDasharray={style.strokeDasharray}
                    className={style.className}
                  />

                  {/* Road Midway Hazard Indicator / Label */}
                  {route.coordinates.length >= 3 && (
                    <g
                      transform={`translate(${route.coordinates[2][0]}, ${route.coordinates[2][1]})`}
                      className="pointer-events-auto"
                    >
                      {route.status === 'blocked' ? (
                        <g>
                          <circle cx="0" cy="0" r="13" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                          <text x="-5" y="4" fill="#ffffff" fontSize="12" fontWeight="bold">
                            ✕
                          </text>
                        </g>
                      ) : route.verified ? (
                        <g>
                          <circle cx="0" cy="0" r="11" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                          <text x="-4" y="3" fill="#ffffff" fontSize="10" fontWeight="bold">
                            ✓
                          </text>
                        </g>
                      ) : (
                        <g>
                          <circle cx="0" cy="0" r="11" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                          <text x="-3" y="3" fill="#ffffff" fontSize="10" fontWeight="bold">
                            ?
                          </text>
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Command Hub Base Alpha */}
          <g transform="translate(200, 480)" className="cursor-pointer group">
            <circle cx="0" cy="0" r="28" fill="#1e293b" opacity="0.6" />
            <circle cx="0" cy="0" r="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="0" cy="0" r="6" fill="#60a5fa" />
            <text x="-45" y="32" fill="#93c5fd" fontSize="10" fontWeight="bold" fontFamily="monospace">
              ALPHA COMMAND BASE
            </text>
          </g>

          {/* Shelters Markers (Purple) */}
          {state.shelters.map((shelter) => (
            <g
              key={shelter.id}
              transform={`translate(${shelter.coordinates[0]}, ${shelter.coordinates[1]})`}
              className="cursor-pointer group"
              onMouseEnter={() =>
                setHoveredNode({
                  type: 'Shelter',
                  title: shelter.name,
                  subtitle: `${shelter.currentOccupancy}/${shelter.totalCapacity} Occupied`,
                })
              }
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle cx="0" cy="0" r="16" fill="#3b0764" stroke="#a855f7" strokeWidth="2.5" />
              <rect x="-5" y="-5" width="10" height="10" fill="#d8b4fe" rx="1" />
              <text x="18" y="4" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {shelter.name}
              </text>
            </g>
          ))}

          {/* Hospitals Markers (Blue Cross) */}
          {state.hospitals.map((hosp) => (
            <g
              key={hosp.id}
              transform={`translate(${hosp.coordinates[0]}, ${hosp.coordinates[1]})`}
              className="cursor-pointer group"
              onMouseEnter={() =>
                setHoveredNode({
                  type: 'Hospital',
                  title: hosp.name,
                  subtitle: `${hosp.icuBedsAvailable} ICU Beds Ready`,
                })
              }
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle cx="0" cy="0" r="15" fill="#082f49" stroke="#0284c7" strokeWidth="2" />
              <path d="M -2 -7 L 2 -7 L 2 -2 L 7 -2 L 7 2 L 2 2 L 2 7 L -2 7 L -2 2 L -7 2 L -7 -2 L -2 -2 Z" fill="#38bdf8" />
              <text x="18" y="4" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {hosp.name}
              </text>
            </g>
          ))}

          {/* Rescue Teams Positions (Green) */}
          {state.rescueTeams.map((team) => (
            <g
              key={team.id}
              transform={`translate(${team.coordinates[0]}, ${team.coordinates[1]})`}
              className="cursor-pointer group"
              onMouseEnter={() =>
                setHoveredNode({
                  type: 'Rescue Unit',
                  title: team.callsign,
                  subtitle: `${team.status.toUpperCase()} (${team.personnel} crew)`,
                })
              }
              onMouseLeave={() => setHoveredNode(null)}
            >
              <circle cx="0" cy="0" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
              <polygon points="0,-6 6,5 -6,5" fill="#34d399" />
              <text x="16" y="4" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {team.callsign}
              </text>
            </g>
          ))}

          {/* Incidents Markers (Red Pulse) */}
          {state.incidents.map((inc) => {
            const isSelected = inc.id === state.selectedIncidentId;
            return (
              <g
                key={inc.id}
                transform={`translate(${inc.coordinates[0]}, ${inc.coordinates[1]})`}
                className="cursor-pointer"
                onClick={() => selectIncident(inc.id)}
                onMouseEnter={() =>
                  setHoveredNode({
                    type: 'Incident',
                    title: inc.title,
                    subtitle: `${inc.peopleAffected} Affected | ${inc.severity.toUpperCase()}`,
                  })
                }
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Expanding ping ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 26 : 18}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="animate-ping"
                  opacity="0.6"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 20 : 15}
                  fill="#7f1d1d"
                  stroke={isSelected ? '#ffffff' : '#ef4444'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all"
                />
                <text x="-4" y="4" fill="#ffffff" fontSize="11" fontWeight="extrabold">
                  !
                </text>
                <text
                  x="22"
                  y="4"
                  fill={isSelected ? '#ffffff' : '#fca5a5'}
                  fontSize={isSelected ? 11 : 9}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {inc.code}: {inc.location}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selection Inspector Tooltip Overlay */}
        {(hoveredRoute || hoveredNode) && (
          <div className="absolute bottom-4 left-4 max-w-sm p-3 rounded-lg bg-[#0e1424]/95 border border-[#2a3b5c] backdrop-blur-md shadow-2xl text-xs z-20 pointer-events-none animate-fadeIn">
            {hoveredRoute && (
              <div>
                <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                  <span className="font-mono text-cyan-400">{hoveredRoute.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      hoveredRoute.status === 'blocked'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : hoveredRoute.verified
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {hoveredRoute.status === 'blocked'
                      ? 'BLOCKED'
                      : hoveredRoute.verified
                      ? 'VERIFIED'
                      : 'UNVERIFIED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Distance: {hoveredRoute.distanceKm} km | Est. Travel Time:{' '}
                  {hoveredRoute.estimatedMinutes} mins
                </p>
                {hoveredRoute.blockageReason && (
                  <p className="text-[11px] text-red-400 mt-1 font-mono">
                    Hazard: {hoveredRoute.blockageReason}
                  </p>
                )}
                {hoveredRoute.verificationSource && (
                  <p className="text-[10px] text-emerald-400/90 mt-1 font-mono">
                    Source: {hoveredRoute.verificationSource}
                  </p>
                )}
                <p className="text-[9px] text-slate-400 mt-1.5 italic">
                  Click to select route or toggle status in Simulation controls.
                </p>
              </div>
            )}
            {hoveredNode && !hoveredRoute && (
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                  {hoveredNode.type}
                </span>
                <p className="font-bold text-white text-sm">{hoveredNode.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{hoveredNode.subtitle}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-[#0e1424] border-t border-[#1e293b] flex flex-wrap items-center justify-between text-[11px] font-mono gap-y-2 z-10">
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Legend:</span>
          <span className="flex items-center space-x-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Incidents</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Rescue Units</span>
          </span>
          <span className="flex items-center space-x-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Shelters</span>
          </span>
          <span className="flex items-center space-x-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span>Hospitals</span>
          </span>
        </div>

        {/* Route Status Legend */}
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-5 h-0.5 bg-emerald-400 inline-block"></span>
            <span>Verified Clear</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-amber-400 inline-block"></span>
            <span>Possible (Unverified)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-red-400">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-red-500 inline-block"></span>
            <span>Blocked / Severed</span>
          </span>
        </div>
      </div>
    </div>
  );
};
