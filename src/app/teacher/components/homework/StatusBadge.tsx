interface StatusBadgeProps {
  status: 'assigned' | 'pending';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isAssigned = status === 'assigned';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isAssigned
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700'
      }`}
    >
      {isAssigned ? 'Assigned' : 'Pending'}
    </span>
  );
}
