export type Status = 'draft' | 'good-enough' | 'strong' | 'needs-attention' | 'red';

export type Alignment = 'aligned' | 'mostly-aligned' | 'concerned' | '';

// --- People & Roles (Step 2) ---

export interface PlanStakeholder {
  id: string;
  name: string;
  role: string;
  mustAlign: boolean;
}

export interface PeopleRoles {
  owner: { name: string; role: string; notes: string };
  hrPartner: { name: string; role: string; notes: string };
  sponsor: { name: string; role: string; notes: string };
  stakeholders: PlanStakeholder[];
}

// --- Scope & Time (Step 3) ---

export interface TieringAnswers {
  impactScope: 'team' | 'multi-team-same-function' | 'multi-function-broad' | 'other' | '';
  impactScopeOther: string;
  roleChanges: boolean | null;
  identityStatusChange: boolean | null;
  reversible: boolean | null;
  moraleImpact: boolean | null;
  ongoingOrOneTime: 'ongoing' | 'one-time' | 'other' | '';
  ongoingOrOneTimeOther: string;
  crossTeamDependencies: boolean | null;
  legalChallenges: boolean | null;
  localOrGlobal: 'local' | 'global' | 'other' | '';
  localOrGlobalOther: string;
}

// --- Components Quest (Step 4) ---

export interface ComponentEntry {
  notes: string;
  status: Status;
  confidenceReason: string;
}

export interface ComponentAssessment {
  vision: ComponentEntry;
  skills: ComponentEntry;
  incentives: ComponentEntry;
  resources: ComponentEntry;
  plan: ComponentEntry;
}

export interface StakeholderAlignmentEntry {
  stakeholderId: string;
  stakeholderName: string;
  alignment: Alignment;
  comment: string;
}

export interface StakeholderCheck {
  alignments: StakeholderAlignmentEntry[];
  notes: string;
}

// --- Milestones (Step 5, Tier 2-3) ---

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  action: string;
  message: string;
  feedbackSignal: string;
}

// --- Gates (Step 6) ---

export interface GateStatus {
  gate1_strategicClarity: Status;
  gate1_notes: string;
  gate2_ownershipPower: Status;
  gate2_notes: string;
  gate3_riskReadiness: Status;
  gate3_notes: string;
}

// --- Root plan model ---

export interface ChangePlan {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  overallStatus: Status;
  people: PeopleRoles;
  tiering: TieringAnswers;
  tierLevel: 'low' | 'medium' | 'high' | '';
  timePressure: 'low' | 'moderate' | 'high' | 'other' | '';
  timePressureOther: string;
  components: ComponentAssessment;
  stakeholderCheck: StakeholderCheck;
  milestones: Milestone[];
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
    people: {
      owner: { name: '', role: '', notes: '' },
      hrPartner: { name: '', role: '', notes: '' },
      sponsor: { name: '', role: '', notes: '' },
      stakeholders: [],
    },
    tiering: {
      impactScope: '',
      impactScopeOther: '',
      roleChanges: null,
      identityStatusChange: null,
      reversible: null,
      moraleImpact: null,
      ongoingOrOneTime: '',
      ongoingOrOneTimeOther: '',
      crossTeamDependencies: null,
      legalChallenges: null,
      localOrGlobal: '',
      localOrGlobalOther: '',
    },
    tierLevel: '',
    timePressure: '',
    timePressureOther: '',
    components: {
      vision: { notes: '', status: 'draft', confidenceReason: '' },
      skills: { notes: '', status: 'draft', confidenceReason: '' },
      incentives: { notes: '', status: 'draft', confidenceReason: '' },
      resources: { notes: '', status: 'draft', confidenceReason: '' },
      plan: { notes: '', status: 'draft', confidenceReason: '' },
    },
    stakeholderCheck: {
      alignments: [],
      notes: '',
    },
    milestones: [],
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
