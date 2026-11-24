import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Radio,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { RouteSegment } from '../../types';

export const LiveDisasterMap: React.FC = () => {
  const {
    state,
    selectIncident,
    selectRoute,
  } = useSimulation();

  const isLight = state.theme === 'light';

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
      };
    }
    if (route.verified) {
      return {
        stroke: '#10b981',
        strokeDasharray: 'none',
        className: 'route-flow-fast',
        glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.85))',
      };
    }
    // Clear but Unverified (Amber dashed)
    return {
      stroke: '#f59e0b',
      strokeDasharray: '6,4',
      className: 'route-flow',
      glow: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.75))',
    };
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border shadow-xl overflow-hidden h-[540px] transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200'
          : 'bg-[#131a2a] border-[#1e293b]'
      }`}
    >
      {/* Top Map Header & Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        {/* Disaster Active Epicenter Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-md ${
              isLight
                ? 'bg-red-50/95 border-red-300 text-red-800'
                : 'bg-red-950/80 border-red-500/50 text-white shadow-red-950/60'
            }`}
          >
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`text-xs font-black tracking-wider font-mono ${
                    isLight ? 'text-red-900' : 'text-white'
                  }`}
                >
                  EARTHQUAKE SIMULATION ACTIVE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white font-mono">
                  M{state.earthquakeMagnitude}
                </span>
              </div>
              <p
                className={`text-[9px] font-mono ${
                  isLight ? 'text-red-700' : 'text-red-300'
                }`}
              >
                Epicenter: 28°36'N 77°12'E | Radius: {state.affectedRadiusKm} km
              </p>
            </div>
          </div>

          {/* Scenario Indicator Pill */}
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border backdrop-blur-md text-[11px] font-mono shadow-sm ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700'
                : 'bg-[#0e1424]/90 border-[#2a3b5c] text-slate-300'
            }`}
          >
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Mode:</span>
            <span
              className={`font-semibold uppercase ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
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
            className={`p-2 rounded-lg backdrop-blur-md border text-xs transition-all shadow-sm ${
              showGrid
                ? isLight
                  ? 'bg-sky-100 border-sky-300 text-sky-700'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : isLight
                ? 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowEpicenter(!showEpicenter)}
            title="Toggle Epicenter Wave"
            className={`p-2 rounded-lg backdrop-blur-md border text-xs transition-all shadow-sm ${
              showEpicenter
                ? isLight
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-red-500/20 border-red-500/40 text-red-400'
                : isLight
                ? 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className={`p-2 rounded-lg border backdrop-blur-md shadow-sm ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className={`p-2 rounded-lg border backdrop-blur-md shadow-sm ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-300 hover:text-white'
            }`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className={`p-2 rounded-lg border backdrop-blur-md shadow-sm ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#0e1424]/80 border-[#1e293b] text-slate-300 hover:text-white'
            }`}
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
        className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden ${
          isLight ? 'bg-[#f8fafc]' : 'bg-[#0a0f1c]'
        }`}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.9) 0%, rgba(248, 250, 252, 1) 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(20, 30, 55, 0.45) 0%, rgba(10, 15, 28, 1) 100%)',
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
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={isLight ? '#e2e8f0' : '#172238'}
                strokeWidth="0.8"
              />
              <circle cx="0" cy="0" r="1.5" fill={isLight ? '#cbd5e1' : '#253555'} />
            </pattern>
            {/* Epicenter Radial Gradient */}
            <radialGradient id="epicenterGlow" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={isLight ? 'rgba(239, 68, 68, 0.28)' : 'rgba(239, 68, 68, 0.45)'}
              />
              <stop
                offset="40%"
                stopColor={isLight ? 'rgba(239, 68, 68, 0.10)' : 'rgba(239, 68, 68, 0.15)'}
              />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Background Tactical Grid */}
          {showGrid && <rect width="1000" height="650" fill="url(#tacticalGrid)" />}

          {/* Topographic Hazard Contours / Rivers */}
          <path
            d="M 120 0 Q 150 180 180 320 T 300 500 T 520 650"
            fill="none"
            stroke={isLight ? '#e0f2fe' : '#162c46'}
            strokeWidth="14"
            opacity="0.8"
          />
          <path
            d="M 120 0 Q 150 180 180 320 T 300 500 T 520 650"
            fill="none"
            stroke={isLight ? '#7dd3fc' : '#1f3e63'}
            strokeWidth="4"
            opacity="0.9"
          />
          <text
            x="195"
            y="310"
            fill={isLight ? '#0284c7' : '#2d527c'}
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fontWeight="bold"
          >
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
              <circle cx="0" cy="0" r="12" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
              <text
                x="14"
                y="4"
                fill={isLight ? '#b91c1c' : '#f87171'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
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
                    opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.25}
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
                          <circle cx="0" cy="0" r="13" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                          <text x="-5" y="4" fill="#ffffff" fontSize="12" fontWeight="bold">
                            ✕
                          </text>
                        </g>
                      ) : route.verified ? (
                        <g>
                          <circle cx="0" cy="0" r="11" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                          <text x="-4" y="3" fill="#ffffff" fontSize="10" fontWeight="bold">
                            ✓
                          </text>
                        </g>
                      ) : (
                        <g>
                          <circle cx="0" cy="0" r="11" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
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
            <circle cx="0" cy="0" r="28" fill={isLight ? '#e0e7ff' : '#1e293b'} opacity="0.7" />
            <circle cx="0" cy="0" r="18" fill="#2563eb" stroke="#1d4ed8" strokeWidth="3" />
            <circle cx="0" cy="0" r="6" fill="#ffffff" />
            <text
              x="-45"
              y="32"
              fill={isLight ? '#1e40af' : '#93c5fd'}
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
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
              <circle cx="0" cy="0" r="16" fill="#7e22ce" stroke="#ffffff" strokeWidth="2.5" />
              <rect x="-5" y="-5" width="10" height="10" fill="#ffffff" rx="1" />
              <text
                x="18"
                y="4"
                fill={isLight ? '#6b21a8' : '#c084fc'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
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
              <circle cx="0" cy="0" r="15" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <path
                d="M -2 -7 L 2 -7 L 2 -2 L 7 -2 L 7 2 L 2 2 L 2 7 L -2 7 L -2 2 L -7 2 L -7 -2 L -2 -2 Z"
                fill="#ffffff"
              />
              <text
                x="18"
                y="4"
                fill={isLight ? '#0369a1' : '#38bdf8'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
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
              <circle cx="0" cy="0" r="14" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
              <polygon points="0,-6 6,5 -6,5" fill="#ffffff" />
              <text
                x="16"
                y="4"
                fill={isLight ? '#047857' : '#34d399'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
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
                  fill="#dc2626"
                  stroke={isSelected ? '#ffffff' : '#fca5a5'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all"
                />
                <text x="-4" y="4" fill="#ffffff" fontSize="11" fontWeight="extrabold">
                  !
                </text>
                <text
                  x="22"
                  y="4"
                  fill={isLight ? (isSelected ? '#991b1b' : '#b91c1c') : isSelected ? '#ffffff' : '#fca5a5'}
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
          <div
            className={`absolute bottom-4 left-4 max-w-sm p-3 rounded-lg border backdrop-blur-md shadow-xl text-xs z-20 pointer-events-none ${
              isLight
                ? 'bg-white/95 border-slate-200 text-slate-800'
                : 'bg-[#0e1424]/95 border-[#2a3b5c] text-white'
            }`}
          >
            {hoveredRoute && (
              <div>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className={`font-mono ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                    {hoveredRoute.name}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      hoveredRoute.status === 'blocked'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : hoveredRoute.verified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {hoveredRoute.status === 'blocked'
                      ? 'BLOCKED'
                      : hoveredRoute.verified
                      ? 'VERIFIED'
                      : 'UNVERIFIED'}
                  </span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Distance: {hoveredRoute.distanceKm} km | Est. Travel Time:{' '}
                  {hoveredRoute.estimatedMinutes} mins
                </p>
                {hoveredRoute.blockageReason && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-mono">
                    Hazard: {hoveredRoute.blockageReason}
                  </p>
                )}
                {hoveredRoute.verificationSource && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    Source: {hoveredRoute.verificationSource}
                  </p>
                )}
              </div>
            )}
            {hoveredNode && !hoveredRoute && (
              <div>
                <span
                  className={`text-[10px] uppercase font-mono font-bold tracking-wider ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {hoveredNode.type}
                </span>
                <p
                  className={`font-bold text-sm ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {hoveredNode.title}
                </p>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  {hoveredNode.subtitle}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div
        className={`px-4 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] font-mono gap-y-2 z-10 transition-colors duration-200 ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-[#0e1424] border-[#1e293b] text-slate-300'
        }`}
      >
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          <span
            className={`font-bold uppercase text-[10px] ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Legend:
          </span>
          <span className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Incidents</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Rescue Units</span>
          </span>
          <span className="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Shelters</span>
          </span>
          <span className="flex items-center space-x-1.5 text-sky-600 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span>Hospitals</span>
          </span>
        </div>

        {/* Route Status Legend */}
        <div className="flex items-center space-x-4 flex-wrap gap-y-1">
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-5 h-0.5 bg-emerald-500 inline-block"></span>
            <span>Verified Clear</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-amber-500 inline-block"></span>
            <span>Possible (Unverified)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-red-500 inline-block"></span>
            <span>Blocked / Severed</span>
          </span>
        </div>
      </div>
    </div>
  );
};
