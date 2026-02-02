import type { ChangePlan, TieringAnswers } from '../types';
import { Tooltip } from '../components/Tooltip';

interface Step3Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

interface TieringQuestion {
  key: keyof TieringAnswers;
  label: string;
  type: 'yesno' | 'select';
  options?: { value: string; label: string }[];
  hint?: string;
  otherKey?: keyof TieringAnswers;
}

const tieringQuestions: TieringQuestion[] = [
  {
    key: 'impactScope',
    label: 'What is the impact scope?',
    type: 'select',
    options: [
      { value: 'team', label: 'One team' },
      { value: 'multi-team-same-function', label: 'Multiple teams in the same function' },
      { value: 'multi-function-broad', label: 'Multiple functions or broad processes' },
      { value: 'other', label: 'Other' },
    ],
    otherKey: 'impactScopeOther',
  },
  {
    key: 'roleChanges',
    label: 'Will this change involve role changes?',
    type: 'yesno',
    hint: 'People moving to different roles, new responsibilities, or reporting line changes.',
  },
  {
    key: 'identityStatusChange',
    label: 'Does it affect identity or status?',
    type: 'yesno',
    hint: 'Closing a product, reducing responsibility, changing titles, merging teams.',
  },
  {
    key: 'reversible',
    label: 'Is this change reversible?',
    type: 'yesno',
    hint: 'Could you undo this if it doesn\'t work, or is it a one-way door?',
  },
  {
    key: 'moraleImpact',
    label: 'Is there potential morale or trust impact?',
    type: 'yesno',
    hint: 'Could this erode trust or lower morale if handled poorly?',
  },
  {
    key: 'ongoingOrOneTime',
    label: 'Is this an ongoing daily change or a one-time event?',
    type: 'select',
    options: [
      { value: 'ongoing', label: 'Ongoing — affects daily work' },
      { value: 'one-time', label: 'One-time — a discrete change' },
      { value: 'other', label: 'Other' },
    ],
    otherKey: 'ongoingOrOneTimeOther',
  },
  {
    key: 'crossTeamDependencies',
    label: 'Are there dependencies on other teams?',
    type: 'yesno',
  },
  {
    key: 'legalChallenges',
    label: 'Are there potential legal challenges?',
    type: 'yesno',
    hint: 'Layoffs, demotions, contractual obligations, regulatory requirements.',
  },
  {
    key: 'localOrGlobal',
    label: 'Is this local or global?',
    type: 'select',
    options: [
      { value: 'local', label: 'Local — one site or region' },
      { value: 'global', label: 'Global — across regions or the whole organization' },
      { value: 'other', label: 'Other' },
    ],
    otherKey: 'localOrGlobalOther',
  },
];

function computeTier(t: TieringAnswers): 'low' | 'medium' | 'high' | '' {
  const answered = Object.entries(t)
    .filter(([k]) => !k.endsWith('Other'))
    .filter(([, v]) => v !== null && v !== '')
    .length;
  if (answered < 5) return '';

  let score = 0;
  if (t.impactScope === 'multi-function-broad') score += 3;
  else if (t.impactScope === 'multi-team-same-function') score += 2;
  else if (t.impactScope === 'team') score += 1;
  else if (t.impactScope === 'other') score += 2;

  if (t.roleChanges) score += 2;
  if (t.identityStatusChange) score += 3;
  if (t.reversible === false) score += 2;
  if (t.moraleImpact) score += 2;
  if (t.ongoingOrOneTime === 'ongoing') score += 1;
  else if (t.ongoingOrOneTime === 'other') score += 1;
  if (t.crossTeamDependencies) score += 1;
  if (t.legalChallenges) score += 3;
  if (t.localOrGlobal === 'global') score += 2;
  else if (t.localOrGlobal === 'other') score += 1;

  if (score >= 12) return 'high';
  if (score >= 6) return 'medium';
  return 'low';
}

export function Step3ScopeTime({ plan, onChange }: Step3Props) {
  const updateTiering = (key: keyof TieringAnswers, value: TieringAnswers[typeof key]) => {
    const newTiering = { ...plan.tiering, [key]: value };
    const tierLevel = computeTier(newTiering);
    onChange({ tiering: newTiering, tierLevel });
  };

  return (
    <div className="step-content">
      <h2>Scope & Time</h2>
      <p className="step-intro">
        These questions help determine how complex your change is.
        Answer honestly — a higher <Tooltip term="Tiering">tier</Tooltip> doesn't
        mean failure, it means you'll need more preparation.
      </p>

      <div className="tiering-questions">
        {tieringQuestions.map((q) => (
          <div key={q.key} className="field tiering-field">
            <label>{q.label}</label>
            {q.hint && <span className="field-hint">{q.hint}</span>}

            {q.type === 'yesno' && (
              <div className="yesno-group">
                <button
                  type="button"
                  className={`yesno-btn ${plan.tiering[q.key] === true ? 'selected' : ''}`}
                  onClick={() => updateTiering(q.key, true as never)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`yesno-btn ${plan.tiering[q.key] === false ? 'selected' : ''}`}
                  onClick={() => updateTiering(q.key, false as never)}
                >
                  No
                </button>
              </div>
            )}

            {q.type === 'select' && q.options && (
              <>
                <div className="select-group">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`select-btn ${plan.tiering[q.key] === opt.value ? 'selected' : ''}`}
                      onClick={() => updateTiering(q.key, opt.value as never)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {q.otherKey && plan.tiering[q.key] === 'other' && (
                  <input
                    type="text"
                    className="other-input"
                    value={(plan.tiering[q.otherKey] as string) || ''}
                    onChange={(e) => updateTiering(q.otherKey!, e.target.value as never)}
                    placeholder="Please describe..."
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {plan.tierLevel && (
        <div className={`tier-result tier-${plan.tierLevel}`}>
          <span className="tier-label">Complexity tier:</span>
          <span className="tier-value">{plan.tierLevel}</span>
          <span className="tier-desc">
            {plan.tierLevel === 'low' && 'Straightforward change. Standard preparation should be enough.'}
            {plan.tierLevel === 'medium' && 'Moderate complexity. You\'ll want solid preparation across all components.'}
            {plan.tierLevel === 'high' && 'High complexity. This needs careful planning, strong sponsorship, and clear risk mitigation.'}
          </span>
        </div>
      )}

      <div className="field" style={{ marginTop: '1.5rem' }}>
        <label>Time pressure</label>
        <span className="field-hint">How much time pressure is on this change?</span>
        <div className="select-group">
          {(['low', 'moderate', 'high', 'other'] as const).map((level) => (
            <button
              key={level}
              type="button"
              className={`select-btn ${plan.timePressure === level ? 'selected' : ''}`}
              onClick={() => onChange({ timePressure: level })}
            >
              {level === 'other' ? 'Other' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        {plan.timePressure === 'other' && (
          <input
            type="text"
            className="other-input"
            value={plan.timePressureOther}
            onChange={(e) => onChange({ timePressureOther: e.target.value })}
            placeholder="Please describe..."
          />
        )}
      </div>
    </div>
  );
}
