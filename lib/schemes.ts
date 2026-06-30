// Resolving a chronology scheme over an edition. The edition's authored dates are
// the baseline; an alternate scheme (Campbell, Lüdemann…) supplies only the deltas.
// We fold those deltas into a derived Edition the renderer can draw without knowing
// anything about schemes — the same spans/events, re-dated and re-glossed.

import type { Edition, ChronoScheme, Span, Anno, SchemeDelta } from "./types";

function applySpan(s: Span, d: SchemeDelta | undefined, scheme: ChronoScheme): Span {
  if (!d) return s;
  return {
    ...s,
    start: d.start ?? s.start,
    end: d.end ?? s.end,
    approx: d.approx ?? s.approx,
    schemeAside: d.aside,
    schemeName: d.aside ? scheme.name : undefined,
  };
}

function applyEvent(e: Anno, d: SchemeDelta | undefined, scheme: ChronoScheme): Anno {
  if (!d) return e;
  return {
    ...e,
    year: d.year ?? e.year,
    approx: d.approx ?? e.approx,
    schemeAside: d.aside,
    schemeName: d.aside ? scheme.name : undefined,
  };
}

// Derive the edition AS THIS SCHEME would date it. Items the scheme drops are
// removed; everything else carries its (possibly re-dated) values forward.
export function resolveEdition(edition: Edition, scheme: ChronoScheme): Edition {
  const sd = scheme.spans ?? {};
  const ed = scheme.events ?? {};
  return {
    ...edition,
    range: scheme.range ?? edition.range,
    spans: edition.spans.filter((s) => !sd[s.id]?.drop).map((s) => applySpan(s, sd[s.id], scheme)),
    events: edition.events.filter((e) => !ed[e.id]?.drop).map((e) => applyEvent(e, ed[e.id], scheme)),
  };
}
