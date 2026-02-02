import { useState } from 'react';
import { usePlanStore } from './store/usePlanStore';
import { HomePage } from './pages/HomePage';
import { PlanWizard } from './pages/PlanWizard';
import { ExecuteMode } from './pages/ExecuteMode';

type View = { type: 'home' } | { type: 'plan'; id: string } | { type: 'execute' };

function App() {
  const { plans, createPlan, updatePlan, getPlan } = usePlanStore();
  const [view, setView] = useState<View>({ type: 'home' });

  const handleNewPlan = () => {
    const plan = createPlan();
    setView({ type: 'plan', id: plan.id });
  };

  const handleOpenPlan = (id: string) => {
    setView({ type: 'plan', id });
  };

  const goHome = () => setView({ type: 'home' });

  if (view.type === 'execute') {
    return <ExecuteMode onBack={goHome} />;
  }

  if (view.type === 'plan') {
    const plan = getPlan(view.id);
    if (!plan) {
      setView({ type: 'home' });
      return null;
    }
    return (
      <PlanWizard
        plan={plan}
        onUpdate={(updates) => updatePlan(view.id, updates)}
        onExit={goHome}
      />
    );
  }

  return (
    <HomePage
      plans={plans}
      onNewPlan={handleNewPlan}
      onOpenPlan={handleOpenPlan}
      onExecuteMode={() => setView({ type: 'execute' })}
    />
  );
}

export default App;
