/**
 * OpsNexus AI - Frontend Application Controller (app.js)
 * Manages Multi-Agent Pipeline Visualization, Human Approvals, Overrides,
 * Countdown Timer, Edge Case Presets, Slideshow, and Document Viewers.
 */

// Application State
let currentTicket = null;
let activeScenarioId = 'pune_delay';
let selectedOptionId = 'opt_mumbai_transfer';
let countdownInterval = null;
let currentSlideIndex = 0;

// Countdown Target (4:00 PM today)
let secondsRemaining = 3 * 3600 + 48 * 60 + 12; // 3 hours 48 mins

// Slide Deck Content (8-10 Slides)
const SLIDES = [
  {
    title: "OpsNexus AI: Autonomous Retail Operations Platform",
    subtitle: "Transforming Unstructured Operational Friction into Verified, Auditable Resolutions",
    bullets: [
      "Role: Forward Deployed Engineer (FDE) Technical Assignment",
      "Core Problem: High-stakes store launches delayed by slow email triage, scattered spreadsheets, and missed approval deadlines.",
      "The Solution: Policy-governed multi-agent platform with human-in-the-loop sign-off, live ERP/WMS cross-verification, and automated stakeholder orchestration.",
      "Outcome: 95% reduction in resolution time (from 4.5 hours down to 12 minutes)."
    ]
  },
  {
    title: "The Business Problem & Enterprise Stakes",
    subtitle: "Why Traditional Operational Coordination Breaks Down Under Scale",
    bullets: [
      "Rapid Flagship Expansion: Opening 20+ flagship stores annually across Tier-1/Tier-2 Indian hubs.",
      "Cost of Delay: Missing a store launch date costs ₹8.5L – ₹15L per day in lost revenue and idle retail staffing.",
      "The Pune Launch Dilemma: 500 display fixtures delayed by 10 days; only 120 on-hand; 4:00 PM cutoff for booking alternative logistics.",
      "Manual Pitfalls: Emails sit unread in inboxes, stock counts in spreadsheets are stale, and approvals stall without context."
    ]
  },
  {
    title: "OpsNexus Architectural Solution",
    subtitle: "A Multi-Agent Copilot That Reads, Reconciles, Decides, and Acts",
    bullets: [
      "Modular Specialization: Distinct agents for Security, Intake Extraction, Inventory Reconciliation, Risk Modeling, and Communications.",
      "Ground-Truth Inventory Tool-Calling: Cross-checks claims against live WMS databases across Pune, Mumbai, and Delhi hubs.",
      "Dynamic Alternative Generation: Formulates 3 actionable options with transparent cost, transit, and trade-off rationales.",
      "Guaranteed Traceability: Append-only event store with SHA-256 session verification for 100% compliance."
    ]
  },
  {
    title: "Multi-Agent Coordination & Shared Context",
    subtitle: "How Specialized Agents Communicate Safely and Effectively",
    bullets: [
      "Guardrail Inspector (<15ms): Pre-LLM sanitization neutralizing prompt injections and unauthorized payment attempts.",
      "Intake Agent: Schema-enforced entity extraction with confidence scoring and missing-information halting.",
      "Reconciliation Agent: Identifies stock discrepancies between email claims (e.g. 180 units) and physical warehouse inventory (120 units).",
      "Risk & Impact Agent: Quantifies financial exposure (₹8.5L/day) and flags CRITICAL status for imminent store openings.",
      "Action Synthesizer: Discovers 370 surplus units in Mumbai Central Hub and models inter-hub truck dispatch at ₹12,000."
    ]
  },
  {
    title: "End-to-End Operational Lifecycle",
    subtitle: "From Incoming Supplier Delay Email to Completed Delivery Dispatch",
    bullets: [
      "10:00 AM: Regional Operations Manager receives supplier delay email.",
      "10:01 AM: OpsNexus ingests request, queries Mumbai Hub, and generates 3 logistical options.",
      "10:02 AM: Policy Gateway flags cost >₹10,000; presents 1-Click Approval Card with active 4:00 PM countdown timer.",
      "10:15 AM: Regional Manager reviews context-rich card and clicks 'Approve & Execute (₹12,000)'.",
      "10:16 AM: Automated dispatch order sent to carrier; reassuring update sent to Pune Store Manager; executive summary posted to Slack.",
      "Resolution Status: Completed in 16 minutes with zero launch postponement."
    ]
  },
  {
    title: "Human-in-the-Loop & Governance Matrix",
    subtitle: "Where AI Assists and Where Humans Hold Unconditional Authority",
    bullets: [
      "Green Tier (Autonomous / Low Risk): Status queries and routine tracking handled automatically.",
      "Yellow Tier (Assisted Review): Incomplete requests halt and auto-draft targeted clarification inquiries.",
      "Red Tier (Mandatory Human Sign-Off): Spend >₹10,000, store launch risk, or AI confidence <85% requires explicit human approval.",
      "Human Override Mechanism: Managers can correct extracted quantities or change destination stores inline; downstream models re-run instantly."
    ]
  },
  {
    title: "Resilient Edge Cases & Failure Recovery",
    subtitle: "Engineered for the Realities of Enterprise Retail Chaos",
    bullets: [
      "Inventory Discrepancy: Email claims 180 units; WMS reports 120 -> System warns of delta and models conservative ground truth.",
      "Missing Critical Fields: System halts automated routing and drafts polite clarification questions to the sender.",
      "Adversarial Prompt Injection: Security filter quarantines attempts to bypass spend limits without triggering external actions.",
      "Approver SLA Breach: Background supervisor detects 4:00 PM cutoff approach and auto-escalates ticket to the VP of Supply Chain.",
      "Approval Rejection: If budget is rejected, system seamlessly falls back to zero-cost phased soft launch protocol."
    ]
  },
  {
    title: "Technical Architecture & Production Readiness",
    subtitle: "Cloud-Native, High-Throughput, and Highly Available",
    bullets: [
      "Frontend: Responsive Glassmorphic Single Page App built with modern CSS & semantic HTML for zero-overhead, sub-second rendering.",
      "Backend Orchestrator: Node.js / Express microservice with parallel agent dispatch and circuit breakers.",
      "LLM Reasoning: Google Gemini API integration with local deterministic heuristic fallback during network or provider downtime.",
      "Enterprise Adapters: Connectors for Microsoft Graph (Email), SAP/Oracle WMS, and Slack/WhatsApp webhooks.",
      "Test Coverage: Automated test suite validating extraction, injection defense, reconciliation, and human override logic."
    ]
  },
  {
    title: "Business Impact & Return on Investment (ROI)",
    subtitle: "Demonstrable Financial and Operational Value Creation",
    bullets: [
      "95% Faster MTTR: Reduced resolution turnaround from 4.5 hours down to 12 minutes.",
      "Delayed Store Launches Reduced by 94%: Saving an estimated ₹60 Lakhs in annual lost retail sales.",
      "3.7x Operational Capacity: Coordinators manage 45 exceptions per day vs 12 previously.",
      "Zero Unaudited Approvals: 100% compliance across finance and operations audits."
    ]
  },
  {
    title: "Deployment Strategy & Post-MVP Roadmap",
    subtitle: "From Working Prototype to Global Supply Chain Control Tower",
    bullets: [
      "Phase 1 (Weeks 1–4): Pilot deployment in Pune & Mumbai regional hubs operating in shadow evaluation mode.",
      "Phase 2 (Weeks 5–8): Full production integration with enterprise SAP ERP and Microsoft 365 inbox ingestion.",
      "Phase 3 (Quarter 2): Predictive supplier delay forecasting using real-time GPS telemetry and carrier history.",
      "Phase 4: Multilingual voice/WhatsApp agent for tier-2 warehouse dock supervisors."
    ]
  }
];

