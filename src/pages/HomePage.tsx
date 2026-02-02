import { StatusBadge } from '../components/StatusBadge';
import type { ChangePlan } from '../types';

interface HomePageProps {
  plans: ChangePlan[];
  onNewPlan: () => void;
  onOpenPlan: (id: string) => void;
  onExecuteMode: () => void;
}

export function HomePage({ plans, onNewPlan, onOpenPlan, onExecuteMode }: HomePageProps) {
  return (
    <div className="page home-page">
      <header className="home-header">
        <h1>ChangeQuest OS</h1>
        <p className="subtitle">
          Organizational change is hard. This helps you think it through.
        </p>
      </header>

      <section className="mode-selector">
        <button className="mode-card" onClick={onNewPlan}>
          <h2>Plan</h2>
          <p>
            Work through the critical questions before you launch a change.
            Step by step, no rush.
          </p>
        </button>
        <button className="mode-card mode-card-muted" onClick={onExecuteMode}>
          <h2>Execute</h2>
          <p>
            Track progress on changes you've already planned.
            <span className="coming-soon">Coming soon</span>
          </p>
        </button>
      </section>

      {plans.length > 0 && (
        <section className="plans-list">
          <h2>Your changes</h2>
          <ul>
            {plans
              .slice()
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((plan) => (
                <li key={plan.id}>
                  <button className="plan-row" onClick={() => onOpenPlan(plan.id)}>
                    <div className="plan-row-main">
                      <span className="plan-title">
                        {plan.title || 'Untitled change'}
                      </span>
                      <span className="plan-step">Step {plan.currentStep} of 5</span>
                    </div>
                    <div className="plan-row-meta">
                      <StatusBadge status={plan.overallStatus} />
                      <span className="plan-date">
                        {new Date(plan.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {plans.length === 0 && (
        <section className="empty-state">
          <p>
            No changes yet. Start by planning one — even a rough draft helps more than nothing.
          </p>
        </section>
      )}
    </div>
  );
}
