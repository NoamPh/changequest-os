const stepNames = [
  'People & Roles',
  'Create Change',
  'Scope & Time',
  'Components',
  'Stakeholders',
  'Gates',
];

interface StepIndicatorProps {
  current: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ current, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="step-indicator" aria-label="Plan progress">
      <ol>
        {stepNames.map((name, i) => {
          const step = i + 1;
          const state =
            step < current ? 'completed' : step === current ? 'current' : 'upcoming';
          return (
            <li key={step} className={`step-item step-${state}`}>
              <button
                type="button"
                onClick={() => onStepClick(step)}
                className="step-button"
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span className="step-number">{step}</span>
                <span className="step-name">{name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
