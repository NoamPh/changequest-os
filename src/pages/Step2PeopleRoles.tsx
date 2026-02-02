import type { ChangePlan, PeopleRoles, PlanStakeholder } from '../types';
import { Tooltip } from '../components/Tooltip';

interface Step2Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

type RoleKey = 'owner' | 'hrPartner' | 'sponsor';

const roleMeta: { key: RoleKey; label: string; tooltipTerm: string; description: string; optional?: boolean }[] = [
  {
    key: 'owner',
    label: 'Change Owner',
    tooltipTerm: 'Owner',
    description: 'The manager driving this change day-to-day. One name, one point of accountability.',
  },
  {
    key: 'hrPartner',
    label: 'HR Partner',
    tooltipTerm: 'HR Partner',
    description: 'The HR professional advising on people impact, communication, and compliance.',
  },
  {
    key: 'sponsor',
    label: 'Sponsor',
    tooltipTerm: 'Project Sponsor',
    description: 'A senior leader who champions this change from above. Optional at this stage — you can add one later.',
    optional: true,
  },
];

export function Step2PeopleRoles({ plan, onChange }: Step2Props) {
  const updateRole = (key: RoleKey, field: 'name' | 'role' | 'notes', value: string) => {
    const newPeople: PeopleRoles = {
      ...plan.people,
      [key]: { ...plan.people[key], [field]: value },
    };
    onChange({ people: newPeople });
  };

  const addStakeholder = () => {
    const newStakeholder: PlanStakeholder = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      mustAlign: false,
    };
    onChange({
      people: {
        ...plan.people,
        stakeholders: [...plan.people.stakeholders, newStakeholder],
      },
    });
  };

  const updateStakeholder = (id: string, field: keyof PlanStakeholder, value: string | boolean) => {
    onChange({
      people: {
        ...plan.people,
        stakeholders: plan.people.stakeholders.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      },
    });
  };

  const removeStakeholder = (id: string) => {
    onChange({
      people: {
        ...plan.people,
        stakeholders: plan.people.stakeholders.filter((s) => s.id !== id),
      },
    });
  };

  return (
    <div className="step-content">
      <h2>People & Roles</h2>
      <p className="step-intro">
        Before scoping the change, name the people involved.
        Clarity on who's driving, sponsoring, and advising prevents confusion later.
      </p>

      <div className="roles-list">
        {roleMeta.map((r) => (
          <div key={r.key} className="role-card">
            <div className="role-header">
              <h3>
                <Tooltip term={r.tooltipTerm}>{r.label}</Tooltip>
              </h3>
              {r.optional && <span className="optional-tag">Optional</span>}
            </div>
            <p className="role-desc">{r.description}</p>
            <div className="role-fields">
              <div className="field">
                <label htmlFor={`${r.key}-name`}>Name</label>
                <input
                  id={`${r.key}-name`}
                  type="text"
                  value={plan.people[r.key].name}
                  onChange={(e) => updateRole(r.key, 'name', e.target.value)}
                  placeholder="Who is this person?"
                />
              </div>
              <div className="field">
                <label htmlFor={`${r.key}-role`}>Role / Title</label>
                <input
                  id={`${r.key}-role`}
                  type="text"
                  value={plan.people[r.key].role}
                  onChange={(e) => updateRole(r.key, 'role', e.target.value)}
                  placeholder="Their role in the organization"
                />
              </div>
              <div className="field">
                <label htmlFor={`${r.key}-notes`}>Notes</label>
                <textarea
                  id={`${r.key}-notes`}
                  value={plan.people[r.key].notes}
                  onChange={(e) => updateRole(r.key, 'notes', e.target.value)}
                  placeholder="Availability, concerns, authority level..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="stakeholders-section">
        <h2>Stakeholders</h2>
        <p className="step-intro">
          Who else needs to be involved or aligned?
          Mark anyone whose buy-in is critical as{' '}
          <Tooltip term="Must-Align">"must-align"</Tooltip>.
        </p>

        {plan.people.stakeholders.length === 0 && (
          <p className="empty-inline">
            No stakeholders added yet. You can add them now or come back later.
          </p>
        )}

        <div className="stakeholder-entries">
          {plan.people.stakeholders.map((s) => (
            <div key={s.id} className="stakeholder-entry">
              <div className="stakeholder-entry-fields">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateStakeholder(s.id, 'name', e.target.value)}
                  placeholder="Name"
                  className="stakeholder-input-name"
                />
                <input
                  type="text"
                  value={s.role}
                  onChange={(e) => updateStakeholder(s.id, 'role', e.target.value)}
                  placeholder="Role"
                  className="stakeholder-input-role"
                />
                <label className="must-align-toggle">
                  <input
                    type="checkbox"
                    checked={s.mustAlign}
                    onChange={(e) => updateStakeholder(s.id, 'mustAlign', e.target.checked)}
                  />
                  <span>Must-align</span>
                </label>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeStakeholder(s.id)}
                  aria-label={`Remove ${s.name || 'stakeholder'}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-secondary" onClick={addStakeholder}>
          + Add stakeholder
        </button>
      </section>
    </div>
  );
}
