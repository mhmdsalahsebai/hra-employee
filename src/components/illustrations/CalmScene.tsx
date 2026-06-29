/** Onboarding motif — concentric ripples rising from a single coral droplet,
 *  echoing the cura mark. Calm, abstract, premium. Pure SVG, no assets. */
export function CalmScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cura-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef9486" />
          <stop offset="1" stopColor="#d4574a" />
        </linearGradient>
        <radialGradient id="cura-glow" cx="0.5" cy="0.46" r="0.55">
          <stop offset="0" stopColor="#cfeaf4" />
          <stop offset="1" stopColor="#cfeaf4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cura-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3d8ec" />
          <stop offset="1" stopColor="#6dbedd" />
        </linearGradient>
      </defs>

      {/* soft halo */}
      <circle cx="160" cy="142" r="138" fill="url(#cura-glow)" />

      {/* concentric ripples */}
      <circle cx="160" cy="150" r="120" stroke="#6dbedd" strokeWidth="1.5" opacity="0.18" />
      <circle cx="160" cy="150" r="92" stroke="#3fa1cb" strokeWidth="1.5" opacity="0.28" />
      <circle cx="160" cy="150" r="64" stroke="#2184ad" strokeWidth="2" opacity="0.42" />

      {/* grounding horizon */}
      <path
        d="M22 232c30-26 70-30 110-16s78 16 110-4c20-12 38-10 56 2v86H22Z"
        fill="url(#cura-hill)"
        opacity="0.9"
      />
      <path
        d="M0 256c44-18 86-14 128 2s86 14 130-6c22-10 42-8 62 4v44H0Z"
        fill="#176b91"
        opacity="0.85"
      />

      {/* the droplet — the cura mark */}
      <path
        d="M160 78c30 38 44 64 44 86a44 44 0 1 1-88 0c0-22 14-48 44-86Z"
        fill="url(#cura-drop)"
      />
      {/* highlight on the droplet */}
      <path
        d="M150 150c-6 8-7 18-2 27"
        stroke="#fbdcd7"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* floating accents */}
      <circle cx="250" cy="92" r="6" fill="#e5705e" opacity="0.85" />
      <circle cx="74" cy="110" r="5" fill="#2184ad" opacity="0.6" />
      <circle cx="236" cy="176" r="4" fill="#176b91" opacity="0.55" />
    </svg>
  );
}
