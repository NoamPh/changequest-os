import type { ChangePlan } from '../types';

interface Step1Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

export function Step1CreateChange({ plan, onChange }: Step1Props) {
  return (
    <div className="step-content">
      <h2>What are you changing?</h2>
      <p className="step-intro">
        Start simple. Give this change a name and describe what's happening in plain language.
        You can refine it later.
      </p>

      <div className="field">
        <label htmlFor="change-title">Change title</label>
        <input
          id="change-title"
          type="text"
          value={plan.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Restructuring the product design team"
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="change-desc">What's changing and why?</label>
        <textarea
          id="change-desc"
          value={plan.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the change in a few sentences. Who does it affect? What will be different?"
          rows={5}
        />
        <span className="field-hint">
          Write as if you're explaining this to a smart colleague who hasn't heard about it yet.
        </span>
      </div>
    </div>
  );
}
