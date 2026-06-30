// Time → space, on a single signed axis. Pure module (no data imports) so client
// components can map years to positions without pulling the corpus into the bundle.
//
// A year is a SIGNED integer: negative = B.C., positive = A.D. (there is no year
// 0). Earlier years are smaller numbers and sit further LEFT.

export function frac(year: number, range: [number, number]): number {
  const [min, max] = range; // min = earliest (smallest), max = latest
  if (max === min) return 0;
  const f = (year - min) / (max - min);
  return Math.min(1, Math.max(0, f));
}

export function leftPct(year: number, range: [number, number]): string {
  return `${(frac(year, range) * 100).toFixed(3)}%`;
}

// Width of a span as a percent of the track, with a floor so a point-span (a
// three-month reign, a single-sitting letter) is still clickable, not a hairline.
export function spanPct(
  start: number,
  end: number,
  range: [number, number],
  minPct = 1.2,
): string {
  const w = (frac(end, range) - frac(start, range)) * 100;
  return `${Math.max(minPct, w).toFixed(3)}%`;
}

// "931 B.C." / "A.D. 57". approx prepends "c.".
export function yearLabel(year: number, approx = false): string {
  const c = approx ? "c. " : "";
  return year < 0 ? `${c}${-year} B.C.` : `${c}A.D. ${year}`;
}

// A span's years, read compactly: "931–910 B.C." · "A.D. 46–48" · "A.D. 57".
export function spanYears(start: number, end: number, approx = false): string {
  const c = approx ? "c. " : "";
  if (start === end) return yearLabel(start, approx);
  if (start < 0 && end < 0) return `${c}${-start}–${-end} B.C.`;
  if (start > 0 && end > 0) return `${c}A.D. ${start}–${end}`;
  return `${yearLabel(start, approx)} – ${yearLabel(end)}`;
}

// A "nice" gridline step for the axis given the range it must cover: centuries for
// the monarchy, decades for a life, half-decades for a tight span.
export function gridStep(range: [number, number]): number {
  const span = Math.abs(range[1] - range[0]);
  if (span > 200) return 100;
  if (span > 80) return 25;
  if (span > 30) return 10;
  return 5;
}

// The gridline years that fall inside the range, snapped to the step.
export function gridLines(range: [number, number]): number[] {
  const [min, max] = range;
  const step = gridStep(range);
  const first = Math.ceil(min / step) * step;
  const out: number[] = [];
  for (let y = first; y <= max; y += step) {
    if (y !== 0) out.push(y); // skip the non-existent year zero
  }
  return out;
}
