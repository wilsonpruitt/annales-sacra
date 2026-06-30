# Annales Sacra

A Wroot Press reading-lens. **Annales Sacra** organizes Scripture by *when* —
it lays the canon's years flat so the temporal order beneath the narrative order
becomes legible. Sibling to **Topographia Sacra** (organizes by *where*),
**Loci** (by *what*), and **Catena** (by how the texts connect).

## The model

The book of Kings tells two kingdoms at once, handing off between Israel and
Judah with a synchronism the reader cannot hold in their head — "in the twentieth
year of Jeroboam king of Israel, Asa began to reign over Judah." This lens makes
that braid a picture: one timeline, two parallel tracks, every reign sized to its
length and stamped with the Deuteronomistic verdict.

| Field | Meaning |
|---|---|
| `Reign` | one king's span in a lane — accession year, length *as the text states it*, the cross-kingdom synchronism, and the chapters that carry it |
| `verdict` | the book's appraisal: **right**, **evil**, or **mixed** (right, but the high places remained) — rendered on the block's left edge |
| `Anno` | a point-event on the central spine (schism, battle, prophet, fall) anchored to a year |
| `Lane` | a kingdom track (Israel / Judah), each with its own ink |

Dates are conventional (Thiele's chronology), stored as positive integers of years
B.C. — a *larger* number is *earlier*.

## The one affordance

A horizontal timeline with parallel lanes. Click a reign for its dossier; click an
event diamond on the spine for its moment. Below, a synchronized regnal index gives
the same data as a readable list.

## Editions

- **The Divided Monarchy** — *Two kingdoms, one timeline.* Launch seed: the schism
  at Shechem (931 B.C.) through Jehu's revolt (841 B.C.) — the rise and fall of the
  house of Omri told in both kingdoms at once, with the two falls (Samaria 722,
  Jerusalem 586) on the spine as horizon markers.

## Adding an edition

1. Author a `data/<slug>.json` following `lib/types.ts`. North-kingdom reigns go in
   `reigns`, south-kingdom in `judahReignsList` (merged at load by `data/editions.ts`;
   the split is only for author legibility).
2. Register it in the `EDITIONS` array in `data/editions.ts`.

## Stack

Next.js 16 · React 19 · TypeScript · static export (`generateStaticParams`), no
runtime deps. Shares the Wroot Press imprint register (laid-paper cream, Cormorant
Garamond / Crimson Pro). `npm run dev` (Turbopack) · `npm run build`.
