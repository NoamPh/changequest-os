import type { Status } from '../types';

const statusLabels: Record<Status, string> = {
  draft: 'Draft',
  'good-enough': 'Good enough',
  strong: 'Strong',
  'needs-attention': 'Needs attention',
  red: 'Red',
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${status}`} role="status">
      {statusLabels[status]}
    </span>
  );
}