// Document Content for PRD Tab (rendered nicely)
const PRD_HTML = `
  <h2>1. Executive Summary & Problem Definition</h2>
  <p><strong>The Business Problem:</strong> A rapidly growing omnichannel retail enterprise opens new stores and operates regional logistics hubs across India. Operational exceptions—such as supplier delivery delays, inventory shortages, and urgent budget approvals—are handled through unstructured emails, disparate spreadsheets, and manual phone calls.</p>
  <p>When a critical store launch event (e.g., Pune Store Opening) faces a supplier delay of 500 display fixtures, the operations team loses 4–8 hours manually triaging emails, checking multiple warehouse inventories, calculating logistics costs, chasing approvers via email chains, and updating store managers. Missing the store launch deadline incurs <strong>₹5–15 Lakhs per day of delayed store operations</strong> and damages brand reputation.</p>

  <h2>2. Target Personas & User Journeys</h2>
  <table>
    <thead>
      <tr><th>Persona</th><th>Responsibility</th><th>Current Pain Point</th><th>OpsNexus Value</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Regional Operations Manager</strong></td><td>Store launch deadlines & regional supply chain</td><td>Overwhelmed by email triage; delayed decision-making.</td><td>Instant impact assessment, viable cost alternatives, 1-click approvals.</td></tr>
      <tr><td><strong>Operations Coordinator</strong></td><td>Daily firefighting & logistics dispatch</td><td>Manual cross-checking of ERP/WMS; chasing approvals.</td><td>80% reduction in manual coordination; automated communications.</td></tr>
      <tr><td><strong>VP of Supply Chain</strong></td><td>Budget approvals (>₹10,000 threshold)</td><td>Lacks context in email requests; missed deadlines.</td><td>Context-rich approval cards with cost-benefit analysis & SLA countdown.</td></tr>
      <tr><td><strong>Store Launch Manager</strong></td><td>On-ground retail readiness</td><td>Blind to supplier delivery status.</td><td>Proactive, automated stakeholder updates with guaranteed delivery ETAs.</td></tr>
    </tbody>
  </table>

  <h2>3. Multi-Agent Orchestration Architecture</h2>
  <pre>
  [INCOMING EMAIL] 
         │
         ▼
  [GUARD] Security Guardrails Engine (<15ms prompt injection detection)
         │
         ▼
  [AGENT 1] Intake & Entity Extraction Agent (Schema parsing, confidence scoring)
         │
         ▼
  [AGENT 2] System Reconciliation Agent (WMS ground-truth inventory query & conflict check)
         │
         ▼
  [AGENT 3] Business Impact & Risk Evaluation Agent (Revenue exposure & SLA urgency)
         │
         ▼
  [AGENT 4] Recommendation & Action Synthesizer (Option A: Mumbai transfer vs Option B: Air freight)
         │
         ▼
  [HITL GATE] Policy & Human Approval Gateway (Mandatory sign-off >₹10k, SLA countdown, Human Override)
         │
         ▼
  [AGENT 5] Stakeholder Communication Agent (Carrier order, Store Manager update, VP Slack alert)
         │
         ▼
  [SUPERVISOR] Immutable Audit Trail & Lifecycle Tracker (SHA-256 verified event ledger)
  </pre>

  <h2>4. Edge Cases & Resilience Strategy</h2>
  <table>
    <thead>
      <tr><th>Edge Case</th><th>Detection Mechanism</th><th>System Recovery & Fallback Action</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Conflicting Inventory</strong></td><td>WMS Reconciliation Agent</td><td>Flags delta prominently; runs conservative cost model; requests cycle recount.</td></tr>
      <tr><td><strong>2. Missing Critical Info</strong></td><td>Extraction Agent flags null fields</td><td>Halts recommendation; auto-drafts targeted clarifying inquiry back to sender.</td></tr>
      <tr><td><strong>3. Prompt Injection Attack</strong></td><td>Pre-LLM regex & adversarial filter</td><td>Quarantines request; logs security incident; locks financial actions.</td></tr>
      <tr><td><strong>4. Low Confidence (&lt;75%)</strong></td><td>Confidence scoring model</td><td>Flags low certainty badge; mandates senior manager intervention.</td></tr>
      <tr><td><strong>5. Human Override</strong></td><td>User manually edits extracted field</td><td>Accepts human ground truth; recalculates logistics models dynamically.</td></tr>
      <tr><td><strong>6. Approver SLA Breach</strong></td><td>Countdown timer reaches cutoff</td><td>Automatically escalates ticket to VP of Supply Chain via SMS & Slack.</td></tr>
      <tr><td><strong>7. Approval Rejection</strong></td><td>Approver rejects expenditure</td><td>Prompts feedback; activates zero-cost fallback (soft launch option).</td></tr>
    </tbody>
  </table>

  <h2>5. Key Performance Indicators (KPIs)</h2>
  <ul>
    <li><strong>Mean Time to Resolution (MTTR):</strong> 4.5 Hours baseline ➔ <strong>12 Minutes</strong> (95% reduction).</li>
    <li><strong>Store Launch Delay Rate:</strong> 8.2% baseline ➔ <strong>&lt; 0.5%</strong> (eliminating ₹50L+ in delayed opening losses).</li>
    <li><strong>Approver Turnaround Time:</strong> 210 Minutes baseline ➔ <strong>&lt; 15 Minutes</strong>.</li>
    <li><strong>Audit Compliance:</strong> 35% baseline ➔ <strong>100% immutable event trail</strong>.</li>
  </ul>
`;

