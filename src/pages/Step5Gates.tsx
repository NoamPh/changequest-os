import type { ChangePlan, GateStatus, Status } from '../types';
import { Tooltip } from '../components/Tooltip';
import { StatusBadge } from '../components/StatusBadge';

interface Step5Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
  onFinish: () => void;
}

const statusOptions: Status[] = ['draft', 'good-enough', 'strong', 'needs-attention', 'red'];

interface GateDef {
  key: 'gate1' | 'gate2' | 'gate3';
  statusKey: keyof GateStatus;
  notesKey: keyof GateStatus;
  label: string;
  tooltipTerm: string;
  description: string;
  criteria: string[];
}

const gates: GateDef[] = [
  {
    key: 'gate1',
    statusKey: 'gate1_strategicClarity',
    notesKey: 'gate1_notes',
    label: 'Gate 1 — Strategic Clarity',
    tooltipTerm: 'Strategic Clarity',
    description:
      'Can the Manager, HR partner, and Sponsor explain this change with the same framing?',
    criteria: [
      'Manager can articulate the change and its rationale clearly',
      'HR partner understands the people impact and communication needs',
      'Sponsor frames the change consistently with the same intent (not word-for-word)',
    ],
  },
  {
    key: 'gate2',
    statusKey: 'gate2_ownershipPower',
    notesKey: 'gate2_notes',
    label: 'Gate 2 — Ownership & Power',
    tooltipTerm: 'Ownership & Power',
    description:
      'Is there one clear Owner and a Sponsor with real authority?',
    criteria: [
      'Single clear Owner identified (not a committee)',
      'Sponsor has real authority to remove blockers and allocate resources',
      'Time commitment, authority scope, and presence are defined',
    ],
  },
  {
    key: 'gate3',
    statusKey: 'gate3_riskReadiness',
    notesKey: 'gate3_notes',
    label: 'Gate 3 — Risk Mitigation & Readiness',
    tooltipTerm: 'Risk Mitigation',
    description:
      'Are risks identified and mitigated? Is the plan approved?',
    criteria: [
      'Each identified risk has some mitigation plan',
      'No component is marked Red',
      'Sponsor has approved the summary',
      'No open legal blockers',
    ],
  },
];

function computeOverallStatus(plan: ChangePlan): Status {
  const statuses: Status[] = [
    plan.gates.gate1_strategicClarity,
    plan.gates.gate2_ownershipPower,
    plan.gates.gate3_riskReadiness,
    ...Object.values(plan.components).map((c) => c.status),
  ];

  if (statuses.some((s) => s === 'red')) return 'red';
  if (statuses.some((s) => s === 'needs-attention')) return 'needs-attention';
  if (statuses.every((s) => s === 'strong')) return 'strong';
  if (statuses.some((s) => s === 'draft')) return 'draft';
  return 'good-enough';
}

export function Step5Gates({ plan, onChange, onFinish }: Step5Props) {
  const updateGate = (key: keyof GateStatus, value: string) => {
    const newGates = { ...plan.gates, [key]: value };
    const newPlan = { ...plan, gates: newGates };
    const overallStatus = computeOverallStatus(newPlan);
    onChange({ gates: newGates, overallStatus });
  };

  const overallStatus = computeOverallStatus(plan);
  const hasRed = Object.values(plan.components).some((c) => c.status === 'red') ||
    [plan.gates.gate1_strategicClarity, plan.gates.gate2_ownershipPower, plan.gates.gate3_riskReadiness]
      .some((s) => s === 'red');

  return (
    <div className="step-content">
      <h2>Gates & Readiness</h2>
      <p className="step-intro">
        <Tooltip term="Gate">Gates</Tooltip> are honest checkpoints — not bureaucratic hoops.
        Assess each one. If something isn't ready, that's useful information.
      </p>

      <div className="gates-list">
        {gates.map((gate) => (
          <div key={gate.key} className="gate-card">
            <div className="gate-header">
              <h3>
                <Tooltip term={gate.tooltipTerm}>{gate.label}</Tooltip>
              </h3>
              <StatusBadge status={plan.gates[gate.statusKey] as Status} />
            </div>
            <p className="gate-desc">{gate.description}</p>

            <ul className="gate-criteria">
              {gate.criteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <div className="field">
              <textarea
                value={plan.gates[gate.notesKey] as string}
                onChange={(e) => updateGate(gate.notesKey, e.target.value)}
                placeholder="Notes on this gate..."
                rows={2}
              />
            </div>

            <div className="status-selector">
              <span className="status-label">Assessment:</span>
              <div className="status-options">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-option ${plan.gates[gate.statusKey] === s ? 'active' : ''}`}
                    onClick={() => updateGate(gate.statusKey, s)}
                  >
                    <span className={`status-dot status-${s}`} />
                    {s === 'good-enough'
                      ? 'Good enough'
                      : s === 'needs-attention'
                        ? 'Needs attention'
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="summary-section">
        <h2>Ready to Execute?</h2>
        <div className="summary-card">
          <div className="summary-row">
            <span>Overall status:</span>
            <StatusBadge status={overallStatus} />
          </div>
          <div className="summary-row">
            <span>Tier:</span>
            <span className={`tier-badge tier-${plan.tierLevel}`}>
              {plan.tierLevel || 'Not assessed'}
            </span>
          </div>
          <div className="summary-row">
            <span>Time pressure:</span>
            <span>{plan.timePressure || 'Not set'}</span>
          </div>
          <div className="summary-row">
            <span>Owner:</span>
            <span>{plan.stakeholders.owner.name || 'Not assigned'}</span>
          </div>
          <div className="summary-row">
            <span>Sponsor:</span>
            <span>{plan.stakeholders.sponsor.name || 'Not assigned'}</span>
          </div>

          {hasRed && (
            <div className="summary-warning">
              Some components or gates are marked Red. Address these before executing.
            </div>
          )}

          {overallStatus === 'strong' && (
            <div className="summary-ready">
              All gates and components look strong. This change is ready to execute.
            </div>
          )}

          {overallStatus === 'good-enough' && !hasRed && (
            <div className="summary-ok">
              Good enough to proceed. Keep an eye on items that aren't "Strong" yet.
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={onFinish}
            style={{ marginTop: '1rem' }}
          >
            Save & Return Home
          </button>
        </div>
      </section>
    </div>
  );
}
