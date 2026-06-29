/**
 * Completion hero — a luminous "wellness overview" orb: a soft score ring blooms
 * around a calm heart, with radiating signals of light. Reassuring, premium,
 * abstract. Pure SVG, no food imagery.
 */
export function WellbeingBloom({ className }: { className?: string }) {
  // A friendly, non-clinical wellbeing reading for the completion moment.
  const score = 78;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bloom-halo" cx="0.5" cy="0.48" r="0.55">
          <stop offset="0" stopColor="#7ef0d0" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#6f8dff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#6f8dff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bloom-core" cx="0.42" cy="0.36" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#cfe0ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6f8dff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bloom-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7ef0d0" />
          <stop offset="0.5" stopColor="#6f8dff" />
          <stop offset="1" stopColor="#9d8cff" />
        </linearGradient>
        <linearGradient id="bloom-heart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb0bd" />
          <stop offset="1" stopColor="#f4675f" />
        </linearGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="160" cy="156" r="150" fill="url(#bloom-halo)" />

      {/* radiating signals of light */}
      <g stroke="#9fb4ff" strokeWidth="2.4" strokeLinecap="round" opacity="0.5">
        <path d="M160 54v-18" />
        <path d="M232 84l13-13" />
        <path d="M262 156h18" />
        <path d="M88 84 75 71" />
        <path d="M58 156H40" />
        <path d="M214 226l11 11" />
        <path d="M106 226l-11 11" />
      </g>

      {/* score ring track + value arc */}
      <circle cx="160" cy="156" r={r} stroke="#2a3050" strokeWidth="10" opacity="0.6" />
      <circle
        cx="160"
        cy="156"
        r={r}
        stroke="url(#bloom-ring)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 160 156)"
      />

      {/* inner glow */}
      <circle cx="160" cy="156" r="56" fill="url(#bloom-core)" />

      {/* calm heart at the centre */}
      <path
        d="M160 186c-26-16-40-31-40-49a21 21 0 0 1 40-9 21 21 0 0 1 40 9c0 18-14 33-40 49Z"
        fill="url(#bloom-heart)"
      />
      <path d="M146 132c-5 3-8 8-8 15" stroke="#ffe2e6" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

      {/* floating signals */}
      <circle cx="250" cy="118" r="5" fill="#7ef0d0" opacity="0.9" />
      <circle cx="78" cy="200" r="4" fill="#ffd27a" opacity="0.85" />
    </svg>
  );
}
