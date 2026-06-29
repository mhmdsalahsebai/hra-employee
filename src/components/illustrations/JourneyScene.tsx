/** Hero motif for the in-progress / fresh wellbeing journey — a calm seated
 *  figure beneath a rising sun. Flat, undraw-style, tuned for the dark navy
 *  Spotlight hero (light fills + one coral accent). Pure SVG, no assets. */
export function JourneyScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="js-glow" cx="0.5" cy="0.42" r="0.55">
          <stop offset="0" stopColor="#bfe6f1" stopOpacity="0.55" />
          <stop offset="1" stopColor="#bfe6f1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="js-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f4f9" />
          <stop offset="1" stopColor="#cfeaf4" />
        </linearGradient>
      </defs>

      {/* soft halo */}
      <circle cx="100" cy="74" r="74" fill="url(#js-glow)" />

      {/* sun + rays */}
      <circle cx="100" cy="62" r="20" fill="#bfe6f1" />
      <g stroke="#9fd6e6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
        <path d="M100 26v-9" />
        <path d="M132 38l6-6" />
        <path d="M68 38l-6-6" />
        <path d="M142 62h9" />
        <path d="M49 62h-9" />
      </g>

      {/* horizon arc */}
      <path d="M14 132q86 -40 172 0" stroke="#3fa1cb" strokeWidth="2" opacity="0.35" />

      {/* seated figure */}
      {/* crossed legs */}
      <ellipse cx="100" cy="150" rx="40" ry="12" fill="#e5705e" />
      {/* torso */}
      <path d="M88 146q-4 -34 6 -46q6 -7 12 0q10 12 6 46q-12 6 -24 0Z" fill="url(#js-body)" />
      {/* arms resting on knees */}
      <path
        d="M92 116q-18 8 -28 30M108 116q18 8 28 30"
        stroke="#cfeaf4"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* head */}
      <circle cx="100" cy="104" r="13" fill="#e9f4f9" />

      {/* floating accents */}
      <circle cx="160" cy="44" r="4" fill="#e5705e" opacity="0.8" />
      <circle cx="44" cy="96" r="3.5" fill="#7cc7d5" opacity="0.7" />
      <circle cx="150" cy="110" r="3" fill="#bfe6f1" opacity="0.7" />
    </svg>
  );
}
