import type { ChangePlan, PeopleRoles, PeopleRolesStakeholder } from '../types';

interface Step0Props {
  plan: ChangePlan;
  onChange: (updates: Partial<ChangePlan>) => void;
}

export function Step0PeopleRoles({ plan, onChange }: Step0Props) {
  const pr = plan.peopleRoles;

  const update = (fields: Partial<PeopleRoles>) => {
    onChange({ peopleRoles: { ...pr, ...fields } });
  };

  const updateStakeholder = (
    index: number,
    field: keyof PeopleRolesStakeholder,
    value: string | boolean
  ) => {
    const list = pr.stakeholders.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    update({ stakeholders: list });
  };

  const addStakeholder = () => {
    update({
      stakeholders: [...pr.stakeholders, { name: '', role: '', mustAlign: false }],
    });
  };

  const removeStakeholder = (index: number) => {
    update({ stakeholders: pr.stakeholders.filter((_, i) => i !== index) });
  };

  return (
    <div className="step-content">
      <h2>People & Roles</h2>
      <p className="step-intro">
        Every change needs clear ownership. Identify who is driving, sponsoring,
        and supporting this change before anything else.
      </p>

      <div className="field">
        <label htmlFor="pr-owner">Change Owner</label>
        <input
          id="pr-owner"
          type="text"
          value={pr.changeOwner}
          onChange={(e) => update({ changeOwner: e.target.value })}
          placeholder="The person accountable for driving this change"
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="pr-hr">HR Partner</label>
        <input
          id="pr-hr"
          type="text"
          value={pr.hrPartner}
          onChange={(e) => update({ hrPartner: e.target.value })}
          placeholder="HR professional supporting this change"
        />
      </div>

      <div className="field">
        <label htmlFor="pr-sponsor">Sponsor (optional)</label>
        <input
          id="pr-sponsor"
          type="text"
          value={pr.sponsor}
          onChange={(e) => update({ sponsor: e.target.value })}
          placeholder="Senior leader championing this change"
        />
      </div>

      <div className="stakeholders-section">
        <h3>Stakeholders</h3>
        <p className="step-intro" style={{ marginTop: '0.25rem' }}>
          List the key people who need to be involved or aligned.
        </p>

        <div className="stakeholders-list">
          {pr.stakeholders.map((s, i) => (
            <div key={i} className="stakeholder-card">
              <div className="stakeholder-fields">
                <div className="field">
                  <label htmlFor={`sh-name-${i}`}>Name</label>
                  <input
                    id={`sh-name-${i}`}
                    type="text"
                    value={s.name}
                    onChange={(e) => updateStakeholder(i, 'name', e.target.value)}
                    placeholder="Stakeholder name"
                  />
                </div>
                <div className="field">
                  <label htmlFor={`sh-role-${i}`}>Role</label>
                  <input
                    id={`sh-role-${i}`}
                    type="text"
                    value={s.role}
                    onChange={(e) => updateStakeholder(i, 'role', e.target.value)}
                    placeholder="Their role"
                  />
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label className="must-align-row">
                    <input
                      type="checkbox"
                      checked={s.mustAlign}
                      onChange={(e) => updateStakeholder(i, 'mustAlign', e.target.checked)}
                    />
                    <span>Must-align</span>
                  </label>
                  <span className="field-hint">
                    This person's buy-in is required before proceeding.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginTop: '0.5rem' }}
                onClick={() => removeStakeholder(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 'var(--space-md)' }}
          onClick={addStakeholder}
        >
          + Add stakeholder
        </button>
      </div>
    </div>
  );
}