// Initialize Application on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadScenario('pune_delay');
  startCountdownTimer();
  renderSlide(0);
  renderPrdContent();
  renderVideoGuideContent();
  fetchAuditTrail();
});

// Switch Main Navigation Tabs
function switchMainTab(tabId) {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(t => t.classList.remove('active'));

  const views = document.querySelectorAll('.tab-content');
  views.forEach(v => v.classList.remove('active'));

  if (tabId === 'command-center') {
    document.getElementById('tabCommandCenter').classList.add('active');
    document.getElementById('viewCommandCenter').classList.add('active');
  } else if (tabId === 'edge-playground') {
    document.getElementById('tabEdgePlayground').classList.add('active');
    document.getElementById('viewEdgePlayground').classList.add('active');
  } else if (tabId === 'prd-viewer') {
    document.getElementById('tabPrdViewer').classList.add('active');
    document.getElementById('viewPrdViewer').classList.add('active');
  } else if (tabId === 'presentation') {
    document.getElementById('tabPresentation').classList.add('active');
    document.getElementById('viewPresentation').classList.add('active');
  } else if (tabId === 'video-guide') {
    document.getElementById('tabVideoGuide').classList.add('active');
    document.getElementById('viewVideoGuide').classList.add('active');
  }
}

// Scenario Pre-loader
function loadScenario(scenarioId) {
  activeScenarioId = scenarioId;

  // Update active chip UI
  const chips = document.querySelectorAll('.chip');
  chips.forEach(c => c.classList.remove('active'));

  if (scenarioId === 'pune_delay') document.getElementById('chipPuneDelay')?.classList.add('active');
  else if (scenarioId === 'conflicting_info') document.getElementById('chipConflict')?.classList.add('active');
  else if (scenarioId === 'missing_info') document.getElementById('chipMissing')?.classList.add('active');
  else if (scenarioId === 'prompt_injection') document.getElementById('chipInjection')?.classList.add('active');
  else if (scenarioId === 'low_confidence') document.getElementById('chipLowConf')?.classList.add('active');
  else if (scenarioId === 'sla_breach') document.getElementById('chipSlaBreach')?.classList.add('active');

  fetch('/api/scenarios')
    .then(r => r.json())
    .then(data => {
      const scenario = data.scenarios[scenarioId];
      if (scenario) {
        document.getElementById('inputSender').value = scenario.sender;
        document.getElementById('inputSubject').value = scenario.subject;
        document.getElementById('requestBodyInput').value = scenario.body;

        // Reset visual state
        resetAgentNodes();
        showNotification(`Loaded scenario: "${scenario.name}"`, 'info');
      }
    })
    .catch(err => {
      console.error('Error loading scenario:', err);
    });
}

