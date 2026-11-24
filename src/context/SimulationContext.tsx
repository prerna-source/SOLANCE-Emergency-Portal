import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  SimulationState,
  ScenarioType,
  Incident,
  RouteSegment,
  AlertNotification,
  RescueTeam,
  Shelter,
  Hospital,
  AISafetyRecommendation,
} from '../types';
import {
  INITIAL_ROUTES,
  INITIAL_INCIDENTS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_SHELTERS,
  INITIAL_HOSPITALS,
  INITIAL_ALERTS,
} from '../data/mockData';
import { analyzeIncidentRouting } from '../utils/aiRouter';
import { soundEffects } from '../utils/soundEffects';

interface SimulationContextType {
  state: SimulationState;
  activeIncident: Incident;
  aiRecommendation: AISafetyRecommendation;
  kpis: {
    activeIncidentsCount: number;
    peopleAffectedCount: number;
    rescueTeamsDeployedCount: number;
    sheltersAvailableCount: number;
    totalShelterCapacity: number;
    shelterOccupancyRate: number;
  };
  setActiveTab: (tab: SimulationState['activeTab']) => void;
  setSearchQuery: (query: string) => void;
  toggleSimulation: (running?: boolean) => void;
  setSpeed: (speed: number) => void;
  setScenario: (scenario: ScenarioType) => void;
  setDisasterType: (type: SimulationState['disasterType']) => void;
  setMagnitude: (mag: number) => void;
  toggleRouteBlock: (routeId: string) => void;
  toggleRouteVerification: (routeId: string) => void;
  selectIncident: (incidentId: string) => void;
  selectRoute: (routeId: string | null) => void;
  dispatchTeam: (teamId: string, incidentId: string) => void;
  toggleAudio: (enabled?: boolean) => void;
  dismissAlert: (alertId: string) => void;
  triggerEmergencyBroadcast: () => void;
  resetSimulation: () => void;
  toggleTheme: (theme?: 'light' | 'dark') => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteSegment[]>(INITIAL_ROUTES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(INITIAL_RESCUE_TEAMS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeedState] = useState<number>(1);
  const [activeScenario, setActiveScenarioState] = useState<ScenarioType>('scenario-a');
  const [disasterType, setDisasterTypeState] = useState<SimulationState['disasterType']>('Earthquake');
  const [earthquakeMagnitude, setEarthquakeMagnitude] = useState<number>(6.8);
  const [affectedRadiusKm, setAffectedRadiusKm] = useState<number>(18.5);
  const [epicenter, setEpicenter] = useState<[number, number]>([530, 270]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-sector12');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-nh48-primary');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTabState] = useState<SimulationState['activeTab']>('dashboard');
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (val?: 'light' | 'dark') => {
    const next = val !== undefined ? val : theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
  };

