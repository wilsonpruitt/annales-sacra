import Link from "next/link";
import { EDITIONS } from "@/data/editions";
import { HARMONIES } from "@/data/harmonies";

const ACCENT = "#4a5a7a"; // annals indigo — the chrome accent for the WHEN lens

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", color: "#2c2418" }}>
      <header
        style={{
          background: "#2c2418",
          color: "#f5f0e8",
          padding: "64px 24px 56px",
          textAlign: "center",
        }}
      >
        <div style={{ color: ACCENT, letterSpacing: 10, marginBottom: 16, fontSize: 14 }}>
          — · — · —
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 72,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 14,
          }}
        >
          ANNALES SACRA
        </h1>
        <div style={{ width: 80, height: 1, background: ACCENT, margin: "16px auto" }} />
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            color: "#b9c2d6",
            fontSize: 19,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          Scripture&rsquo;s years, laid flat
        </p>
      </header>

      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px 24px 80px",
          fontFamily: "'Crimson Pro', Georgia, serif",
        }}
      >
        <p style={{ fontSize: 17, lineHeight: 1.75, color: "#4a3d30" }}>
          A small Wroot Press project. <em>Annales</em> — the old word for a record
          kept year by year. Scripture&rsquo;s narrative order is not its order in
          time: Kings tells two kingdoms at once, handing off between Israel and
          Judah with a synchronism every reader loses track of — &ldquo;in the
          twentieth year of Jeroboam king of Israel, Asa began to reign over
          Judah.&rdquo; This lens lays those years flat. One timeline, two tracks,
          every reign sized to its length and stamped with the verdict the book
          gives it. Sibling to <em>Topographia Sacra</em> (which organizes by{" "}
          <em>where</em>) and <em>Catena</em> (by how the texts connect).
        </p>

        <h2
          style={{
            marginTop: 48,
            marginBottom: 16,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a7a6a",
          }}
        >
          The Editions
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          {EDITIONS.map((e) => (
            <Link
              key={e.slug}
              href={`/${e.slug}`}
              style={{
                display: "block",
                padding: "20px 24px",
                background: "#eee9df",
                border: "1px solid #d4c9b5",
                borderRadius: 6,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 3,
                  color: "#2c2418",
                }}
              >
                {e.name.toUpperCase()}
              </div>
              {e.subtitle && (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#8a7a6a",
                    fontSize: 15,
                    marginTop: 4,
                    letterSpacing: 1,
                  }}
                >
                  {e.subtitle} · {e.source}
                </div>
              )}
              {e.blurb && (
                <div style={{ fontSize: 15, lineHeight: 1.55, color: "#4a3d30", marginTop: 10 }}>
                  {e.blurb}
                </div>
              )}
            </Link>
          ))}
        </div>

        <h2
          style={{
            marginTop: 44,
            marginBottom: 16,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a7a6a",
          }}
        >
          The Harmonies
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          {HARMONIES.map((h) => (
            <Link
              key={h.slug}
              href={`/harmony/${h.slug}`}
              style={{
                display: "block",
                padding: "20px 24px",
                background: "#eee9df",
                border: "1px solid #d4c9b5",
                borderLeft: `4px solid ${ACCENT}`,
                borderRadius: 6,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 3,
                  color: "#2c2418",
                }}
              >
                {h.name.toUpperCase()}
              </div>
              {h.subtitle && (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#8a7a6a",
                    fontSize: 15,
                    marginTop: 4,
                    letterSpacing: 1,
                  }}
                >
                  {h.subtitle}
                </div>
              )}
              {h.blurb && (
                <div style={{ fontSize: 15, lineHeight: 1.55, color: "#4a3d30", marginTop: 10 }}>{h.blurb}</div>
              )}
            </Link>
          ))}
        </div>

        <p
          style={{
            marginTop: 48,
            fontSize: 12,
            color: "#8a7a6a",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Scripture: World English Bible · Public Domain · Wroot Press
        </p>
      </main>
    </div>
  );
}
