import type { ChangePlan, ComponentAssessment, Status } from '../types';
import { Tooltip } from '../components/Tooltip';
import { StatusBadge } from '../components/StatusBadge';

interface Step3Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

const componentMeta: {
  key: keyof ComponentAssessment;
  label: string;
  prompt: string;
}[] = [
  {
    key: 'vision',
    label: 'Vision',
    prompt: 'Can people clearly articulate why this change matters and where it leads?',
  },
  {
    key: 'consensus',
    label: 'Consensus',
    prompt: 'Do the key people agree this change is necessary and worth doing?',
  },
  {
    key: 'skills',
    label: 'Skills',
    prompt: 'Do people have — or can they develop — the capabilities needed?',
  },
  {
    key: 'incentives',
    label: 'Incentives',
    prompt: 'Is there a reason for people to adopt this change?',
  },
  {
    key: 'resources',
    label: 'Resources',
    prompt: 'Are time, budget, tools, and headcount available?',
  },
  {
    key: 'plan',
    label: 'Plan',
    prompt: 'Is there a realistic sequence of actions with owners and timelines?',
  },
];

const statusOptions: Status[] = ['draft', 'good-enough', 'strong', 'needs-attention', 'red'];

export function Step3Components({ plan, onChange }: Step3Props) {
  const statusLabel = (s: Status): string =>
    s === 'good-enough'
      ? 'Good enough'
      : s === 'needs-attention'
        ? 'Needs attention'
        : s.charAt(0).toUpperCase() + s.slice(1);

  const updateComponent = (
    key: keyof ComponentAssessment,
    field: 'notes' | 'status' | 'confidenceRationale',
    value: string
  ) => {
    const newComponents = {
      ...plan.components,
      [key]: { ...plan.components[key], [field]: value },
    };
    onChange({ components: newComponents });
  };

  return (
    <div className="step-content">
      <h2>Components Quest</h2>
      <p className="step-intro">
        Every successful change needs these six elements. Assess each one honestly.
        It's fine to start at "Draft" — awareness of gaps is progress.
      </p>

      <div className="components-grid">
        {componentMeta.map((comp) => (
          <div key={comp.key} className="component-card">
            <div className="component-header">
              <h3>
                <Tooltip term={comp.label}>{comp.label}</Tooltip>
              </h3>
              <StatusBadge status={plan.components[comp.key].status} />
            </div>
            <p className="component-prompt">{comp.prompt}</p>

            <div className="field">
              <textarea
                value={plan.components[comp.key].notes}
                onChange={(e) => updateComponent(comp.key, 'notes', e.target.value)}
                placeholder="Your assessment..."
                rows={3}
              />
            </div>

            <div className="status-selector">
              <span className="status-label">Confidence:</span>
              <span className="confidence-helper">
                This reflects confidence and readiness, not how 'good' this is.
              </span>
              <div className="status-options">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-option ${plan.components[comp.key].status === s ? 'active' : ''}`}
                    onClick={() => updateComponent(comp.key, 'status', s)}
                  >
                    <span className={`status-dot status-${s}`} />
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            <div className="field confidence-rationale">
              <label>
                What makes you feel this is <strong>{statusLabel(plan.components[comp.key].status)}</strong> right now?
              </label>
              <textarea
                value={plan.components[comp.key].confidenceRationale ?? ''}
                onChange={(e) => updateComponent(comp.key, 'confidenceRationale', e.target.value)}
                placeholder="Optional — describe what's behind this confidence level..."
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