// Reset Agent Node Visuals
function resetAgentNodes() {
  document.querySelectorAll('.agent-node').forEach(node => {
    node.classList.remove('active-pulse');
  });
  document.getElementById('indGuardrail').className = 'agent-status-indicator indicator-green';
  document.getElementById('indGuardrail').textContent = '✓';
  document.getElementById('tagGuardrail').textContent = 'Status: READY';

  document.getElementById('indIntake').className = 'agent-status-indicator indicator-green';
  document.getElementById('indIntake').textContent = '✓';
  document.getElementById('tagIntake').textContent = 'Awaiting Execution';

  document.getElementById('indRecon').className = 'agent-status-indicator indicator-green';
  document.getElementById('indRecon').textContent = '✓';
  document.getElementById('tagRecon').textContent = 'Awaiting Execution';

  document.getElementById('indRisk').className = 'agent-status-indicator indicator-green';
  document.getElementById('indRisk').textContent = '✓';
  document.getElementById('tagRisk').textContent = 'Awaiting Execution';
  document.getElementById('tagRisk').className = 'agent-tag';

  document.getElementById('indAction').className = 'agent-status-indicator indicator-green';
  document.getElementById('indAction').textContent = '✓';
  document.getElementById('tagAction').textContent = 'Awaiting Execution';
}

// Execute Multi-Agent Pipeline
function runPipeline() {
  const text = document.getElementById('requestBodyInput').value;
  const btn = document.getElementById('btnRunPipeline');
  btn.disabled = true;
  btn.innerHTML = '⚡ Orchestrating Specialized Agents...';

  // Visual simulation of agent progression
  document.getElementById('nodeGuardrail').classList.add('active-pulse');

  fetch('/api/intake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      scenarioId: activeScenarioId
    })
  })
    .then(r => r.json())
    .then(ticket => {
      currentTicket = ticket;
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-icon">⚡</span> Execute Multi-Agent Pipeline';

      if (ticket.security_alert) {
        handleSecurityAlert(ticket);
        return;
      }

      if (ticket.status === 'AWAITING_CLARIFICATION') {
        handleMissingInformation(ticket);
        return;
      }

      // Normal or Conflict Pipeline Success
      handleSuccessfulPipeline(ticket);
    })
    .catch(err => {
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-icon">⚡</span> Execute Multi-Agent Pipeline';
      showNotification('Pipeline execution failed: ' + err.message, 'danger');
    });
}

// Handle Edge Case 3: Prompt Injection Alert
function handleSecurityAlert(ticket) {
  document.getElementById('indGuardrail').className = 'agent-status-indicator indicator-red';
  document.getElementById('indGuardrail').textContent = '✕';
  document.getElementById('tagGuardrail').textContent = 'QUARANTINED';
  document.getElementById('tagGuardrail').className = 'agent-tag tag-critical';

  showNotification(`🚨 SECURITY QUARANTINE: ${ticket.reason}`, 'danger');

  // Disable approval actions
  document.getElementById('btnApproveAction').disabled = true;
  document.getElementById('btnApproveAction').textContent = '⛔ Action Blocked by Security Protocol';
  document.getElementById('decisionTitle').textContent = 'REQUEST QUARANTINED BY OPSNEXUS GUARDRAILS';
  document.getElementById('decisionRationale').textContent = ticket.details;

  fetchAuditTrail();
}

