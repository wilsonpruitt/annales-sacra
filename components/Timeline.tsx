"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Edition, Span, Anno, Verdict } from "@/lib/types";
import { leftPct, spanPct, yearLabel, spanYears, gridLines } from "@/lib/scale";
import Reading from "@/components/Reading";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";

const INK = "#2c2418";
const TEXT = "#4a3d30";
const MUTED = "#8a7a6a";
const CARD = "#eee9df";
const BORDER = "#d4c9b5";
const ACCENT = "#4a5a7a";

const VERDICT_META: Record<Verdict, { ink: string; label: string }> = {
  right: { ink: "#3f7a4a", label: "did right" },
  evil: { ink: "#a23f3f", label: "did evil" },
  mixed: { ink: "#b58a3f", label: "right — but the high places remained" },
};

const serif = "'Cormorant Garamond', Georgia, serif";
const body = "'Crimson Pro', Georgia, serif";

type Selection =
  | { kind: "span"; item: Span }
  | { kind: "event"; item: Anno }
  | null;

export default function Timeline({ edition }: { edition: Edition }) {
  const [selected, setSelected] = useState<Selection>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [verdictFilter, setVerdictFilter] = useState<Set<Verdict>>(new Set());

  useEffect(() => {
    if (!document.getElementById("annales-fonts")) {
      const l = document.createElement("link");
      l.id = "annales-fonts";
      l.rel = "stylesheet";
      l.href = FONT_URL;
      document.head.appendChild(l);
    }
  }, []);

  const { range, lanes } = edition;
  const hasVerdicts = useMemo(() => edition.spans.some((s) => s.verdict), [edition]);
  const lines = useMemo(() => gridLines(range), [range]);
  const labels = {
    ref: edition.spanLabels?.ref ?? "Reference",
    detail: edition.spanLabels?.detail ?? "Passage",
    aside: edition.spanLabels?.aside ?? "Note",
  };

  const spansByLane = (laneId: string) => edition.spans.filter((s) => s.lane === laneId);

  const dimmed = (v?: Verdict) =>
    verdictFilter.size > 0 && (!v || !verdictFilter.has(v));

  const toggleVerdict = (v: Verdict) =>
    setVerdictFilter((prev) => {
      const n = new Set(prev);
      n.has(v) ? n.delete(v) : n.add(v);
      return n;
    });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", color: INK, fontFamily: body }}>
      <header style={{ background: INK, color: "#f5f0e8", padding: "40px 24px 34px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Link
            href="/"
            style={{ color: "#b9c2d6", textDecoration: "none", fontSize: 13, letterSpacing: 2, fontFamily: serif }}
          >
            ANNALES SACRA
          </Link>
          <h1 style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, letterSpacing: 6, margin: "10px 0 0" }}>
            {edition.name.toUpperCase()}
          </h1>
          {edition.subtitle && (
            <div style={{ fontFamily: serif, fontStyle: "italic", color: "#b9c2d6", fontSize: 18, marginTop: 4 }}>
              {edition.subtitle} · {edition.source}
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 96px" }}>
        {edition.howToRead && (
          <p style={{ fontSize: 16, lineHeight: 1.7, color: TEXT, maxWidth: 760 }}>{edition.howToRead}</p>
        )}

        {hasVerdicts && (
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "20px 0 8px", alignItems: "center" }}>
            <span style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: MUTED, fontFamily: serif }}>
              The verdict
            </span>
            {(Object.keys(VERDICT_META) as Verdict[]).map((v) => {
              const on = verdictFilter.has(v);
              return (
                <button
                  key={v}
                  onClick={() => toggleVerdict(v)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontFamily: body,
                    fontSize: 14,
                    color: verdictFilter.size === 0 || on ? TEXT : "#b8ab98",
                    opacity: verdictFilter.size === 0 || on ? 1 : 0.6,
                  }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 2,
                      background: VERDICT_META[v].ink,
                      boxShadow: on ? `0 0 0 2px #f5f0e8, 0 0 0 3px ${VERDICT_META[v].ink}` : "none",
                    }}
                  />
                  {VERDICT_META[v].label}
                </button>
              );
            })}
          </div>
        )}

        {/* ---- The timeline ---- */}
        <section style={{ position: "relative", marginTop: 18 }}>
          <div style={{ position: "relative", height: 22 }}>
            {lines.map((y) => (
              <div
                key={y}
                style={{
                  position: "absolute",
                  left: leftPct(y, range),
                  transform: "translateX(-50%)",
                  fontSize: 12,
                  color: MUTED,
                  fontFamily: serif,
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {yearLabel(y)}
              </div>
            ))}
          </div>

          <TimelineGrid lines={lines} range={range} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {lanes.map((lane, i) => (
              <div key={lane.id}>
                <LaneTrack
                  lane={lane}
                  spans={spansByLane(lane.id)}
                  range={range}
                  selected={selected}
                  hoverId={hoverId}
                  dimmed={dimmed}
                  onHover={setHoverId}
                  onSelect={(item) => setSelected({ kind: "span", item })}
                />
                {/* event spine sits between the two lanes */}
                {i === 0 && (
                  <EventSpine
                    events={edition.events}
                    range={range}
                    selected={selected}
                    hoverId={hoverId}
                    onHover={setHoverId}
                    onSelect={(item) => setSelected({ kind: "event", item })}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <Dossier selection={selected} labels={labels} onClose={() => setSelected(null)} />

        {edition.seedNote && (
          <p
            style={{
              marginTop: 40,
              padding: "14px 18px",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${ACCENT}`,
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1.6,
              color: TEXT,
              maxWidth: 760,
            }}
          >
            <strong style={{ fontFamily: serif, letterSpacing: 1 }}>A note on this edition.</strong>{" "}
            {edition.seedNote}
          </p>
        )}

        <SpanIndex edition={edition} selected={selected} onSelect={(item) => setSelected({ kind: "span", item })} />

        <p style={{ marginTop: 44, fontSize: 12, color: MUTED, textAlign: "center", letterSpacing: 1 }}>
          {edition.translation} · Public Domain · Wroot Press
        </p>
      </main>
    </div>
  );
}

/* ---------- pieces ---------- */

function TimelineGrid({ lines, range }: { lines: number[]; range: [number, number] }) {
  return (
    <div style={{ position: "absolute", inset: "22px 0 0", zIndex: 0, pointerEvents: "none" }}>
      {lines.map((y) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: leftPct(y, range),
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(74,90,122,0.16)",
          }}
        />
      ))}
    </div>
  );
}

function LaneTrack({
  lane,
  spans,
  range,
  selected,
  hoverId,
  dimmed,
  onHover,
  onSelect,
}: {
  lane: Edition["lanes"][number];
  spans: Span[];
  range: [number, number];
  selected: Selection;
  hoverId: string | null;
  dimmed: (v?: Verdict) => boolean;
  onHover: (id: string | null) => void;
  onSelect: (s: Span) => void;
}) {
  return (
    <div style={{ margin: "6px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: lane.ink, letterSpacing: 1 }}>
          {lane.name}
        </span>
        {lane.note && <span style={{ fontSize: 12.5, color: MUTED }}>{lane.note}</span>}
      </div>
      <div
        style={{
          position: "relative",
          height: 56,
          background: "rgba(0,0,0,0.025)",
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
        }}
      >
        {spans.map((s) => {
          const isSel = selected?.kind === "span" && selected.item.id === s.id;
          const isHover = hoverId === s.id;
          const v = s.verdict;
          const edgeInk = v ? VERDICT_META[v].ink : lane.ink;
          const faded = dimmed(v);
          const style: CSSProperties = {
            position: "absolute",
            left: leftPct(s.start, range),
            width: spanPct(s.start, s.end, range),
            top: 5,
            bottom: 5,
            background: isSel ? `${lane.ink}38` : `${lane.ink}1f`,
            borderLeft: `4px ${s.approx ? "dotted" : "solid"} ${edgeInk}`,
            borderTop: `1px solid ${lane.ink}55`,
            borderRight: `1px solid ${lane.ink}33`,
            borderBottom: `1px solid ${lane.ink}33`,
            borderRadius: 3,
            cursor: "pointer",
            overflow: "hidden",
            padding: "0 5px",
            display: "flex",
            alignItems: "center",
            fontFamily: serif,
            fontSize: 13,
            fontWeight: 600,
            color: lane.ink,
            opacity: faded ? 0.28 : 1,
            boxShadow: isSel || isHover ? "0 2px 8px rgba(44,36,24,0.18)" : "none",
            transition: "opacity .15s, box-shadow .15s, background .15s",
            zIndex: isSel || isHover ? 2 : 1,
            whiteSpace: "nowrap",
          };
          return (
            <div
              key={s.id}
              title={`${s.label} · ${spanYears(s.start, s.end, s.approx)}`}
              onClick={() => onSelect(s)}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
              style={style}
            >
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventSpine({
  events,
  range,
  selected,
  hoverId,
  onHover,
  onSelect,
}: {
  events: Anno[];
  range: [number, number];
  selected: Selection;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (e: Anno) => void;
}) {
  return (
    <div style={{ position: "relative", height: 34, margin: "2px 0" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 16, height: 2, background: ACCENT, opacity: 0.5 }} />
      {events.map((e) => {
        const isSel = selected?.kind === "event" && selected.item.id === e.id;
        const isHover = hoverId === e.id;
        return (
          <div
            key={e.id}
            title={`${e.label} · ${yearLabel(e.year, e.approx)}`}
            onClick={() => onSelect(e)}
            onMouseEnter={() => onHover(e.id)}
            onMouseLeave={() => onHover(null)}
            style={{
              position: "absolute",
              left: leftPct(e.year, range),
              top: 6,
              transform: "translateX(-50%)",
              width: 18,
              height: 18,
              cursor: "pointer",
              zIndex: isSel || isHover ? 3 : 2,
            }}
          >
            <div
              style={{
                width: 13,
                height: 13,
                margin: "2px auto",
                background: isSel || isHover ? ACCENT : "#f5f0e8",
                border: `2px solid ${ACCENT}`,
                transform: "rotate(45deg)",
                boxShadow: isSel || isHover ? "0 2px 7px rgba(44,36,24,0.3)" : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function Dossier({
  selection,
  labels,
  onClose,
}: {
  selection: Selection;
  labels: { ref: string; detail: string; aside: string };
  onClose: () => void;
}) {
  if (!selection) {
    return (
      <p style={{ marginTop: 18, fontSize: 14, color: MUTED, fontStyle: "italic", fontFamily: body }}>
        Click a block or an event on the spine for its detail.
      </p>
    );
  }

  const panel: CSSProperties = {
    marginTop: 18,
    padding: "18px 22px",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    position: "relative",
  };
  const closeBtn: CSSProperties = {
    position: "absolute",
    top: 12,
    right: 14,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: MUTED,
    fontSize: 18,
    lineHeight: 1,
  };
  const label: CSSProperties = {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: MUTED,
    fontFamily: serif,
  };

  if (selection.kind === "span") {
    const s = selection.item;
    const v = s.verdict;
    return (
      <div style={panel}>
        <button onClick={onClose} style={closeBtn} aria-label="Close">
          ×
        </button>
        {s.group && <div style={label}>{s.group}</div>}
        <h3 style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, margin: "2px 0 2px" }}>{s.label}</h3>
        <div style={{ fontSize: 15, color: TEXT, marginBottom: 12 }}>
          {spanYears(s.start, s.end, s.approx)}
          {s.length ? ` · ${s.length} (as the text gives it)` : ""}
        </div>
        {v && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: VERDICT_META[v].ink }} />
            <span style={{ fontSize: 14, color: VERDICT_META[v].ink, fontWeight: 600 }}>{VERDICT_META[v].label}</span>
          </div>
        )}
        {s.note && <p style={{ fontSize: 16, lineHeight: 1.65, color: INK, margin: "0 0 12px" }}>{s.note}</p>}
        {s.aside && (
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: TEXT, fontStyle: "italic", margin: "0 0 12px" }}>
            <span style={label}>{s.asideLabel ?? labels.aside}</span>
            <br />
            {s.aside}
          </p>
        )}
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", fontSize: 14 }}>
          <span>
            <span style={label}>{s.refLabel ?? labels.ref}</span>
            <br />
            {s.ref}
          </span>
          {s.detail && (
            <span>
              <span style={label}>{s.detailLabel ?? labels.detail}</span>
              <br />
              {s.detail}
            </span>
          )}
        </div>
        <Reading refs={[s.detail, s.ref]} accent={ACCENT} />
      </div>
    );
  }

  const e = selection.item;
  return (
    <div style={panel}>
      <button onClick={onClose} style={closeBtn} aria-label="Close">
        ×
      </button>
      <div style={label}>{yearLabel(e.year, e.approx)}</div>
      <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, margin: "2px 0 8px" }}>{e.label}</h3>
      {e.note && <p style={{ fontSize: 16, lineHeight: 1.65, color: INK, margin: "0 0 12px" }}>{e.note}</p>}
      <div style={{ fontSize: 14 }}>
        <span style={label}>In Scripture</span>
        <br />
        {e.ref}
      </div>
      <Reading refs={[e.ref]} accent={ACCENT} />
    </div>
  );
}

function SpanIndex({
  edition,
  selected,
  onSelect,
}: {
  edition: Edition;
  selected: Selection;
  onSelect: (s: Span) => void;
}) {
  return (
    <div style={{ marginTop: 44 }}>
      <h2
        style={{
          fontFamily: serif,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: MUTED,
          marginBottom: 14,
        }}
      >
        {edition.indexTitle ?? "The index"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {edition.lanes.map((lane) => {
          const ss = edition.spans
            .filter((s) => s.lane === lane.id)
            .slice()
            .sort((a, b) => a.start - b.start);
          return (
            <div key={lane.id}>
              <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, color: lane.ink, marginBottom: 8 }}>
                {lane.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {ss.map((s) => {
                  const isSel = selected?.kind === "span" && selected.item.id === s.id;
                  const v = s.verdict;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelect(s)}
                      style={{
                        textAlign: "left",
                        border: "none",
                        borderLeft: `3px ${s.approx ? "dotted" : "solid"} ${v ? VERDICT_META[v].ink : lane.ink}`,
                        background: isSel ? `${lane.ink}1f` : "transparent",
                        cursor: "pointer",
                        padding: "7px 12px",
                        fontFamily: body,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ fontFamily: serif, fontSize: 17, color: INK }}>{s.label}</span>
                      <span style={{ fontSize: 12.5, color: MUTED, whiteSpace: "nowrap" }}>
                        {spanYears(s.start, s.end, s.approx)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
