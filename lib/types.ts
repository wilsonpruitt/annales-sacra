// Annales Sacra — the chronological lens, generalized across editions. Scripture's
// narrative order is not its order in time; this lens lays the years flat. The
// same shape serves a regnal chronicle (kings in two kingdoms), a life (Paul, from
// Acts and the letters), or any braided span of sacred time.
//
// Time is a single signed axis: a NEGATIVE year is B.C., a POSITIVE year is A.D.
// (there is no year 0). Earlier = smaller number = further left. See lib/scale.ts.

export type Verdict = "right" | "evil" | "mixed";
// The Deuteronomistic appraisal, for regnal editions — "he did what was right /
// evil in the eyes of the LORD." "mixed" = right, but the high places remained.

export type Lane = {
  id: string;
  name: string; // "Israel — the North" · "The journeys (Acts)"
  ink: string; // lane accent (hex)
  sub?: string; // small header gloss — a capital, a source description
  note?: string; // one-line lane note
};

export type Span = {
  id: string;
  lane: string; // Lane.id
  label: string; // the block's title — a ruler, a journey, a letter
  group?: string; // dynasty / source-strand / section the span belongs to
  start: number; // signed year
  end: number; // signed year (equal to start for a point-span)
  length?: string; // duration AS THE SOURCE GIVES IT, free text ("22 years", "c. 18 months")
  ref: string; // primary reference
  refLabel?: string; // overrides the edition's default dossier label for `ref`
  detail?: string; // secondary reference / narrative passage
  detailLabel?: string; // overrides the edition's default label for `detail`
  aside?: string; // a cross-track tie — a synchronism, "written from Corinth"
  asideLabel?: string; // overrides the edition's default label for `aside`
  verdict?: Verdict; // regnal editions only; omitted elsewhere
  approx?: boolean; // dotted edge — the span's dates are uncertain or contested
  note?: string; // the span in a sentence
  // Injected at resolve-time when a non-default chronology scheme is active — never authored on the span itself. See lib/schemes.ts.
  schemeAside?: string;
  schemeName?: string;
};

export type EventKind =
  | "schism"
  | "battle"
  | "prophet"
  | "fall"
  | "temple"
  | "covenant"
  | "invasion"
  | "birth"
  | "mission"
  | "letter"
  | "trial"
  | "death"
  | "other";

export type Anno = {
  id: string;
  year: number; // signed year it lands on the spine
  lane?: string; // Lane.id if it belongs to one track; omit if it spans both
  label: string;
  ref: string;
  kind?: EventKind;
  approx?: boolean; // renders a "c." — the date is not firmly fixed
  note?: string;
  // Injected at resolve-time under a non-default scheme. See lib/schemes.ts.
  schemeAside?: string;
  schemeName?: string;
};

// A competing scholarly reconstruction layered over the base edition. The base
// edition's own dates ARE the default scheme (id "consensus" by convention);
// every alternate supplies only the DELTAS — the items it re-dates, re-flags,
// or drops — plus its anchor and the reasoning that moves it. Editions without
// a live scholarly debate over their chronology simply omit `schemes`.
export type SchemeDelta = {
  start?: number; // span: re-dated start (signed year)
  end?: number; // span: re-dated end
  year?: number; // event: re-dated point year
  approx?: boolean; // force (true) or clear (false) the uncertain-edge flag under this scheme
  aside?: string; // a scheme-specific gloss shown in the dossier ("Campbell reorders this after…")
  drop?: boolean; // this scheme omits the item entirely (it doesn't fit the frame)
};

export type ChronoScheme = {
  id: string; // "consensus" | "campbell" | "ludemann"
  name: string; // "Acts-based consensus" — full name for the dossier
  short: string; // toggle-button label
  anchor: string; // the fixed point it counts from — "Gallio's proconsulship, Corinth · c. A.D. 51"
  note: string; // a sentence or two: how this reconstruction works and where it most departs
  range?: [number, number]; // optional axis override when the scheme stretches/compresses the years
  spans?: Record<string, SchemeDelta>; // keyed by Span.id
  events?: Record<string, SchemeDelta>; // keyed by Anno.id
};

export type Edition = {
  slug: string;
  name: string;
  subtitle?: string;
  blurb?: string; // landing-card / header gloss
  source: string; // "1–2 Kings · 2 Chronicles" · "Acts · the Pauline letters"
  translation: string;
  range: [number, number]; // signed [earliest, latest]
  lanes: Lane[];
  spans: Span[];
  events: Anno[];
  indexTitle?: string; // heading for the readable index (default "The index")
  // Default dossier field labels for this edition's spans (per-span overrides win).
  spanLabels?: { ref?: string; detail?: string; aside?: string };
  howToRead?: string;
  seedNote?: string; // honest scope / method note
  // Competing reconstructions a reader can toggle between. When present, the FIRST
  // scheme is the default and should match the edition's own authored dates.
  schemes?: ChronoScheme[];
};