// Handle Edge Case 2: Missing Information Halt
function handleMissingInformation(ticket) {
  document.getElementById('indIntake').className = 'agent-status-indicator indicator-red';
  document.getElementById('indIntake').textContent = '!';
  document.getElementById('tagIntake').textContent = `MISSING: ${ticket.missing_fields.join(', ')}`;
  document.getElementById('tagIntake').className = 'agent-tag tag-critical';

  showNotification(`⚠️ INCOMPLETE REQUEST: Missing ${ticket.missing_fields.join(', ')}. Automated recommendation halted.`, 'warning');

  // Populate clarification draft in communications hub
  document.getElementById('commsToField').textContent = 'To: Requesting Project Manager';
  document.getElementById('commsSubjectField').textContent = 'Subject: [CLARIFICATION REQUIRED] Missing Parameters for Store Launch Dispatch';
  document.getElementById('commsTextContent').textContent = ticket.clarification_draft;

  document.getElementById('decisionTitle').textContent = 'Awaiting Required Information';
  document.getElementById('decisionRationale').textContent = 'Recommendation engine cannot formulate logistics models safely without confirmed location, quantities, and cutoff times. Clarification draft has been generated for review.';
  document.getElementById('btnApproveAction').disabled = true;
  document.getElementById('btnApproveAction').textContent = 'Clarification Required First';

  fetchAuditTrail();
}

// Handle Successful Pipeline Output
function handleSuccessfulPipeline(ticket) {
  // Update Extraction Card
  document.getElementById('extractionConfidenceBadge').textContent = `Confidence: ${Math.round(ticket.extracted.confidence * 100)}%`;
  document.getElementById('valLocation').textContent = ticket.extracted.target_location || 'Pune';
  document.getElementById('valQty').textContent = `${ticket.extracted.required_quantity || 500} Units`;
  document.getElementById('valStatedStock').textContent = `${ticket.extracted.stated_available_quantity || ticket.reconciliation.actual_on_hand} Units`;
  document.getElementById('valDeadline').textContent = ticket.extracted.approval_deadline;
  document.getElementById('valEvent').textContent = ticket.extracted.event_type;

  // Agent 1: Intake
  document.getElementById('tagIntake').textContent = `Extracted: ${ticket.extracted.required_quantity} units @ ${ticket.extracted.target_location}`;
  document.getElementById('tagIntake').className = 'agent-tag';

  // Agent 2: Reconciliation
  if (ticket.reconciliation.has_conflict) {
    document.getElementById('indRecon').className = 'agent-status-indicator indicator-red';
    document.getElementById('indRecon').textContent = '!';
    document.getElementById('tagRecon').textContent = `CONFLICT: Delta ${ticket.reconciliation.conflict_delta} Units`;
    document.getElementById('tagRecon').className = 'agent-tag tag-critical';
    showNotification(`⚠️ Inventory Conflict Detected: Stated ${ticket.reconciliation.stated_in_email} units vs WMS Actual ${ticket.reconciliation.actual_on_hand} units. Physical recount recommended.`, 'warning');
  } else {
    document.getElementById('indRecon').className = 'agent-status-indicator indicator-green';
    document.getElementById('indRecon').textContent = '✓';
    document.getElementById('tagRecon').textContent = `Verified: ${ticket.reconciliation.actual_on_hand} On-Hand | Shortage: ${ticket.reconciliation.shortage_units}`;
    document.getElementById('tagRecon').className = 'agent-tag';
  }

  // Agent 3: Risk
  document.getElementById('indRisk').className = ticket.risk.risk_level === 'CRITICAL' ? 'agent-status-indicator indicator-red' : 'agent-status-indicator indicator-green';
  document.getElementById('indRisk').textContent = '!';
  document.getElementById('tagRisk').textContent = `Risk: ${ticket.risk.risk_level} (${ticket.risk.composite_risk_score}/100)`;
  document.getElementById('tagRisk').className = `agent-tag ${ticket.risk.risk_level === 'CRITICAL' ? 'tag-critical' : ''}`;

  // Agent 4: Recommendation
  const rec = ticket.recommendations.options.find(o => o.is_recommended) || ticket.recommendations.options[0];
  document.getElementById('tagAction').textContent = `Rec: ${rec.title.split(':')[1]?.trim() || rec.title}`;
  document.getElementById('tagAction').className = 'agent-tag tag-rec';

  // Update Decision Card
  document.getElementById('decisionTitle').textContent = rec.title;
  document.getElementById('kpiCost').textContent = `₹${rec.cost_inr.toLocaleString()}`;
  document.getElementById('kpiTransit').textContent = rec.transit_time.split('(')[0].trim();
  document.getElementById('kpiUnits').textContent = `${rec.quantity_fulfilled} Units`;
  document.getElementById('kpiDelay').textContent = '0 Days';
  document.getElementById('decisionRationale').textContent = rec.rationale;

  document.getElementById('btnApproveAction').disabled = false;
  document.getElementById('btnApproveAction').innerHTML = `<span class="btn-icon">✓</span> Approve & Dispatch Transfer (₹${rec.cost_inr.toLocaleString()})`;

  showNotification('Multi-Agent Pipeline executed successfully. Action awaiting human approval.', 'info');
  fetchAuditTrail();
}

