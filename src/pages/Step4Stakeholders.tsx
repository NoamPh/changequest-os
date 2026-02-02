import type { ChangePlan, StakeholderData, Stakeholder } from '../types';
import { Tooltip } from '../components/Tooltip';

interface Step4Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

const stakeholderMeta: {
  key: keyof StakeholderData;
  label: string;
  tooltipTerm: string;
  description: string;
}[] = [
  {
    key: 'owner',
    label: 'Owner',
    tooltipTerm: 'Owner',
    description:
      'One person who drives this change forward day-to-day. Not a committee — a single point of accountability.',
  },
  {
    key: 'sponsor',
    label: 'Project Sponsor',
    tooltipTerm: 'Project Sponsor',
    description:
      'A senior leader who champions this change, removes blockers, and ensures resources are available.',
  },
  {
    key: 'hrPartner',
    label: 'HR Partner',
    tooltipTerm: 'RACI',
    description:
      'The HR professional supporting this change — advising on people impact, communication, and compliance.',
  },
];

export function Step4Stakeholders({ plan, onChange }: Step4Props) {
  const updateStakeholder = (
    key: keyof StakeholderData,
    field: keyof Stakeholder,
    value: string
  ) => {
    const newStakeholders = {
      ...plan.stakeholders,
      [key]: { ...plan.stakeholders[key], [field]: value },
    };
    onChange({ stakeholders: newStakeholders });
  };

  return (
    <div className="step-content">
      <h2>Stakeholders & Power</h2>
      <p className="step-intro">
        Change without clear ownership drifts. Change without sponsorship stalls.
        Name the people — not the roles — who will make this happen.
      </p>

      <div className="stakeholders-list">
        {stakeholderMeta.map((s) => (
          <div key={s.key} className="stakeholder-card">
            <h3>
              <Tooltip term={s.tooltipTerm}>{s.label}</Tooltip>
            </h3>
            <p className="stakeholder-desc">{s.description}</p>

            <div className="stakeholder-fields">
              <div className="field">
                <label htmlFor={`${s.key}-name`}>Name</label>
                <input
                  id={`${s.key}-name`}
                  type="text"
                  value={plan.stakeholders[s.key].name}
                  onChange={(e) => updateStakeholder(s.key, 'name', e.target.value)}
                  placeholder="Who is this person?"
                />
              </div>
              <div className="field">
                <label htmlFor={`${s.key}-role`}>Role / Title</label>
                <input
                  id={`${s.key}-role`}
                  type="text"
                  value={plan.stakeholders[s.key].role}
                  onChange={(e) => updateStakeholder(s.key, 'role', e.target.value)}
                  placeholder="Their role in the organization"
                />
              </div>
              <div className="field">
                <label htmlFor={`${s.key}-notes`}>Notes</label>
                <textarea
                  id={`${s.key}-notes`}
                  value={plan.stakeholders[s.key].notes}
                  onChange={(e) => updateStakeholder(s.key, 'notes', e.target.value)}
                  placeholder="Availability, concerns, authority level..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
