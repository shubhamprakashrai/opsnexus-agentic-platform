# Product Requirements Document (PRD)
## Agentic AI Operations Management Platform
**Product Name:** OpsNexus AI (Autonomous Retail Operations Assistant)  
**Author:** Forward Deployed Engineer Candidate  
**Target Delivery Date:** November 2026 | **Status:** Prototype & Production Architecture Spec  

---

## 1. Executive Summary & Problem Definition

### 1.1 The Business Problem
A rapidly growing omnichannel retail enterprise opens new stores and operates dozens of regional hubs across India. Operational exceptions—such as supplier delivery delays, stock shortages, logistics bottlenecks, and urgent cost approvals—are currently handled through unstructured emails, disparate spreadsheets, and manual phone calls.

When a critical store launch event (e.g., Pune Store Opening) faces a supplier delay of 500 display fixtures, the operations team loses 4–8 hours manually triaging emails, checking multiple warehouse inventories, calculating logistics costs, chasing approvers via email chains, and updating store managers. Missing the store launch deadline incurs:
- **Revenue Loss:** ₹5–15 Lakhs per day of delayed store operations.
- **Wasted Expenditure:** Committed marketing campaigns, local press, and idle on-site staffing.
- **Brand Reputation Damage:** Loss of consumer trust and compromised grand opening experience.

### 1.2 The Solution
**OpsNexus AI** is an Agentic Operations Management Platform that converts unstructured operational communications into verified, cross-system operational resolutions in minutes. By orchestrating specialized LLM-powered agents with company data systems (ERP/WMS) and policy-governed Human-in-the-Loop (HITL) checkpoints, OpsNexus:
1. Ingests and parses operational requests instantly.
2. Cross-references internal inventory and supplier databases.
3. Quantifies business risk and generates cost-optimized action alternatives.
4. Enforces deadline-driven approval routing (e.g., 4:00 PM cutoff).
5. Dispatches multi-stakeholder communications upon approval.
6. Maintains an immutable audit trail from email intake to ticket closure.

---

## 2. Target Personas & User Journeys

| Persona | Core Responsibility | Current Pain Points | Value Delivered by OpsNexus |
| :--- | :--- | :--- | :--- |
| **Regional Operations Manager (ROM)** *(e.g., Sender)* | Regional store launch timelines, vendor execution, and budget compliance | Overwhelmed by email triage; delayed decision-making; lack of visibility into alternative stocks. | Instant impact assessment, viable cost alternatives with rationale, automated follow-up. |
| **Operations Coordinator / Specialist** | Daily operational firefighting, inventory dispatch, vendor follow-ups | Manual cross-checking of ERP/WMS; chasing manager approvals; drafting repetitive emails. | 80% reduction in manual coordination; 1-click execution of dispatches and communications. |
| **VP of Supply Chain / Finance Approver** | P&L accountability, budget approvals (>₹10,000 threshold), risk oversight | Unclear context in email approval requests; missed deadlines causing launch delays. | Context-rich approval cards with cost-benefit analysis, urgency countdown, and 1-click sign-off. |
| **Store Launch Manager** | On-ground retail readiness, store visual merchandising | Blind to supplier delivery status; finding out about delays at the 11th hour. | Proactive, automated stakeholder updates with guaranteed delivery ETAs. |

---

## 3. Proposed Agentic Workflow & Architecture

OpsNexus adopts a **Multi-Agent Orchestration with Supervisory Governance** model. Instead of relying on a single monolithic LLM prompt, specialized agents operate with dedicated roles, tool access, and confidence bounds.

