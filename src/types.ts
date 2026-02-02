export type Status = 'draft' | 'good-enough' | 'strong' | 'needs-attention' | 'red';

export type ImpactScope = 'team' | 'multi-team-same-function' | 'multi-function-broad';

export interface TieringAnswers {
  impactScope: ImpactScope | '';
  roleChanges: boolean | null;
  identityStatusChange: boolean | null;
  reversible: boolean | null;
  moraleImpact: boolean | null;
  ongoingOrOneTime: 'ongoing' | 'one-time' | '';
  crossTeamDependencies: boolean | null;
  legalChallenges: boolean | null;
  localOrGlobal: 'local' | 'global' | '';
}

export interface ComponentAssessment {
  vision: { notes: string; status: Status };
  consensus: { notes: string; status: Status };
  skills: { notes: string; status: Status };
  incentives: { notes: string; status: Status };
  resources: { notes: string; status: Status };
  plan: { notes: string; status: Status };
}

export interface Stakeholder {
  name: string;
  role: string;
  notes: string;
}

export interface StakeholderData {
  owner: Stakeholder;
  sponsor: Stakeholder;
  hrPartner: Stakeholder;
}

export interface GateStatus {
  gate1_strategicClarity: Status;
  gate1_notes: string;
  gate2_ownershipPower: Status;
  gate2_notes: string;
  gate3_riskReadiness: Status;
  gate3_notes: string;
}

export interface ChangePlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  overallStatus: Status;
  tiering: TieringAnswers;
  tierLevel: 'low' | 'medium' | 'high' | '';
  timePressure: 'low' | 'moderate' | 'high' | '';
  components: ComponentAssessment;
  stakeholders: StakeholderData;
  gates: GateStatus;
}

export function createEmptyPlan(): ChangePlan {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    overallStatus: 'draft',
    tiering: {
      impactScope: '',
      roleChanges: null,
      identityStatusChange: null,
      reversible: null,
      moraleImpact: null,
      ongoingOrOneTime: '',
      crossTeamDependencies: null,
      legalChallenges: null,
      localOrGlobal: '',
    },
    tierLevel: '',
    timePressure: '',
    components: {
      vision: { notes: '', status: 'draft' },
      consensus: { notes: '', status: 'draft' },
      skills: { notes: '', status: 'draft' },
      incentives: { notes: '', status: 'draft' },
      resources: { notes: '', status: 'draft' },
      plan: { notes: '', status: 'draft' },
    },
    stakeholders: {
      owner: { name: '', role: '', notes: '' },
      sponsor: { name: '', role: '', notes: '' },
      hrPartner: { name: '', role: '', notes: '' },
    },
    gates: {
      gate1_strategicClarity: 'draft',
      gate1_notes: '',
      gate2_ownershipPower: 'draft',
      gate2_notes: '',
      gate3_riskReadiness: 'draft',
      gate3_notes: '',
    },
  };
}
