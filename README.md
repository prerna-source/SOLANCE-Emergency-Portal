# SOLACE — AI Emergency Command & Response System

> **A Mission-Critical AI Disaster Command Center with Strict Verification Guardrails & Zero-Hallucination Routing**  
> *Developed for a Digital Literacy & Crisis Response Innovation Project*  
> **Core Motto:** *"Not Me, But You"*

---

## 🚨 Overview

**SOLACE** is a real-time, interactive Emergency Operations Command Center designed for crisis managers, urban search & rescue (USAR) units, and disaster response authorities. Built with a sleek dark-mode command-center aesthetic (`#0b0f19`), it synchronizes live GIS road networks, disaster epicenter dynamics, casualty triage data, and multi-agency fleet deployment into a unified operational picture.

At the heart of SOLACE is the **Strict AI Routing & Verification Engine**, designed to prevent catastrophic AI hallucinations in life-or-death emergency rerouting.

---

## ⚡ Core AI Verification Guardrails

When assessing evacuation corridors and rescue dispatches, SOLACE operates under strict non-negotiable rules:

1. **Incident Identification & Primary Artery Evaluation:**  
   * When an incident is selected or simulated, SOLACE identifies the location, casualty count, and severity, and audits the registered **Primary Route**.
   * If the primary route is confirmed clear and verified, immediate dispatch is authorized.
   * If the primary corridor is **blocked** (e.g. seismic fissures or landslides), SOLACE flags the obstruction and automatically triggers an alternative route scan across available GIS network data.

2. **Alternative Route Transparency & Verification Status:**  
   * Any identified alternative corridor is badged as a **Possible Route** with its explicit verification tier:
     * **`VERIFIED`**: Confirmed clear by active sensor telemetry or live drone reconnaissance.
     * **`UNVERIFIED`**: Present in municipal GIS road network data, but safety and bridge integrity are unconfirmed. Heavy transport warning is issued.
   * If **no alternative route** exists in map data (or all secondary bypasses are severed), SOLACE issues:  
     > *"Insufficient information to identify an alternative route. Manual reconnaissance required."*

3. **Anti-Hallucination & Refusal Protocol:**  
   * SOLACE **never invents routes** that do not exist in the defined road graph.
   * SOLACE **never claims a route is safe** unless its `status: "clear"` and `verified: true` flags are active.
   * Guarantees 100% single-source-of-truth synchronization between the map polylines, risk gauges, alert feeds, and AI recommendations.

---

## 🎯 Interactive Demo Scenarios (Project Presentation)

SOLACE includes a quick-switch scenario selector to demonstrate all 3 AI behaviors live:

| Scenario | Conditions | AI Decision & Badge | Operational Protocol |
| :--- | :--- | :--- | :--- |
| **Scenario A** | Primary NH-48 blocked by landslide; South Ridge Bypass B-7 exists & confirmed by UAV-03. | **`USE_ALTERNATIVE_VERIFIED`** (`VERIFIED CLEAR`) | Emergency dispatch authorized along verified bypass (13.2 km, Est. 26 mins). |
| **Scenario B** | Primary NH-48 blocked; South Ridge Bypass exists on GIS graph but sensor link is offline. | **`CAUTION_ALTERNATIVE_UNVERIFIED`** (`UNVERIFIED`) | Warns command: safety unconfirmed. Demands scout/drone reconnaissance before routing heavy units. |
| **Scenario C** | Total Isolation: Primary NH-48 blocked, all secondary arteries severed or missing. | **`INSUFFICIENT_INFORMATION`** (`TOTAL ISOLATION`) | Refuses to hallucinate speculative corridors. Directs aerial winch / heli-evac deployment. |

---

## 🖥️ System Modules & Features

* **Live Tactical GIS Map:**
  * Animated glowing concentric seismic epicenter waves (M6.8 Richter scale, 18.5 km radius).
  * Dynamically styled road polylines: Solid glowing emerald (*Verified Clear*), dashed amber (*Unverified Possible*), dashed red (*Blocked*).
  * Color-coded interactive markers for Incidents, Rescue Squads, Evacuation Shelters, and Trauma Hospitals.
  * Interactive tools: Pan, drag, zoom (+/-), tactical coordinate grid, epicenter wave toggle, reset view.
* **Incident Analysis (AI Insights):**
  * Radial SVG risk level gauge (0–100%) responding dynamically to scenario transitions.
  * Real-time primary vs alternative path analysis, guardrail compliance badges, and instant unit deployment trigger.
* **Disaster Simulation Control:**
  * Play, Pause, and Speed multipliers (1x, 2x, 5x).
  * One-click demo scenario triggers (Scenario A, B, C).
  * Manual route state overrides (toggle road blockages and verification flags live).
* **Demographic & Infrastructure Overview:**
  * Interactive SVG donut chart showing Urban (68%) vs Rural (32%) population breakdown.
  * Critical infrastructure meters: Power Grid, Water Mains, and Telecom/5G.
* **Recent Alerts Feed:**
  * Chronological priority broadcast feed (*Critical*, *Moderate*, *Info*).
  * Click any alert to auto-focus map coordinates and trigger instant AI analysis.
* **Tactical Audio Engine:**
  * High-tech Web Audio API sound effects for radar pings, alert sirens, and dispatch fanfares (mute/unmute toggle in header).
* **Multi-Agency Situation Reports (SitRep):**
  * Print-ready official SitRep generator with disaster chronology, casualty triage breakdown, and inter-agency checklists.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript
* **Styling & Theme:** Tailwind CSS, PostCSS, Lucide React Icons
* **Build System:** Vite
* **Audio:** Web Audio API (Synthesized tactical soundscapes)
* **Architecture:** React Context API (Single source of truth for telemetry and graph state)

---

## 🚀 Quickstart & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/prerna-source/SOLANCE-Emergency-Portal.git
cd SOLANCE-Emergency-Portal

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License & Attribution

Developed for digital literacy, open-source humanitarian tech, and crisis response evaluation.  
Motto: *"Not Me, But You"*.