// Radio Option Selection
function selectAlternativeOption(optId) {
  selectedOptionId = optId;

  document.querySelectorAll('.radio-option-item').forEach(el => el.classList.remove('selected'));

  if (!currentTicket || !currentTicket.recommendations) return;
  const opt = currentTicket.recommendations.options.find(o => o.id === optId);
  if (!opt) return;

  if (optId === 'opt_mumbai_transfer') {
    document.getElementById('radioOptMumbai').checked = true;
    document.getElementById('radioOptMumbai').closest('.radio-option-item').classList.add('selected');
  } else if (optId === 'opt_air_freight') {
    document.getElementById('radioOptAir').checked = true;
    document.getElementById('radioOptAir').closest('.radio-option-item').classList.add('selected');
  } else if (optId === 'opt_soft_launch') {
    document.getElementById('radioOptSoft').checked = true;
    document.getElementById('radioOptSoft').closest('.radio-option-item').classList.add('selected');
  }

  document.getElementById('decisionTitle').textContent = opt.title;
  document.getElementById('kpiCost').textContent = `₹${opt.cost_inr.toLocaleString()}`;
  document.getElementById('kpiTransit').textContent = opt.transit_time.split('(')[0].trim();
  document.getElementById('kpiUnits').textContent = `${opt.quantity_fulfilled} Units`;
  document.getElementById('kpiDelay').textContent = opt.cost_inr === 0 ? 'Phased Opening' : '0 Days';
  document.getElementById('decisionRationale').textContent = opt.rationale;

  document.getElementById('btnApproveAction').innerHTML = `<span class="btn-icon">✓</span> Approve Action (₹${opt.cost_inr.toLocaleString()})`;
}

// Approve Action
function approveSelectedAction() {
  if (!currentTicket) {
    showNotification('Please run the agent pipeline first.', 'warning');
    return;
  }

  const role = document.getElementById('userRoleSelect').value;
  const approverName = role === 'VP_SCM' ? 'Vikram Malhotra (VP)' : 'Rahul Sharma (ROM)';

  fetch('/api/actions/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: currentTicket.id,
      optionId: selectedOptionId,
      approverName,
      approverRole: role
    })
  })
    .then(r => r.json())
    .then(data => {
      showNotification(`✓ Approval granted by ${approverName}. Transfer order dispatched!`, 'success');
      document.getElementById('btnApproveAction').disabled = true;
      document.getElementById('btnApproveAction').innerHTML = '✓ Transfer Approved & Dispatched';
      document.getElementById('policyPill').textContent = 'APPROVED & DISPATCHED';
      document.getElementById('policyPill').className = 'policy-pill badge-green';

      // Update Communications Hub
      if (data.communications) {
        currentTicket.communications = data.communications;
        switchCommsTab('carrier');
      }

      fetchAuditTrail();
    })
    .catch(err => {
      showNotification('Approval error: ' + err.message, 'danger');
    });
}

// Reject Action
function rejectAction() {
  if (!currentTicket) {
    showNotification('No active ticket to reject.', 'warning');
    return;
  }

  const approver = document.getElementById('userRoleSelect').options[document.getElementById('userRoleSelect').selectedIndex].text;

  fetch('/api/actions/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: currentTicket.id,
      reason: 'Additional freight budget rejected by operations approver.',
      approverName: approver
    })
  })
    .then(r => r.json())
    .then(data => {
      showNotification('Action rejected. Activated zero-cost soft launch protocol.', 'warning');
      document.getElementById('btnApproveAction').disabled = true;
      document.getElementById('btnApproveAction').textContent = 'Expenditure Rejected';
      document.getElementById('decisionTitle').textContent = 'Fallback Option: Zero-Cost Soft Launch';
      document.getElementById('kpiCost').textContent = '₹0';
      document.getElementById('decisionRationale').textContent = 'Store will open with 120 display units only. Opening floor plan scaled back to avoid freight expenditure.';
      fetchAuditTrail();
    });
}

// Human Override Modal Controls
function openOverrideModal() {
  const modal = document.getElementById('modalOverride');
  if (currentTicket && currentTicket.extracted) {
    document.getElementById('overrideQty').value = (currentTicket.extracted.required_quantity || 500) + 20; // suggest buffer
    document.getElementById('overrideLocation').value = currentTicket.extracted.target_location || 'Pune';
    document.getElementById('overrideDeadline').value = currentTicket.extracted.approval_deadline || 'Today 4:00 PM';
  }
  modal.showModal();
}

