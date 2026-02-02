import type { ChangePlan, Milestone } from '../types';
import { Tooltip } from '../components/Tooltip';

interface Step5Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

export function Step5Milestones({ plan, onChange }: Step5Props) {
  const isApplicable = plan.tierLevel === 'medium' || plan.tierLevel === 'high';

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: '',
      targetDate: '',
      action: '',
      message: '',
      feedbackSignal: '',
    };
    onChange({ milestones: [...plan.milestones, newMilestone] });
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    onChange({
      milestones: plan.milestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    });
  };

  const removeMilestone = (id: string) => {
    onChange({
      milestones: plan.milestones.filter((m) => m.id !== id),
    });
  };

  if (!isApplicable) {
    return (
      <div className="step-content">
        <h2>Milestones</h2>
        <div className="milestone-not-applicable">
          <p>
            Your change is{' '}
            {plan.tierLevel === 'low' ? 'low complexity' : 'not yet assessed for complexity'}.
            Milestones are most useful for medium and high-complexity changes.
          </p>
          <p className="milestone-skip-note">
            You can skip this step. If your tier changes later, you can come back.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content">
      <h2>
        <Tooltip term="Milestone">Milestones</Tooltip>
      </h2>
      <p className="step-intro">
        For a {plan.tierLevel}-complexity change, it helps to define a few meaningful checkpoints.
        Keep this light — a handful of milestones is usually enough.
      </p>

      {plan.milestones.length === 0 && (
        <p className="empty-inline">
          No milestones yet. Add the first moments where you'll know if things are on track.
        </p>
      )}

      <div className="milestones-list">
        {plan.milestones.map((m, index) => (
          <div key={m.id} className="milestone-card">
            <div className="milestone-header">
              <span className="milestone-number">{index + 1}</span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeMilestone(m.id)}
                aria-label={`Remove milestone ${index + 1}`}
              >
                Remove
              </button>
            </div>

            <div className="milestone-fields">
              <div className="field">
                <label>What's the milestone?</label>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => updateMilestone(m.id, 'title', e.target.value)}
                  placeholder="e.g., First team briefing completed"
                />
              </div>

              <div className="field">
                <label>Target date</label>
                <input
                  type="date"
                  value={m.targetDate}
                  onChange={(e) => updateMilestone(m.id, 'targetDate', e.target.value)}
                />
                <span className="field-hint">Optional. A rough target is fine.</span>
              </div>

              <div className="field">
                <label>Action</label>
                <input
                  type="text"
                  value={m.action}
                  onChange={(e) => updateMilestone(m.id, 'action', e.target.value)}
                  placeholder="What needs to happen?"
                />
              </div>

              <div className="field">
                <label>Message</label>
                <input
                  type="text"
                  value={m.message}
                  onChange={(e) => updateMilestone(m.id, 'message', e.target.value)}
                  placeholder="What should people hear at this point?"
                />
              </div>

              <div className="field">
                <label>Feedback signal</label>
                <input
                  type="text"
                  value={m.feedbackSignal}
                  onChange={(e) => updateMilestone(m.id, 'feedbackSignal', e.target.value)}
                  placeholder="How will you know this is working?"
                />
                <span className="field-hint">
                  What would tell you things are on track — or not?
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-secondary" onClick={addMilestone}>
        + Add milestone
      </button>
    </div>
  );
}
