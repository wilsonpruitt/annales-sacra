"use client";

import { useEffect, useState } from "react";
import { passage, type Passage } from "@/lib/fons";

const INK = "#2c2418";
const MUTED = "#8a7a6a";
const serif = "'Cormorant Garamond', Georgia, serif";

// Expand a list of candidate references into individually-resolvable refs: split
// compound citations ("Amos 1 · Hosea 1", "1 Kings 14:25–26 · 2 Chron 12") on their
// separators and strip trailing parentheticals ("(tradition)", "(extra-biblical)").
function candidates(refs: (string | undefined)[]): string[] {
  const out: string[] = [];
  for (const r of refs) {
    if (!r) continue;
    for (const part of r.split(/[·;]/)) {
      const clean = part.replace(/\([^)]*\)/g, "").trim();
      if (clean) out.push(clean);
    }
  }
  return out;
}

// Resolve the first candidate that maps to real scripture and render it. `refs` is
// a priority list (e.g. [reign passage, accession formula]); the first hit wins.
// `defaultOpen` reads immediately (used to stack the four gospels in the harmony);
// `label` prints a heading above the text (the gospel's name).
export default function Reading({
  refs,
  accent,
  defaultOpen = false,
  label,
}: {
  refs: (string | undefined)[];
  accent: string;
  defaultOpen?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, setState] = useState<"idle" | "loading" | "done" | "empty">("idle");
  const [result, setResult] = useState<Passage | null>(null);

  const cands = candidates(refs);

  useEffect(() => {
    if (!open || state !== "idle") return;
    let cancelled = false;
    setState("loading");
    (async () => {
      for (const c of cands) {
        try {
          const p = await passage(c);
          if (cancelled) return;
          if (p && p.verses.length) {
            setResult(p);
            setState("done");
            return;
          }
        } catch {
          /* try the next candidate */
        }
      }
      if (!cancelled) setState("empty");
    })();
    return () => {
      cancelled = true;
    };
  }, [open, state, cands]);

  if (!cands.length) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          marginTop: 10,
          border: "none",
          background: "none",
          cursor: "pointer",
          color: accent,
          fontFamily: serif,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0.5,
          padding: 0,
        }}
      >
        ¶ Read the passage →
      </button>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      {state === "loading" && <div style={{ fontSize: 14, color: MUTED, fontStyle: "italic" }}>Reading…</div>}
      {state === "empty" && (
        <div style={{ fontSize: 14, color: MUTED, fontStyle: "italic" }}>
          No public-domain text for this reference.
        </div>
      )}
      {state === "done" && result && (
        <div>
          <div style={{ fontFamily: serif, fontSize: 15, fontWeight: 600, color: accent, marginBottom: 6 }}>
            {label ? `${label} · ` : ""}
            {result.refDisplay} <span style={{ color: MUTED, fontWeight: 400, fontStyle: "italic" }}>· WEB</span>
          </div>
          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
              fontSize: 16,
              lineHeight: 1.7,
              color: INK,
              paddingRight: 8,
              borderLeft: `2px solid ${accent}`,
              paddingLeft: 14,
            }}
          >
            {result.verses.map((v) => (
              <span key={v.v}>
                <span style={{ fontSize: 11, color: MUTED, verticalAlign: "super", marginRight: 3 }}>{v.v}</span>
                {v.t}{" "}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