```
+--------------------------------------------------------------------------------------------------+
|                                    INCOMING REQUEST STREAM                                       |
|                         (Email / Webform / ERP Webhook / Manual Intake)                          |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [GUARD] Security & Guardrails Engine                                                             |
| - Prompt Injection Detection (< 200ms)                                                           |
| - Data Anonymization (PII / Sensitive Data Scrubbing)                                            |
+--------------------------------------------------------------------------------------------------+
                                                | (Passed)
                                                v
+--------------------------------------------------------------------------------------------------+
| [AGENT 1] Intake & Entity Extraction Agent                                                        |
| - Extracts: Issue Type, Entity (Display Units), Quantity (500), Target (Pune), Urgency, Deadline   |
| - Missing Info & Ambiguity Detection                                                             |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [AGENT 2] System Reconciliation & Inventory Agent                                                 |
| - Tools: Query WMS (Pune Warehouse, Mumbai Central Hub, Bhiwandi)                                |
| - Conflict Detection: Flags discrepancies (e.g., Email states 120 units vs DB 80 units)          |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [AGENT 3] Business Impact & Risk Evaluation Agent                                                 |
| - Evaluates: Revenue impact, launch postponement penalty, SLA urgency (4:00 PM today)            |
| - Risk Categorization: CRITICAL / HIGH / MEDIUM / LOW                                            |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [AGENT 4] Recommendation & Action Synthesizer                                                     |
| - Formulates Alternatives:                                                                       |
|   * Option A (Expedited Air Freight from Supplier): ₹35,000 | 3 Days | High Cost                 |
|   * Option B (Inter-Hub Truck Transfer from Mumbai Hub): ₹12,000 | 2 Days | Recommended (94%)     |
|   * Option C (Phased Store Soft-Launch): ₹0 | High Brand Risk                                    |
| - Assigns Confidence Scores & Trade-off Rationales                                               |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [HITL GATE] Policy & Human Approval Gateway                                                      |
| - Triggers Human Approval if: Cost > ₹10,000 OR Confidence < 85% OR Critical Launch Impact       |
| - SLA Countdown Timer (4:00 PM hard stop) with Auto-Escalation to VP                              |
| - Human Override Capability (Allows manual edit of quantities, locations, or choices)            |
+--------------------------------------------------------------------------------------------------+
                                                | (Approved / Overridden)
                                                v
+--------------------------------------------------------------------------------------------------+
| [AGENT 5] Stakeholder Communication & Dispatch Agent                                              |
| - Generates tailored communications:                                                             |
|   * Supplier Expedited/Hold Notice                                                               |
|   * Store Manager Launch Reassurance & Tracking Link                                             |
|   * Executive 2-Line Summary for Leadership WhatsApp/Slack                                       |
+--------------------------------------------------------------------------------------------------+
                                                |
                                                v
+--------------------------------------------------------------------------------------------------+
| [SUPERVISOR] Audit & Lifecycle Tracker                                                           |
| - Immutable Event Log (Timestamped state changes, agent rationale, human actions)                 |
| - Real-time tracking to final delivery & store launch closure                                    |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Functional Requirements

### 4.1 Request Intake & Information Extraction (FR-1)
- **FR-1.1:** System shall ingest raw text emails or structured manual forms.
- **FR-1.2:** System shall extract: Issue category, Affected SKU/Item, Quantities (demanded, available, delayed), Deadlines, Impact event, and Requestor details.
- **FR-1.3:** System shall calculate an **Extraction Confidence Score (0–100%)**.

### 4.2 Data Reconciliation & System Verification (FR-2)
- **FR-2.1:** System shall query simulated or production WMS/ERP databases for on-hand stock levels across regional warehouses.
- **FR-2.2:** If stated quantity differs from system inventory (e.g., Email states 120 units, WMS reports 80 units), system must raise a **Conflict Warning** and prompt physical stock recount while using verified system numbers for risk modeling.

### 4.3 Risk & Urgency Assessment (FR-3)
- **FR-3.1:** System shall assign a multidimensional risk score (0–100) based on financial exposure, time-to-launch, and operational dependency.
- **FR-3.2:** Urgency flags must trigger dynamically when approval deadlines are within 6 hours.

### 4.4 Multi-Option Recommendation Engine (FR-4)
- **FR-4.1:** System shall synthesize at least 2 viable alternative actions with estimated costs, arrival ETAs, operational complexity, and supporting reasoning.
- **FR-4.2:** System shall identify a "Recommended Option" with explicit trade-off rationale.

### 4.5 Governance, Approvals & Human Override (FR-5)
- **FR-5.1:** System shall enforce mandatory Human-in-the-Loop sign-off for expenditures above ₹10,000 or when confidence is below 85%.
- **FR-5.2:** Approvers shall have the ability to: (a) 1-Click Approve, (b) Reject with feedback, or (c) Override/Edit extraction attributes (e.g., adjust transfer quantity or change destination).
- **FR-5.3:** System shall track an active SLA countdown timer (e.g., 4:00 PM deadline) and auto-escalate to next-tier approvers if unacknowledged within 60 minutes of the cutoff.

### 4.6 Stakeholder Communication Generation (FR-6)
- **FR-6.1:** System shall auto-generate persona-tailored drafts:
  - Technical logistics instruction for WMS/Carrier.
  - Reassurance update for Store Launch Manager.
  - High-level executive bullet for VP/Leadership.

### 4.7 Auditability & Lifecycle Tracking (FR-7)
- **FR-7.1:** System shall maintain an append-only audit trail capturing every agent prompt, output, confidence score, human decision, timestamp, and ERP sync action.

---

## 5. Non-Functional Requirements (NFRs)

| Metric | Target Requirement | Architectural Implementation |
| :--- | :--- | :--- |
| **Latency** | End-to-end triage & recommendation in < 3.5 seconds | Parallel agent dispatch; lightweight fast-inference LLMs (Gemini Flash). |
| **Availability** | 99.9% uptime | Stateless containerized services; graceful fallback to heuristic rules if LLM API fails. |
| **Security & Privacy** | Enterprise-grade guardrails | Prompt injection sanitization; regex filtering for PII; role-based access control (RBAC). |
| **Auditability** | 100% immutable action logs | Append-only event store with sha256 session integrity. |
| **Usability** | Sub-30-second decision turnaround for approvers | Clear, uncluttered glassmorphic UI; prominent CTA cards; mobile-responsive approval cards. |

---

## 6. Edge Cases & Resilience Strategy (Addressing All Required Scenarios)

The system is architected to gracefully detect, communicate, and recover from operational and technical anomalies:

```
+-----------------------------------+---------------------------------------------------+----------------------------------------------------+
| Edge Case Scenario                | Detection Mechanism                               | System Recovery & Fallback Action                  |
+-----------------------------------+---------------------------------------------------+----------------------------------------------------+
| 1. Missing Critical Information   | Extraction Agent flags null fields (e.g. qty/date)| Halts recommendation; generates clarifying reply draft; alerts human. |
| 2. Conflicting Information        | ERP Reconciliation Agent identifies discrepancy   | Flags delta prominently; runs conservative cost model; requests recount. |
| 3. Prompt Injection / Malicious   | Guardrail regex & adversarial classifier          | Quarantines request; logs security incident; alerts SecOps. |
| 4. Low Confidence Recommendation  | Confidence score falls below 75% threshold        | Explicitly flags low certainty; forces mandatory senior manager review. |
| 5. Human Override of AI Data      | User manually edits extracted field               | Accepts human ground truth; re-runs recommendation with new inputs. |
| 6. Approver SLA Breach / Delay    | Countdown timer reaches threshold without response| Automatically escalates ticket to VP of Supply Chain via SMS/Slack. |
| 7. Approval Rejection             | Approver rejects proposed expenditure             | Prompts feedback; generates zero-cost fallback (soft launch option). |
| 8. Duplicate Request Intake       | Hash & similarity match on subject & store ID     | Merges with active ticket; notifies user of linked master incident. |
| 9. External System / LLM Downtime | Circuit breaker on API calls                      | Automatically falls back to deterministic rule-based heuristic engine. |
+-----------------------------------+---------------------------------------------------+----------------------------------------------------+
```

---

## 7. Assumptions & Technical Trade-Offs

### 7.1 Key Assumptions
1. Regional store launch dates are non-negotiable without VP-level executive intervention.
2. Inter-warehouse transfer logistics (e.g., Mumbai to Pune) can be chartered on-demand with a 24–48 hour transit window.
3. A centralized mock WMS database represents current ground-truth inventory across regional hubs.

### 7.2 Strategic Trade-Offs
- **Multi-Agent Specialization vs Single Prompt:**
  - *Trade-off:* Multi-agent calls introduce minor network latency (~1s overhead).
  - *Rationale:* Specialization prevents hallucination, provides granular confidence scores per domain, and enables clear auditability for enterprise compliance.
- **Deterministic Heuristic Fallback vs Pure Generative AI:**
  - *Trade-off:* Rule engines are less flexible than generative models.
  - *Rationale:* Operational continuity in enterprise retail is mission-critical; if the LLM provider experiences an outage, business operations cannot halt.

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

| Metric | Baseline (Manual Process) | Target with OpsNexus AI | Business Impact |
| :--- | :--- | :--- | :--- |
| **Mean Time to Resolution (MTTR)** | 4.5 Hours | **12 Minutes** | 95% faster response to critical operational bottlenecks. |
| **Store Launch Delay Rate** | 8.2% of launches delayed | **< 0.5% of launches delayed** | Eliminates ₹50L+ in annual delayed-launch losses. |
| **Approver Turnaround Time** | 210 Minutes | **< 15 Minutes** | High-context cards enable rapid 1-click decision making. |
| **Audit Compliance Rate** | 35% (scattered in emails) | **100% Immutable Log** | Total traceability for finance, operations, and compliance. |
| **Human Review Efficiency** | 100% manual review | **Exception-based review** | Operations team capacity increased by 3.5x. |

---

## 9. MVP Scope vs Post-MVP Roadmap

### Phase 1: MVP Prototype (Delivered Here)
- Interactive web intake for operational emails & manual requests.
- Multi-agent orchestration pipeline (Intake, Inventory Sync, Risk Engine, Action Synthesizer, Comms).
- Live simulated WMS inventory database (Pune, Mumbai, Delhi).
- Real-time Human Approval Card with 4:00 PM countdown timer and Human Override.
- 6 Interactive Edge-Case simulators (Pune Delay, Missing Info, Conflicting Stock, Prompt Injection, Low Confidence, SLA Breach).
- Multi-stakeholder email and summary generator.
- Comprehensive searchable audit trail.

### Phase 2: Production Scale (Post-MVP)
- Native Microsoft Graph & Google Workspace API connectors for zero-touch inbox ingestion.
- SAP / Oracle ERP bi-directional webhook sync.
- Voice/WhatsApp conversational interface for field warehouse managers.
- Predictive supplier reliability scoring based on historical shipment punctuality.
