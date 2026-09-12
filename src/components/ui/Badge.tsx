export function VerifiedBadge() {
  return (
    <span className="badge badge-verified">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      موثّق
    </span>
  );
}

export function RatingBadge({ average, count }: { average: number; count: number }) {
  if (!count) return null;
  return (
    <span className="badge badge-muted">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {average.toFixed(1)} ({count})
    </span>
  );
}

export function EmptyBadge({ children }: { children: React.ReactNode }) {
  return <span className="badge badge-muted">{children}</span>;
}
