interface ExecuteModeProps {
  onBack: () => void;
}

export function ExecuteMode({ onBack }: ExecuteModeProps) {
  return (
    <div className="page execute-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={onBack}>&larr; Back</button>
        <h1>Execute Mode</h1>
      </header>
      <div className="placeholder-content">
        <p>
          This is where you'll track the execution of your change plans.
          Monitor progress, update stakeholders, and manage risks as they unfold.
        </p>
        <p className="placeholder-note">
          Execute Mode is under development. For now, focus on building a solid plan —
          that's where most changes succeed or fail.
        </p>
      </div>
    </div>
  );
}
