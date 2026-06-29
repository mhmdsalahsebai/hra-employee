export interface RadarPoint {
  title: string;
  /** 0–100, high = doing well. */
  score: number;
  /** Vertex colour (status level). */
  color: string;
}

/** Nine-axis wellbeing radar — the assessment collapsed into one shape you read
 *  at a glance. Faint guide rings, one filled data polygon, and a vertex dot per
 *  dimension coloured by its score level (good / moderate / attention). */
export function Radar({ data, size = 300 }: { data: RadarPoint[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.34; // max data radius
  const labelR = R + 30;
  const n = data.length;

  // Start at the top, step clockwise.
  const angleAt = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const point = (i: number, r: number) => {
    const a = angleAt(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const ringPath = (f: number) =>
    data.map((_, i) => point(i, R * f).join(",")).join(" ");

  const dataPath = data.map((d, i) => point(i, R * (d.score / 100)).join(",")).join(" ");

  const pad = 44;

  return (
    <svg
      viewBox={`${-pad} ${-pad / 2} ${size + pad * 2} ${size + pad}`}
      className="w-full"
      role="img"
      aria-label="مخطط أبعاد الرفاهية"
    >
      {/* guide rings */}
      {rings.map((f) => (
        <polygon
          key={f}
          points={ringPath(f)}
          fill="none"
          stroke="var(--color-ink-100)"
          strokeWidth={1}
        />
      ))}

      {/* axes */}
      {data.map((_, i) => {
        const [x, y] = point(i, R);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-ink-100)" strokeWidth={1} />
        );
      })}

      {/* data polygon */}
      <polygon
        points={dataPath}
        fill="var(--color-brand-soft)"
        stroke="var(--color-brand-500)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* vertices, coloured by score level */}
      {data.map((d, i) => {
        const [x, y] = point(i, R * (d.score / 100));
        return <circle key={d.title} cx={x} cy={y} r={4} fill={d.color} />;
      })}

      {/* labels */}
      {data.map((d, i) => {
        const [x, y] = point(i, labelR);
        const anchor = x < cx - 6 ? "end" : x > cx + 6 ? "start" : "middle";
        return (
          <text
            key={d.title}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-ink-500 font-sans text-[11px] font-bold"
          >
            {d.title}
          </text>
        );
      })}
    </svg>
  );
}