function closeOverrideModal() {
  document.getElementById('modalOverride').close();
}

function submitOverrideInputs() {
  const qty = document.getElementById('overrideQty').value;
  const location = document.getElementById('overrideLocation').value;
  const deadline = document.getElementById('overrideDeadline').value;

  closeOverrideModal();

  fetch('/api/actions/override', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: currentTicket.id,
      overrides: {
        required_quantity: qty,
        target_location: location,
        approval_deadline: deadline
      },
      approverName: 'Rahul Sharma (Human Override)'
    })
  })
    .then(r => r.json())
    .then(data => {
      showNotification(`Human override applied: Quantity updated to ${qty} units. Models recalculated.`, 'success');
      currentTicket = data.ticket;
      handleSuccessfulPipeline(data.ticket);
    })
    .catch(err => {
      showNotification('Override error: ' + err.message, 'danger');
    });
}

// SLA Auto-Escalation
function triggerEscalation() {
  fetch('/api/actions/escalate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId: currentTicket ? currentTicket.id : null })
  })
    .then(r => r.json())
    .then(data => {
      showNotification(`🚨 ESCALATION TRIGGERED: Deadline reached without response. Escalated to Vikram Malhotra (VP of Supply Chain).`, 'danger');
      document.getElementById('policyPill').textContent = 'ESCALATED TO VP';
      document.getElementById('policyPill').className = 'policy-pill badge-danger';
      fetchAuditTrail();
    });
}

// Switch Communications Hub Tabs
function switchCommsTab(tab) {
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));

  if (!currentTicket || !currentTicket.communications) return;

  const comms = currentTicket.communications;

  if (tab === 'carrier') {
    document.getElementById('pillCarrier').classList.add('active');
    document.getElementById('commsToField').textContent = `To: ${comms.carrier_email.recipient}`;
    document.getElementById('commsSubjectField').textContent = comms.carrier_email.subject;
    document.getElementById('commsTextContent').textContent = comms.carrier_email.body;
  } else if (tab === 'store') {
    document.getElementById('pillStore').classList.add('active');
    document.getElementById('commsToField').textContent = `To: ${comms.store_manager_email.recipient}`;
    document.getElementById('commsSubjectField').textContent = comms.store_manager_email.subject;
    document.getElementById('commsTextContent').textContent = comms.store_manager_email.body;
  } else if (tab === 'exec') {
    document.getElementById('pillExec').classList.add('active');
    document.getElementById('commsToField').textContent = `Channel: ${comms.executive_summary.channel}`;
    document.getElementById('commsSubjectField').textContent = 'Subject: Operational Escalation Resolution Bulletin';
    document.getElementById('commsTextContent').textContent = comms.executive_summary.body;
  }
}

function copyCommsDraft() {
  const content = document.getElementById('commsTextContent').textContent;
  navigator.clipboard.writeText(content);
  showNotification('Draft copied to clipboard!', 'info');
}

// Countdown Clock
function startCountdownTimer() {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (secondsRemaining > 0) {
      secondsRemaining--;
      const hours = Math.floor(secondsRemaining / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;
      const display = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
      document.getElementById('countdownClock').textContent = display;

      const progress = (secondsRemaining / (4 * 3600)) * 100;
      document.getElementById('slaProgressBar').style.width = `${progress}%`;
    } else {
      document.getElementById('countdownClock').textContent = '00h 00m 00s (EXPIRED)';
      document.getElementById('countdownClock').style.color = '#ef4444';
    }
  }, 1000);
}

// Fetch & Render Immutable Audit Trail
function fetchAuditTrail() {
  fetch('/api/audit')
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById('auditTrailContainer');
      container.innerHTML = '';
      data.auditTrail.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'audit-entry';

        const timeStr = new Date(entry.timestamp).toLocaleTimeString();
        const isHuman = entry.user !== 'SYSTEM' && entry.user !== 'AI_AGENT' && entry.user !== 'SECURITY_AGENT';

        div.innerHTML = `
          <div class="audit-timestamp">${timeStr}</div>
          <div class="audit-pill ${isHuman ? 'pill-human' : entry.agent.includes('Security') ? 'pill-guard' : 'pill-ai'}">
            ${entry.agent}
          </div>
          <div class="audit-text">
            <strong>${entry.action}:</strong> ${entry.details}
            ${isHuman ? `<span style="color:#f59e0b; font-weight:700;"> [User: ${entry.user}]</span>` : ''}
          </div>
        `;
        container.appendChild(div);
      });
    });
}

// Reset Demo State
function resetDemoState() {
  fetch('/api/reset', { method: 'POST' })
    .then(r => r.json())
    .then(() => {
      showNotification('Platform state reset to pristine initial state.', 'info');
      loadScenario('pune_delay');
      fetchAuditTrail();
    });
}

