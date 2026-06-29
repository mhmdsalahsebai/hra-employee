/**
 * Welcome hero — a calm, luminous "breathing orb" with a gentle vital pulse.
 * Abstract wellbeing: a glowing sphere (mind), concentric calm ripples, a soft
 * heartbeat line (body), and a few floating wellness signals. Pure SVG.
 */
export function WellbeingOrb({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orb-halo" cx="0.5" cy="0.46" r="0.55">
          <stop offset="0" stopColor="#6f8dff" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#7c6cf0" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7c6cf0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb-body" cx="0.42" cy="0.36" r="0.75">
          <stop offset="0" stopColor="#bcd0ff" />
          <stop offset="0.42" stopColor="#6f8dff" />
          <stop offset="0.78" stopColor="#7a63e8" />
          <stop offset="1" stopColor="#5b3fb8" />
        </radialGradient>
        <linearGradient id="orb-pulse" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7ef0d0" stopOpacity="0" />
          <stop offset="0.3" stopColor="#7ef0d0" />
          <stop offset="0.7" stopColor="#aef" />
          <stop offset="1" stopColor="#aef" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="160" cy="150" r="150" fill="url(#orb-halo)" />

      {/* concentric calm ripples */}
      <circle cx="160" cy="150" r="118" stroke="#8aa0ff" strokeWidth="1" opacity="0.16" />
      <circle cx="160" cy="150" r="96" stroke="#9d8cff" strokeWidth="1" opacity="0.22" />

      {/* the orb */}
      <circle cx="160" cy="150" r="74" fill="url(#orb-body)" />
      {/* soft sheen */}
      <ellipse cx="138" cy="126" rx="30" ry="20" fill="#ffffff" opacity="0.30" />
      <circle cx="160" cy="150" r="74" stroke="#ffffff" strokeWidth="1" opacity="0.22" />

      {/* calm vital pulse crossing the orb */}
      <path
        d="M96 152h26l9-19 13 38 11-26 8 13h42"
        stroke="url(#orb-pulse)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* floating wellness signals */}
      <circle cx="248" cy="96" r="6" fill="#7ef0d0" opacity="0.9" />
      <circle cx="74" cy="120" r="4.5" fill="#ffd27a" opacity="0.85" />
      <circle cx="238" cy="206" r="4" fill="#f48fa0" opacity="0.8" />
      <circle cx="92" cy="214" r="3.5" fill="#8aa0ff" opacity="0.75" />
    </svg>
  );
}
