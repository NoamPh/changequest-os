import { useState } from 'react';
import type { ChangePlan, ComponentAssessment, Status, Alignment, StakeholderAlignmentEntry } from '../types';
import { Tooltip } from '../components/Tooltip';
import { StatusBadge } from '../components/StatusBadge';
import { guidingQuestions } from '../data/definitions';

interface Step4Props {
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
const alignmentOptions: { value: Alignment; label: string }[] = [
  { value: 'aligned', label: 'Aligned' },
  { value: 'mostly-aligned', label: 'Mostly aligned' },
  { value: 'concerned', label: 'Concerned' },
];

function GuidingQuestionsToggle({ componentKey }: { componentKey: string }) {
  const [open, setOpen] = useState(false);
  const questions = guidingQuestions[componentKey];
  if (!questions) return null;

  return (
    <div className="guiding-questions">
      <button
        type="button"
        className="guiding-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? 'Hide guiding questions' : 'Need help thinking this through?'}
      </button>
      {open && (
        <ul className="guiding-list">
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function computeAlignmentSummary(
  alignments: StakeholderAlignmentEntry[],
  mustAlignIds: Set<string>
): { status: Status; message: string } {
  if (alignments.length === 0) {
    return { status: 'draft', message: 'No stakeholder responses yet.' };
  }

  const responded = alignments.filter((a) => a.alignment !== '');
  if (responded.length === 0) {
    return { status: 'draft', message: 'No stakeholder responses yet.' };
  }

  const mustAlignResponses = responded.filter((a) => mustAlignIds.has(a.stakeholderId));
  const concerned = responded.filter((a) => a.alignment === 'concerned');
  const mustAlignConcerned = mustAlignResponses.filter((a) => a.alignment === 'concerned');
  const allAligned = responded.every((a) => a.alignment === 'aligned');
  const allAtLeastMostly = responded.every(
    (a) => a.alignment === 'aligned' || a.alignment === 'mostly-aligned'
  );

  if (mustAlignConcerned.length > 0) {
    return {
      status: 'needs-attention',
      message: `${mustAlignConcerned.length} must-align stakeholder${mustAlignConcerned.length > 1 ? 's' : ''} concerned. Worth a conversation before proceeding.`,
    };
  }
  if (concerned.length > 0) {
    return {
      status: 'good-enough',
      message: `${concerned.length} stakeholder${concerned.length > 1 ? 's' : ''} concerned, but none are must-align. Consider addressing their feedback.`,
    };
  }
  if (allAligned) {
    return { status: 'strong', message: 'All responding stakeholders are aligned.' };
  }
  if (allAtLeastMostly) {
    return { status: 'good-enough', message: 'Stakeholders are mostly aligned. Good enough to move forward.' };
  }
  return { status: 'good-enough', message: 'Mixed alignment. Review individual responses.' };
}

export function Step4Components({ plan, onChange }: Step4Props) {
  const updateComponent = (
    key: keyof ComponentAssessment,
    field: 'notes' | 'status' | 'confidenceReason',
    value: string
  ) => {
    const newComponents = {
      ...plan.components,
      [key]: { ...plan.components[key], [field]: value },
    };
    onChange({ components: newComponents });
  };

  // Build stakeholder alignment entries from people defined in Step 2
  const allPeople = [
    { id: '__owner__', name: plan.people.owner.name, mustAlign: true },
    { id: '__hr__', name: plan.people.hrPartner.name, mustAlign: false },
    ...(plan.people.sponsor.name
      ? [{ id: '__sponsor__', name: plan.people.sponsor.name, mustAlign: true }]
      : []),
    ...plan.people.stakeholders.map((s) => ({
      id: s.id,
      name: s.name,
      mustAlign: s.mustAlign,
    })),
  ].filter((p) => p.name.trim() !== '');

  const mustAlignIds = new Set(allPeople.filter((p) => p.mustAlign).map((p) => p.id));

  const updateAlignment = (stakeholderId: string, field: 'alignment' | 'comment', value: string) => {
    const existing = plan.stakeholderCheck.alignments;
    const person = allPeople.find((p) => p.id === stakeholderId);
    const idx = existing.findIndex((a) => a.stakeholderId === stakeholderId);

    let newAlignments: StakeholderAlignmentEntry[];
    if (idx >= 0) {
      newAlignments = existing.map((a, i) =>
        i === idx ? { ...a, [field]: value } : a
      );
    } else {
      newAlignments = [
        ...existing,
        {
          stakeholderId,
          stakeholderName: person?.name || '',
          alignment: field === 'alignment' ? (value as Alignment) : '',
          comment: field === 'comment' ? value : '',
        },
      ];
    }

    onChange({
      stakeholderCheck: { ...plan.stakeholderCheck, alignments: newAlignments },
    });
  };

  const getAlignment = (stakeholderId: string): StakeholderAlignmentEntry | undefined => {
    return plan.stakeholderCheck.alignments.find((a) => a.stakeholderId === stakeholderId);
  };

  const summary = computeAlignmentSummary(plan.stakeholderCheck.alignments, mustAlignIds);

  return (
    <div className="step-content">
      <h2>Components Quest</h2>
      <p className="step-intro">
        Every successful change needs these elements. Assess each one honestly.
        <br />
        <span className="confidence-note">
          <Tooltip term="Confidence Level">Status</Tooltip> reflects confidence
          and readiness, not how "good" this is. Draft is a fine starting point.
        </span>
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
              <div className="status-options">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`status-option ${plan.components[comp.key].status === s ? 'active' : ''}`}
                    onClick={() => updateComponent(comp.key, 'status', s)}
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

            <div className="field confidence-reason-field">
              <label>What makes you feel this is {plan.components[comp.key].status === 'draft' ? 'at this level' : plan.components[comp.key].status === 'good-enough' ? '"Good enough"' : `"${plan.components[comp.key].status.charAt(0).toUpperCase() + plan.components[comp.key].status.slice(1)}"`} right now?</label>
              <textarea
                value={plan.components[comp.key].confidenceReason}
                onChange={(e) => updateComponent(comp.key, 'confidenceReason', e.target.value)}
                placeholder="Optional — helps you think through your reasoning"
                rows={2}
              />
            </div>

            <GuidingQuestionsToggle componentKey={comp.key} />
          </div>
        ))}
      </div>

      {/* Stakeholder Check — replaces self-reported Consensus */}
      <section className="stakeholder-check-section">
        <h2>
          <Tooltip term="Stakeholder Check">Stakeholder Check</Tooltip>
        </h2>
        <p className="step-intro">
          Instead of self-reporting consensus, capture each stakeholder's actual
          perspective. Are they aligned on this change?
        </p>

        {allPeople.length === 0 && (
          <p className="empty-inline">
            No people defined yet. Go back to People & Roles to add stakeholders.
          </p>
        )}

        {allPeople.length > 0 && (
          <div className="alignment-list">
            {allPeople.map((person) => {
              const entry = getAlignment(person.id);
              return (
                <div key={person.id} className="alignment-row">
                  <div className="alignment-person">
                    <span className="alignment-name">{person.name}</span>
                    {person.mustAlign && (
                      <span className="must-align-badge">must-align</span>
                    )}
                  </div>
                  <div className="alignment-controls">
                    <div className="alignment-buttons">
                      {alignmentOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`alignment-btn ${entry?.alignment === opt.value ? `selected alignment-${opt.value}` : ''}`}
                          onClick={() => updateAlignment(person.id, 'alignment', opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="alignment-comment"
                      value={entry?.comment || ''}
                      onChange={(e) => updateAlignment(person.id, 'comment', e.target.value)}
                      placeholder="One-line comment..."
                    />
                  </div>
                </div>
              );
            })}

            <div className={`alignment-summary status-bg-${summary.status}`}>
              <StatusBadge status={summary.status} />
              <span className="alignment-summary-text">{summary.message}</span>
            </div>
          </div>
        )}

        <div className="field" style={{ marginTop: '1rem' }}>
          <label>Additional notes on alignment</label>
          <textarea
            value={plan.stakeholderCheck.notes}
            onChange={(e) =>
              onChange({
                stakeholderCheck: { ...plan.stakeholderCheck, notes: e.target.value },
              })
            }
            placeholder="Anything else worth noting about stakeholder alignment..."
            rows={2}
          />
        </div>
      </section>
    </div>
  );
}
