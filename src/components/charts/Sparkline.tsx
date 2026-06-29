import type { HistoryPoint } from "../../data/report";

/** Small line chart of past wellbeing scores. Soft area fill, a muted line, and
 *  an emphasized final point — the "you're trending up" cue. Labels are rendered
 *  by the caller beneath, aligned to the evenly-spaced points. */
export function Sparkline({
  data,
  width = 300,
  height = 96,
}: {
  data: HistoryPoint[];
  width?: number;
  height?: number;
}) {
  const padX = 14;
  const padY = 16;
  const scores = data.map((d) => d.score);
  const min = Math.min(...scores) - 6;
  const max = Math.max(...scores) + 6;

  const x = (i: number) => padX + (i / (data.length - 1)) * (width - padX * 2);
  const y = (s: number) => padY + (1 - (s - min) / (max - min)) * (height - padY * 2);

  const line = data.map((d, i) => `${x(i)},${y(d.score)}`).join(" ");
  const area = `${x(0)},${height - padY} ${line} ${x(data.length - 1)},${height - padY}`;
  const last = data.length - 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="مسار الرفاهية">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-brand-400)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--color-brand-400)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon points={area} fill="url(#spark-fill)" />
      <polyline
        points={line}
        fill="none"
        stroke="var(--color-brand-500)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((d, i) => {
        const isLast = i === last;
        return (
          <g key={d.label}>
            {isLast && <circle cx={x(i)} cy={y(d.score)} r={7} fill="var(--color-brand-500)" opacity={0.16} />}
            <circle
              cx={x(i)}
              cy={y(d.score)}
              r={isLast ? 4.5 : 3}
              fill={isLast ? "var(--color-brand-600)" : "var(--color-surface)"}
              stroke="var(--color-brand-500)"
              strokeWidth={isLast ? 0 : 2}
            />
          </g>
        );
      })}
    </svg>
  );
}
