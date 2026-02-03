import { StepIndicator } from '../components/StepIndicator';
import { WizardNav } from '../components/WizardNav';
import { Step0PeopleRoles } from './Step0PeopleRoles';
import { Step1CreateChange } from './Step1CreateChange';
import { Step2ScopeTime } from './Step2ScopeTime';
import { Step3Components } from './Step3Components';
import { Step4Stakeholders } from './Step4Stakeholders';
import { Step5Gates } from './Step5Gates';
import type { ChangePlan } from '../types';

interface PlanWizardProps {
  plan: ChangePlan;
  onUpdate: (updates: Partial<ChangePlan>) => void;
  onExit: () => void;
}

const TOTAL_STEPS = 6;

export function PlanWizard({ plan, onUpdate, onExit }: PlanWizardProps) {
  const step = plan.currentStep;

  const goTo = (s: number) => {
    if (s >= 1 && s <= TOTAL_STEPS) {
      onUpdate({ currentStep: s });
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      onUpdate({ currentStep: step + 1 });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      onUpdate({ currentStep: step - 1 });
    }
  };

  const handleFinish = () => {
    onExit();
  };

  return (
    <div className="page wizard-page">
      <header className="wizard-header">
        <div className="wizard-title-row">
          <h1>{plan.title || 'New Change'}</h1>
        </div>
        <StepIndicator current={step} onStepClick={goTo} />
      </header>

      <main className="wizard-body">
        {step === 1 && <Step0PeopleRoles plan={plan} onChange={onUpdate} />}
        {step === 2 && <Step1CreateChange plan={plan} onChange={onUpdate} />}
        {step === 3 && <Step2ScopeTime plan={plan} onChange={onUpdate} />}
        {step === 4 && <Step3Components plan={plan} onChange={onUpdate} />}
        {step === 5 && <Step4Stakeholders plan={plan} onChange={onUpdate} />}
        {step === 6 && (
          <Step5Gates plan={plan} onChange={onUpdate} onFinish={handleFinish} />
        )}
      </main>

      <WizardNav
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={step === TOTAL_STEPS ? handleFinish : handleNext}
        onSave={onExit}
        nextLabel={step === TOTAL_STEPS ? 'Save & Return Home' : undefined}
      />
    </div>
  );
}