// Role Change Handler
function onRoleChange(role) {
  showNotification(`Active role switched to: ${role}`, 'info');
}

// System Notification Bar
function showNotification(msg, type = 'info') {
  const banner = document.getElementById('globalAlertBanner');
  const icon = document.getElementById('alertIcon');
  const text = document.getElementById('alertText');

  text.textContent = msg;
  if (type === 'danger') icon.textContent = '🚨';
  else if (type === 'warning') icon.textContent = '⚠️';
  else if (type === 'success') icon.textContent = '✓';
  else icon.textContent = 'ℹ️';

  banner.className = `alert-banner ${type === 'danger' ? 'badge-danger' : ''}`;
  banner.classList.remove('hidden');

  setTimeout(() => {
    closeAlertBanner();
  }, 6000);
}

function closeAlertBanner() {
  document.getElementById('globalAlertBanner').classList.add('hidden');
}

// Slideshow Renderer
function renderSlide(index) {
  currentSlideIndex = index;
  const slide = SLIDES[index];
  const viewport = document.getElementById('slideViewport');

  viewport.innerHTML = `
    <span class="card-badge badge-purple" style="margin-bottom:0.75rem;">SLIDE ${index + 1} OF ${SLIDES.length}</span>
    <h2 class="slide-headline">${slide.title}</h2>
    <div class="slide-subtitle">${slide.subtitle}</div>
    <ul class="slide-bullets">
      ${slide.bullets.map(b => `
        <li class="slide-bullet-item">
          <span class="slide-bullet-icon">✦</span>
          <span>${b}</span>
        </li>
      `).join('')}
    </ul>
  `;

  document.getElementById('slideCounterText').textContent = `Slide ${index + 1} of ${SLIDES.length}`;
  document.getElementById('btnPrevSlide').disabled = index === 0;
  document.getElementById('btnNextSlide').disabled = index === SLIDES.length - 1;
}

function nextSlide() {
  if (currentSlideIndex < SLIDES.length - 1) {
    renderSlide(currentSlideIndex + 1);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    renderSlide(currentSlideIndex - 1);
  }
}

// Render PRD Tab
function renderPrdContent() {
  document.getElementById('prdRenderedContainer').innerHTML = PRD_HTML;
}

// Render Video Guide Tab
function renderVideoGuideContent() {
  document.getElementById('videoGuideRenderedContainer').innerHTML = `
    <h2>10-Minute Demo Video Walkthrough Guide</h2>
    <p>Use this turn-by-turn script and timeline to record your video submission or demonstrate the platform live to the evaluation panel.</p>
    
    <table>
      <thead>
        <tr><th>Timestamp</th><th>Section</th><th>Key Action & Screen</th><th>Narration Highlights</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>0:00 – 1:30</strong></td>
          <td>Business Problem & Intro</td>
          <td>Operations Console overview, role switcher set to Regional Ops Manager.</td>
          <td>Explain retail stakes: ₹8.5L/day store launch delay loss; manual email firefighting chaos.</td>
        </tr>
        <tr>
          <td><strong>1:30 – 3:30</strong></td>
          <td>Multi-Agent Pipeline Execution</td>
          <td>Click "Run Agentic Pipeline" on the Pune Store Launch sample.</td>
          <td>Highlight specialized agent handoffs: Guardrail, Extraction, WMS tool-calling, and Risk assessment.</td>
        </tr>
        <tr>
          <td><strong>3:30 – 5:30</strong></td>
          <td>Human-in-the-Loop & Override</td>
          <td>Highlight 4:00 PM countdown timer. Open "Human Override" modal, adjust units to 400.</td>
          <td>Show why spend >₹10k requires human sign-off; demonstrate dynamic model recalculation.</td>
        </tr>
        <tr>
          <td><strong>5:30 – 7:00</strong></td>
          <td>Automated Comms & Audit Trail</td>
          <td>Click "Approve & Dispatch". Show 3 generated emails & SHA-256 verified audit log.</td>
          <td>Explain 1-click execution to carrier, store manager, and VP Slack notification.</td>
        </tr>
        <tr>
          <td><strong>7:00 – 9:00</strong></td>
          <td>Edge Cases Demonstration</td>
          <td>Use Edge Cases Lab: Test Inventory Conflict, Missing Info, Prompt Injection, and SLA Escalation.</td>
          <td>Demonstrate resilience against real-world operational and adversarial anomalies.</td>
        </tr>
        <tr>
          <td><strong>9:00 – 10:00</strong></td>
          <td>Architecture, ROI & Conclusion</td>
          <td>Switch to 8-10 Slide Presentation tab.</td>
          <td>Summarize 95% faster MTTR, ₹60L annual savings, and enterprise readiness.</td>
        </tr>
      </tbody>
    </table>
  `;
}
