"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { GOSPELS, tradition, type Gospel, type Harmony as HarmonyT, type Episode } from "@/lib/harmony";
import Reading from "@/components/Reading";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";

const INK = "#2c2418";
const TEXT = "#4a3d30";
const MUTED = "#8a7a6a";
const CARD = "#eee9df";
const BORDER = "#d4c9b5";
const ACCENT = "#4a5a7a";

const serif = "'Cormorant Garamond', Georgia, serif";
const body = "'Crimson Pro', Georgia, serif";

const GRID = "minmax(190px, 2.1fr) repeat(4, 1fr)";

const inkOf = (g: Gospel) => GOSPELS.find((x) => x.id === g)!.ink;

function tagColor(count: number, refs: Episode["refs"]): string {
  if (count === 4) return ACCENT;
  if (count === 3) return "#5a7a3f";
  if (count === 2) return "#b58a3f";
  const only = (Object.keys(refs) as Gospel[]).find((g) => refs[g]);
  return only ? inkOf(only) : MUTED;
}

export default function Harmony({ harmony }: { harmony: HarmonyT }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);
  const [active, setActive] = useState<Set<Gospel>>(new Set());

  useEffect(() => {
    if (!document.getElementById("annales-fonts")) {
      const l = document.createElement("link");
      l.id = "annales-fonts";
      l.rel = "stylesheet";
      l.href = FONT_URL;
      document.head.appendChild(l);
    }
  }, []);

  const toggle = (g: Gospel) =>
    setActive((prev) => {
      const n = new Set(prev);
      n.has(g) ? n.delete(g) : n.add(g);
      return n;
    });

  // An episode is dimmed when a gospel filter is on and it lacks one of the
  // chosen gospels (AND semantics — "show what these gospels share").
  const dimmed = (e: Episode) =>
    active.size > 0 && [...active].some((g) => !e.refs[g]);

  const bySection = useMemo(() => {
    return harmony.sections.map((sec) => ({
      section: sec,
      episodes: harmony.episodes.filter((e) => e.section === sec.id),
    }));
  }, [harmony]);

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
            {harmony.name.toUpperCase()}
          </h1>
          {harmony.subtitle && (
            <div style={{ fontFamily: serif, fontStyle: "italic", color: "#b9c2d6", fontSize: 18, marginTop: 4 }}>
              {harmony.subtitle}
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 96px" }}>
        {harmony.howToRead && (
          <p style={{ fontSize: 16, lineHeight: 1.7, color: TEXT, maxWidth: 780 }}>{harmony.howToRead}</p>
        )}

        {/* Gospel toggles / legend */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "20px 0 14px", alignItems: "center" }}>
          <span style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: MUTED, fontFamily: serif }}>
            The four
          </span>
          {GOSPELS.map((g) => {
            const on = active.has(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: serif,
                  fontSize: 16,
                  fontWeight: 600,
                  color: active.size === 0 || on ? g.ink : "#b8ab98",
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: g.ink,
                    boxShadow: on ? `0 0 0 2px #f5f0e8, 0 0 0 3px ${g.ink}` : "none",
                  }}
                />
                {g.name}
              </button>
            );
          })}
          {active.size > 0 && (
            <button
              onClick={() => setActive(new Set())}
              style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13, fontFamily: body }}
            >
              clear
            </button>
          )}
        </div>

        {/* Column header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: GRID,
            position: "sticky",
            top: 0,
            zIndex: 5,
            background: "#f5f0e8",
            borderBottom: `2px solid ${INK}`,
            padding: "6px 0",
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: MUTED, padding: "0 8px" }}>
            Episode
          </div>
          {GOSPELS.map((g) => (
            <div
              key={g.id}
              style={{
                fontFamily: serif,
                fontSize: 16,
                fontWeight: 600,
                color: g.ink,
                textAlign: "center",
                opacity: active.size === 0 || active.has(g.id) ? 1 : 0.4,
              }}
            >
              {g.name}
            </div>
          ))}
        </div>

        {/* Sections & rows */}
        {bySection.map(({ section, episodes }) => (
          <div key={section.id}>
            <div
              style={{
                marginTop: 18,
                padding: "8px 8px 6px",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 21, fontWeight: 700, color: INK, letterSpacing: 1 }}>
                {section.name}
              </span>
              {section.gloss && (
                <span style={{ fontFamily: serif, fontStyle: "italic", color: MUTED, fontSize: 15, marginLeft: 12 }}>
                  {section.gloss}
                </span>
              )}
            </div>

            {episodes.map((e) => {
              const { count } = tradition(e.refs);
              const isSel = selected === e.id;
              const faded = dimmed(e);
              return (
                <div key={e.id} style={{ opacity: faded ? 0.32 : 1, transition: "opacity .15s" }}>
                  <button
                    onClick={() => setSelected(isSel ? null : e.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: GRID,
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      borderBottom: `1px solid ${BORDER}`,
                      background: isSel ? "rgba(74,90,122,0.08)" : "transparent",
                      cursor: "pointer",
                      padding: 0,
                      alignItems: "stretch",
                      fontFamily: body,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 8px" }}>
                      <span
                        title={`${count} of 4`}
                        style={{ width: 9, height: 9, borderRadius: 2, background: tagColor(count, e.refs), flex: "none" }}
                      />
                      <span style={{ fontFamily: serif, fontSize: 17, color: INK, lineHeight: 1.2 }}>
                        {e.title}
                        {e.redLetter && <span style={{ color: "#a23f3f", fontSize: 13 }}>&nbsp;❝</span>}
                      </span>
                    </span>
                    {GOSPELS.map((g) => {
                      const ref = e.refs[g.id];
                      return (
                        <span
                          key={g.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "9px 4px",
                            fontSize: 13.5,
                            textAlign: "center",
                            color: ref ? g.ink : "#c9bca6",
                            background: ref ? `${g.ink}14` : "transparent",
                            borderLeft: `1px solid ${BORDER}`,
                            fontWeight: ref ? 600 : 400,
                          }}
                        >
                          {ref ?? "·"}
                        </span>
                      );
                    })}
                  </button>

                  {isSel && (
                    <div
                      style={{
                        padding: "14px 18px 18px",
                        background: CARD,
                        borderBottom: `1px solid ${BORDER}`,
                        borderLeft: `3px solid ${tagColor(count, e.refs)}`,
                      }}
                    >
                      <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{e.title}</div>
                      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: e.note ? 12 : 0 }}>
                        {GOSPELS.map((g) => (
                          <span key={g.id} style={{ fontSize: 14, color: e.refs[g.id] ? g.ink : "#c2b6a2" }}>
                            <span style={{ fontFamily: serif, fontWeight: 600 }}>{g.name}</span>{" "}
                            {e.refs[g.id] ? e.refs[g.id] : "—"}
                          </span>
                        ))}
                      </div>
                      {e.note && <p style={{ fontSize: 16, lineHeight: 1.65, color: INK, margin: 0 }}>{e.note}</p>}
                      {reading === e.id ? (
                        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
                          {GOSPELS.filter((g) => e.refs[g.id]).map((g) => (
                            <Reading
                              key={g.id}
                              defaultOpen
                              label={g.name}
                              accent={g.ink}
                              refs={[`${g.name} ${e.refs[g.id]}`]}
                            />
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setReading(e.id)}
                          style={{
                            marginTop: 12,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: ACCENT,
                            fontFamily: serif,
                            fontSize: 15,
                            fontWeight: 600,
                            padding: 0,
                          }}
                        >
                          ¶ Read the parallels &rarr;
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {harmony.seedNote && (
          <p
            style={{
              marginTop: 36,
              padding: "14px 18px",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${ACCENT}`,
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 1.6,
              color: TEXT,
              maxWidth: 780,
            }}
          >
            <strong style={{ fontFamily: serif, letterSpacing: 1 }}>A note on this edition.</strong> {harmony.seedNote}
          </p>
        )}

        <p style={{ marginTop: 40, fontSize: 12, color: MUTED, textAlign: "center", letterSpacing: 1 }}>
          {harmony.translation} · Public Domain · Wroot Press · <span style={{ color: "#a23f3f" }}>❝</span> marks notable words of Jesus
        </p>
      </main>
    </div>
  );
}
