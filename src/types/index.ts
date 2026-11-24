export type Severity = 'critical' | 'high' | 'moderate' | 'low' | 'resolved';

export type RouteStatus = 'clear' | 'blocked' | 'impassable';

export type RouteVerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'PENDING';

export interface RouteSegment {
  id: string;
  name: string;
  type: 'primary' | 'alternative' | 'auxiliary';
  fromNodeId: string;
  toNodeId: string;
  distanceKm: number;
  estimatedMinutes: number;
  status: RouteStatus;
  verified: boolean;
  verificationSource?: string;
  blockageReason?: string;
  coordinates: [number, number][]; // [x, y] in percentage or map coordinates
  hazardType?: 'landslide' | 'structural_collapse' | 'flood' | 'debris' | 'none';
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  location: string;
  coordinates: [number, number];
  severity: Severity;
  type: 'collapse' | 'landslide' | 'fire' | 'flood' | 'medical';
  peopleAffected: number;
  casualtiesConfirmed: number;
  trappedCivilians: number;
  reportedTime: string;
  status: 'active' | 'contained' | 'resolved';
  assignedTeamId?: string;
  primaryRouteId: string;
  alternativeRouteId?: string;
  description: string;
  riskScore: number; // 0 - 100
}

export interface RescueTeam {
  id: string;
  callsign: string;
  type: 'USAR' | 'MEDEVAC' | 'ENGINEER' | 'HAZMAT';
  leader: string;
  personnel: number;
  location: string;
  coordinates: [number, number];
  status: 'deployed' | 'en_route' | 'standby' | 'returning';
  assignedIncidentId?: string;
  vehicleType: string;
  equipment: string[];
  batteryPercent: number;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  totalCapacity: number;
  currentOccupancy: number;
  status: 'available' | 'near_capacity' | 'full';
  amenities: string[];
  medicalAidAvailable: boolean;
  foodSuppliesDays: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  totalBeds: number;
  icuBedsAvailable: number;
  triageStatus: 'operational' | 'high_load' | 'critical';
  traumaCenterLevel: 1 | 2 | 3;
}

export interface AlertNotification {
  id: string;
  priority: 'High Priority' | 'Moderate' | 'Info' | 'Critical';
  title: string;
  message: string;
  timestamp: string;
  incidentId?: string;
  routeId?: string;
  read: boolean;
  actionRequired?: boolean;
}

export type ScenarioType = 'scenario-a' | 'scenario-b' | 'scenario-c' | 'custom';

export interface AISafetyRecommendation {
  incidentId: string;
  incidentTitle: string;
  riskScore: number;
  riskLevel: 'CRITICAL RISK' | 'HIGH RISK' | 'MODERATE RISK' | 'LOW RISK';
  primaryRouteAnalysis: {
    routeId: string;
    routeName: string;
    status: RouteStatus;
    verified: boolean;
    isUsable: boolean;
    reason: string;
  };
  alternativeRouteAnalysis: {
    exists: boolean;
    routeId?: string;
    routeName?: string;
    status?: RouteStatus;
    verified?: boolean;
    verificationBadge: 'VERIFIED' | 'UNVERIFIED' | 'NONE';
    verificationSource?: string;
    warningMessage?: string;
  };
  recommendationDecision: 'USE_PRIMARY' | 'USE_ALTERNATIVE_VERIFIED' | 'CAUTION_ALTERNATIVE_UNVERIFIED' | 'INSUFFICIENT_INFORMATION';
  headlineRecommendation: string;
  detailedProtocol: string;
  strictGuardrailCompliance: boolean;
  telemetryTimestamp: string;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number;
  activeScenario: ScenarioType;
  disasterType: 'Earthquake' | 'Flash Flood' | 'Landslide' | 'Cyclone';
  earthquakeMagnitude: number;
  epicenter: [number, number]; // [x, y] in percentage
  affectedRadiusKm: number;
  selectedIncidentId: string;
  selectedRouteId: string | null;
  routes: RouteSegment[];
  incidents: Incident[];
  rescueTeams: RescueTeam[];
  shelters: Shelter[];
  hospitals: Hospital[];
  alerts: AlertNotification[];
  audioAlertsEnabled: boolean;
  activeTab: 'dashboard' | 'simulate' | 'incidents' | 'resources' | 'ai-assistant' | 'reports' | 'settings';
  searchQuery: string;
}