  // Apply predefined scenarios strictly
  const applyScenario = (scenario: ScenarioType) => {
    setActiveScenarioState(scenario);
    soundEffects.playBeep(650, 0.1);

    if (scenario === 'scenario-a') {
      // Scenario A: Primary Blocked -> Alternative exists and is VERIFIED
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === 'route-nh48-primary') {
            return {
              ...r,
              status: 'blocked',
              verified: false,
              blockageReason: 'Major Landslide & Highway Fissure at Mile Marker 14',
            };
          }
          if (r.id === 'route-south-ridge-alt') {
            return {
              ...r,
              status: 'clear',
              verified: true,
              verificationSource: 'UAV-Recon Drone Unit 03 (Live Telemetry confirmed clear)',
            };
          }
          if (r.id === 'route-east-ring-aux') {
            return {
              ...r,
              status: 'clear',
              verified: false,
              verificationSource: 'Unverified Satellite Optical Feed (Debris status unknown)',
            };
          }
          return r;
        })
      );
      setSelectedIncidentId('inc-sector12');
      addAlertNotification({
        priority: 'Critical',
        title: 'Scenario A Activated: Blocked Primary → Verified Alternative',
        message: 'Primary NH-48 corridor severed by landslide. South Ridge Bypass B-7 confirmed VERIFIED by UAV-03.',
      });
    } else if (scenario === 'scenario-b') {
      // Scenario B: Primary Blocked -> Alternative exists in map data, but is UNVERIFIED
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === 'route-nh48-primary') {
            return {
              ...r,
              status: 'blocked',
              verified: false,
              blockageReason: 'Bridge Structural Fracture at NH-48 Overpass',
            };
          }
          if (r.id === 'route-south-ridge-alt') {
            return {
              ...r,
              status: 'clear',
              verified: false, // UNVERIFIED!
              verificationSource: 'Unconfirmed Municipal Graph (Drone telemetry offline)',
            };
          }
          if (r.id === 'route-east-ring-aux') {
            return {
              ...r,
              status: 'clear',
              verified: false,
              verificationSource: 'Satellite link degraded',
            };
          }
          return r;
        })
      );
      setSelectedIncidentId('inc-sector12');
      addAlertNotification({
        priority: 'Moderate',
        title: 'Scenario B Activated: Blocked Primary → Unverified Alternative',
        message: 'Primary NH-48 blocked. Alternative Route Beta is present on map but UNVERIFIED. Recon needed.',
      });
    } else if (scenario === 'scenario-c') {
      // Scenario C: Total Isolation -> Insufficient Information
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === 'route-nh48-primary') {
            return {
              ...r,
              status: 'blocked',
              verified: false,
              blockageReason: 'Catastrophic Fissure across entire NH-48 Sector',
            };
          }
          if (r.id === 'route-south-ridge-alt') {
            return {
              ...r,
              status: 'blocked', // Both blocked!
              verified: false,
              blockageReason: 'Bridge Pier #4 Complete Structural Collapse',
            };
          }
          if (r.id === 'route-east-ring-aux') {
            return {
              ...r,
              status: 'blocked',
              verified: false,
              blockageReason: 'High-voltage power lines down across roadway',
            };
          }
          return r;
        })
      );
      setSelectedIncidentId('inc-sector12');
      addAlertNotification({
        priority: 'Critical',
        title: 'Scenario C Activated: Total Route Isolation',
        message: 'All known access corridors to Sector 12 severed. SOLACE reports Insufficient Information.',
      });
    }
  };

  const addAlertNotification = (alert: Omit<AlertNotification, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: AlertNotification = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
      ...alert,
    };
    setAlerts((prev) => [newAlert, ...prev.slice(0, 24)]);
    soundEffects.playAlert();
  };

  // Toggle route blocked status
  const toggleRouteBlock = (routeId: string) => {
    setActiveScenarioState('custom');
    soundEffects.playBeep(700, 0.08);
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const newStatus = r.status === 'blocked' ? 'clear' : 'blocked';
          return {
            ...r,
            status: newStatus,
            blockageReason: newStatus === 'blocked' ? 'Manually flagged roadblock by Command Operator' : undefined,
          };
        }
        return r;
      })
    );
  };

  // Toggle route verification status
  const toggleRouteVerification = (routeId: string) => {
    setActiveScenarioState('custom');
    soundEffects.playBeep(850, 0.08);
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const newVerified = !r.verified;
          return {
            ...r,
            verified: newVerified,
            verificationSource: newVerified
              ? 'Operator Override (Manual Sensor Affirmation)'
              : 'Pending Field Reconnaissance',
          };
        }
        return r;
      })
    );
  };

  // Select active incident
  const selectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    soundEffects.playBeep(750, 0.06);
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedRouteId(inc.primaryRouteId);
    }
  };

  const selectRoute = (routeId: string | null) => {
    setSelectedRouteId(routeId);
    if (routeId) soundEffects.playBeep(900, 0.05);
  };

  // Dispatch team
  const dispatchTeam = (teamId: string, incidentId: string) => {
    soundEffects.playDispatch();
    const inc = incidents.find((i) => i.id === incidentId);
    const team = rescueTeams.find((t) => t.id === teamId);

    setRescueTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            status: 'en_route',
            assignedIncidentId: incidentId,
            location: `En route to ${inc?.title || 'Sector'}`,
          };
        }
        return t;
      })
    );

    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id === incidentId) {
          return {
            ...i,
            assignedTeamId: teamId,
          };
        }
        return i;
      })
    );

    addAlertNotification({
      priority: 'Info',
      title: `Team Dispatched: ${team?.callsign || 'Rescue Unit'}`,
      message: `Deployed to ${inc?.location || 'Incident Site'}. Routing via active SOLACE corridor.`,
      incidentId,
    });
  };

  const toggleAudio = (enabled?: boolean) => {
    const nextVal = enabled !== undefined ? enabled : !audioAlertsEnabled;
    setAudioAlertsEnabled(nextVal);
    soundEffects.setEnabled(nextVal);
    if (nextVal) {
      soundEffects.playBeep(880, 0.1);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const triggerEmergencyBroadcast = () => {
    soundEffects.playEmergency();
    addAlertNotification({
      priority: 'Critical',
      title: '🚨 ALL-STATION EMERGENCY BROADCAST ISSUED',
      message: 'Civil Defense Siren Activated. All civilian populations within 18.5km radius instructed to seek designated shelters.',
    });
  };

  const resetSimulation = () => {
    setRoutes(INITIAL_ROUTES);
    setIncidents(INITIAL_INCIDENTS);
    setRescueTeams(INITIAL_RESCUE_TEAMS);
    setShelters(INITIAL_SHELTERS);
    setHospitals(INITIAL_HOSPITALS);
    setAlerts(INITIAL_ALERTS);
    setSelectedIncidentId('inc-sector12');
    setSelectedRouteId('route-nh48-primary');
    setActiveScenarioState('scenario-a');
    setIsRunning(true);
    soundEffects.playBeep(500, 0.15);
  };

  // Live simulation tick effect: updates random minor telemetry when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Periodic subtle telemetry update
      setShelters((prev) =>
        prev.map((s) => {
          if (s.currentOccupancy < s.totalCapacity && Math.random() > 0.6) {
            const delta = Math.floor(Math.random() * 3) + 1;
            return {
              ...s,
              currentOccupancy: Math.min(s.totalCapacity, s.currentOccupancy + delta),
            };
          }
          return s;
        })
      );
    }, 4000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Active Incident object
  const activeIncident = useMemo(() => {
    return incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
  }, [incidents, selectedIncidentId]);

  // Real-time AI Routing Analysis
  const aiRecommendation = useMemo(() => {
    return analyzeIncidentRouting(activeIncident, routes);
  }, [activeIncident, routes]);

  // Computed KPIs
  const kpis = useMemo(() => {
    const activeIncidentsCount = incidents.filter((i) => i.status !== 'resolved').length;
    const peopleAffectedCount = incidents.reduce((acc, curr) => acc + curr.peopleAffected, 0);
    const rescueTeamsDeployedCount = rescueTeams.filter((t) => t.status === 'deployed' || t.status === 'en_route').length;
    const sheltersAvailableCount = shelters.filter((s) => s.currentOccupancy < s.totalCapacity).length;
    const totalShelterCapacity = shelters.reduce((acc, curr) => acc + curr.totalCapacity, 0);
    const totalOccupancy = shelters.reduce((acc, curr) => acc + curr.currentOccupancy, 0);
    const shelterOccupancyRate = Math.round((totalOccupancy / (totalShelterCapacity || 1)) * 100);

    return {
      activeIncidentsCount,
      peopleAffectedCount,
      rescueTeamsDeployedCount,
      sheltersAvailableCount,
      totalShelterCapacity,
      shelterOccupancyRate,
    };
  }, [incidents, rescueTeams, shelters]);

  const value: SimulationContextType = {
    state: {
      isRunning,
      speed,
      activeScenario,
      disasterType,
      earthquakeMagnitude,
      epicenter,
      affectedRadiusKm,
      selectedIncidentId,
      selectedRouteId,
      routes,
      incidents,
      rescueTeams,
      shelters,
      hospitals,
      alerts,
      audioAlertsEnabled,
      activeTab,
      searchQuery,
      theme,
    },
    activeIncident,
    aiRecommendation,
    kpis,
    setActiveTab: setActiveTabState,
    setSearchQuery: setSearchQueryState,
    toggleSimulation: (val?: boolean) => setIsRunning((prev) => (val !== undefined ? val : !prev)),
    setSpeed: setSpeedState,
    setScenario: applyScenario,
    setDisasterType: setDisasterTypeState,
    setMagnitude: setEarthquakeMagnitude,
    toggleRouteBlock,
    toggleRouteVerification,
    selectIncident,
    selectRoute,
    dispatchTeam,
    toggleAudio,
    dismissAlert,
    triggerEmergencyBroadcast,
    resetSimulation,
    toggleTheme,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
