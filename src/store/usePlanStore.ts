import { useState, useCallback, useEffect } from 'react';
import type { ChangePlan } from '../types';
import { createEmptyPlan } from '../types';

const STORAGE_KEY = 'changequest-plans';

function loadPlans(): ChangePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlans(plans: ChangePlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function usePlanStore() {
  const [plans, setPlans] = useState<ChangePlan[]>(loadPlans);

  useEffect(() => {
    savePlans(plans);
  }, [plans]);

  const createPlan = useCallback((): ChangePlan => {
    const plan = createEmptyPlan();
    setPlans((prev) => [...prev, plan]);
    return plan;
  }, []);

  const updatePlan = useCallback((id: string, updates: Partial<ChangePlan>) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const getPlan = useCallback(
    (id: string): ChangePlan | undefined => {
      return plans.find((p) => p.id === id);
    },
    [plans]
  );

  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { plans, createPlan, updatePlan, getPlan, deletePlan };
}
