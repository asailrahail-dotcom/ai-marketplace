/* Line icons for the four partner models. Every stroke uses pathLength=1 so
   GSAP can "draw" it by animating stroke-dashoffset from 1 to 0. */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** B2B — company to company */
export function IconB2B({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path pathLength={1} className="rh-draw" d="M5 42V18h12v24M31 42V10h12v32M3 42h42" />
      <path pathLength={1} className="rh-draw" d="M9 23h4M9 29h4M9 35h4M35 15h4M35 21h4M35 27h4M35 33h4" />
      <path pathLength={1} className="rh-draw" d="M19 24h9m-3-3 3 3-3 3" />
    </svg>
  );
}

/** B2C — company directly to the customer */
export function IconB2C({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path pathLength={1} className="rh-draw" d="M4 42V14h14v28M2 42h20" />
      <path pathLength={1} className="rh-draw" d="M8 20h6M8 26h6M8 32h6" />
      <path pathLength={1} className="rh-draw" d="M36 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM27 42c0-6 4-11 9-11s9 5 9 11" />
      <path pathLength={1} className="rh-draw" d="M20 26h5m-2-2.5 2.5 2.5-2.5 2.5" />
    </svg>
  );
}

/** B2B2C — through intermediaries to the customer */
export function IconB2B2C({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path pathLength={1} className="rh-draw" d="M3 30V18h10v12ZM19 30V18h10v12Z" />
      <path pathLength={1} className="rh-draw" d="M41 21a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM35 32c0-4.5 2.7-8 6-8s6 3.5 6 8" />
      <path pathLength={1} className="rh-draw" d="M13 24h6M29 24h5" />
      <path pathLength={1} className="rh-draw" d="M8 36c5 6 27 6 33 0" />
    </svg>
  );
}

/** Affiliate — commission per booking */
export function IconAffiliate({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path pathLength={1} className="rh-draw" d="M24 44a20 20 0 1 0 0-40 20 20 0 0 0 0 40Z" />
      <path pathLength={1} className="rh-draw" d="M31 17 17 31" />
      <path pathLength={1} className="rh-draw" d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM30 33a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  );
}

export function ArrowIcon({ className, dir = 'down' }: IconProps & { dir?: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={className} aria-hidden>
      {dir === 'down' ? <path d="M12 4v16m-6-6 6 6 6-6" /> : <path d="M12 20V4M6 10l6-6 6 6" />}
    </svg>
  );
}
