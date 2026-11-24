import { Incident, RouteSegment, AISafetyRecommendation } from '../types';

/**
 * SOLACE AI Routing & Verification Engine
 * Strictly adheres to Zero-Hallucination & Verification Guardrails:
 * 1. Identify incident and evaluate primary route.
 * 2. If primary is blocked, search defined map network for alternative routes.
 * 3. Never invent routes not present in the graph.
 * 4. Never claim safety unless status is 'clear' AND verified is true.
 * 5. If no alternative exists or all are blocked, state: "Insufficient information to identify an alternative route. Manual reconnaissance required."
 */
export function analyzeIncidentRouting(
  incident: Incident,
  allRoutes: RouteSegment[]
): AISafetyRecommendation {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }) + ' UTC';

  // 1. Find Primary Route in network data
  const primaryRoute = allRoutes.find(
    (r) => r.id === incident.primaryRouteId || (r.toNodeId === incident.id && r.type === 'primary')
  );

  // Fallback if primary route not defined in graph
  const primaryRouteName = primaryRoute ? primaryRoute.name : 'Unassigned Primary Corridor';
  const primaryStatus = primaryRoute ? primaryRoute.status : 'blocked';
  const primaryVerified = primaryRoute ? primaryRoute.verified : false;
  const isPrimaryUsable = primaryStatus === 'clear' && primaryVerified === true;

  let primaryReason = '';
  if (!primaryRoute) {
    primaryReason = 'No registered primary corridor defined in municipal GIS database.';
  } else if (primaryRoute.status === 'blocked') {
    primaryReason = primaryRoute.blockageReason || 'Severe road obstruction/landslide detected on corridor.';
  } else if (!primaryRoute.verified) {
    primaryReason = 'Corridor physically open but unverified by sensor or field reconnaissance.';
  } else {
    primaryReason = 'Corridor clear and verified by active telemetry sensors.';
  }

  // 2. Evaluate Alternative Routes in ground-truth road graph
  // Only search existing routes in allRoutes connected to this incident or registered as alternative
  const alternativeRoutes = allRoutes.filter((r) => {
    if (r.id === primaryRoute?.id) return false;
    // Route must lead to this incident or be assigned as alternative
    return (
      r.id === incident.alternativeRouteId ||
      (r.toNodeId === incident.id && (r.type === 'alternative' || r.type === 'auxiliary'))
    );
  });

  // Check if an alternative route exists in map data
  const candidateAlternative = alternativeRoutes.length > 0 ? alternativeRoutes[0] : null;

  // Determine Risk Level string
  let riskLevel: 'CRITICAL RISK' | 'HIGH RISK' | 'MODERATE RISK' | 'LOW RISK' = 'MODERATE RISK';
  if (incident.riskScore >= 80) riskLevel = 'CRITICAL RISK';
  else if (incident.riskScore >= 60) riskLevel = 'HIGH RISK';
  else if (incident.riskScore >= 40) riskLevel = 'MODERATE RISK';
  else riskLevel = 'LOW RISK';

  // CASE 1: Primary Route is CLEAR and VERIFIED
  if (isPrimaryUsable) {
    return {
      incidentId: incident.id,
      incidentTitle: incident.title,
      riskScore: incident.riskScore,
      riskLevel,
      primaryRouteAnalysis: {
        routeId: primaryRoute?.id || '',
        routeName: primaryRouteName,
        status: primaryStatus,
        verified: primaryVerified,
        isUsable: true,
        reason: primaryReason,
      },
      alternativeRouteAnalysis: {
        exists: candidateAlternative !== null,
        routeId: candidateAlternative?.id,
        routeName: candidateAlternative?.name,
        status: candidateAlternative?.status,
        verified: candidateAlternative?.verified,
        verificationBadge: candidateAlternative?.verified ? 'VERIFIED' : 'UNVERIFIED',
      },
      recommendationDecision: 'USE_PRIMARY',
      headlineRecommendation: `PRIMARY ROUTE APPROVED: Dispatch via ${primaryRouteName}`,
      detailedProtocol: `SOLACE Guardrail Check Passed: Primary route ${primaryRouteName} is confirmed CLEAR and VERIFIED by active telemetry. Immediate rescue fleet deployment authorized along standard emergency corridor. Distance: ${primaryRoute?.distanceKm} km (Est. ${primaryRoute?.estimatedMinutes} mins).`,
      strictGuardrailCompliance: true,
      telemetryTimestamp: timestamp,
    };
  }

  // CASE 2: Primary Route is BLOCKED - Now check Alternative Route
  // Subcase 2A: Alternative exists in map data AND is VERIFIED clear
  if (candidateAlternative && candidateAlternative.status === 'clear' && candidateAlternative.verified === true) {
    return {
      incidentId: incident.id,
      incidentTitle: incident.title,
      riskScore: Math.min(100, incident.riskScore + 5), // Slight bump due to detour
      riskLevel,
      primaryRouteAnalysis: {
        routeId: primaryRoute?.id || '',
        routeName: primaryRouteName,
        status: primaryStatus,
        verified: primaryVerified,
        isUsable: false,
        reason: primaryReason,
      },
      alternativeRouteAnalysis: {
        exists: true,
        routeId: candidateAlternative.id,
        routeName: candidateAlternative.name,
        status: candidateAlternative.status,
        verified: true,
        verificationBadge: 'VERIFIED',
        verificationSource: candidateAlternative.verificationSource || 'Field Recon & Drone Telemetry',
      },
      recommendationDecision: 'USE_ALTERNATIVE_VERIFIED',
      headlineRecommendation: `REROUTE TO ALTERNATIVE: Primary Blocked → ${candidateAlternative.name} (VERIFIED)`,
      detailedProtocol: `CRITICAL ALERT: Primary corridor ${primaryRouteName} is BLOCKED (${primaryReason}). In accordance with emergency rerouting protocols, SOLACE has scanned municipal GIS data and identified alternative corridor: ${candidateAlternative.name}. Verification status: VERIFIED CLEAR via ${candidateAlternative.verificationSource || 'Drone Recon'}. Cleared for emergency dispatch. Distance: ${candidateAlternative.distanceKm} km (Est. ${candidateAlternative.estimatedMinutes} mins).`,
      strictGuardrailCompliance: true,
      telemetryTimestamp: timestamp,
    };
  }

  // Subcase 2B: Alternative exists in map data BUT is UNVERIFIED (or safety not confirmed)
  if (candidateAlternative && candidateAlternative.status === 'clear' && candidateAlternative.verified === false) {
    return {
      incidentId: incident.id,
      incidentTitle: incident.title,
      riskScore: Math.min(100, incident.riskScore + 12), // Higher risk due to unverified path
      riskLevel,
      primaryRouteAnalysis: {
        routeId: primaryRoute?.id || '',
        routeName: primaryRouteName,
        status: primaryStatus,
        verified: primaryVerified,
        isUsable: false,
        reason: primaryReason,
      },
      alternativeRouteAnalysis: {
        exists: true,
        routeId: candidateAlternative.id,
        routeName: candidateAlternative.name,
        status: candidateAlternative.status,
        verified: false,
        verificationBadge: 'UNVERIFIED',
        verificationSource: candidateAlternative.verificationSource || 'Unconfirmed Municipal Graph',
        warningMessage: 'Caution: Safety not confirmed by field reconnaissance or sensor telemetry.',
      },
      recommendationDecision: 'CAUTION_ALTERNATIVE_UNVERIFIED',
      headlineRecommendation: `POSSIBLE ROUTE IDENTIFIED: ${candidateAlternative.name} (UNVERIFIED)`,
      detailedProtocol: `WARNING: Primary corridor ${primaryRouteName} is BLOCKED (${primaryReason}). SOLACE map graph identified potential bypass: ${candidateAlternative.name}. However, strict anti-hallucination guardrails flag this corridor as UNVERIFIED. Safety and bridge integrity are not confirmed. Recommend immediate aerial drone sweep or scout squad dispatch before routing heavy transport.`,
      strictGuardrailCompliance: true,
      telemetryTimestamp: timestamp,
    };
  }

  // Subcase 2C: Primary is blocked AND (no alternative exists OR all alternatives are blocked)
  return {
    incidentId: incident.id,
    incidentTitle: incident.title,
    riskScore: Math.min(100, incident.riskScore + 20), // Peak risk due to total cut-off
    riskLevel: 'CRITICAL RISK',
    primaryRouteAnalysis: {
      routeId: primaryRoute?.id || '',
      routeName: primaryRouteName,
      status: primaryStatus,
      verified: primaryVerified,
      isUsable: false,
      reason: primaryReason,
    },
    alternativeRouteAnalysis: {
      exists: false,
      verificationBadge: 'NONE',
      warningMessage: 'No passable secondary corridor present in active GIS network.',
    },
    recommendationDecision: 'INSUFFICIENT_INFORMATION',
    headlineRecommendation: 'CRITICAL ACCESS FAILURE: Total Route Isolation',
    detailedProtocol: `Insufficient information to identify an alternative route. Manual reconnaissance required. SOLACE AI will not speculate or generate unverified corridors. All known registered arteries into ${incident.location} are either blocked or absent from verified road network. Deploy UAV reconnaissance or helicopter winch rescue immediately.`,
    strictGuardrailCompliance: true,
    telemetryTimestamp: timestamp,
  };
}
