interface WizardNavProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  nextLabel?: string;
}

export function WizardNav({ step, totalSteps, onBack, onNext, onSave, nextLabel }: WizardNavProps) {
  return (
    <div className="wizard-nav">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={onSave}
      >
        Save & Exit
      </button>
      <div className="wizard-nav-actions">
        {step > 1 && (
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={onNext}>
          {nextLabel || (step < totalSteps ? 'Continue' : 'Finish')}
        </button>
      </div>
    </div>
  );
}
