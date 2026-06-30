// A gospel harmony — the other face of the WHEN lens. Tatian's *Diatessaron*
// ("through the four") wove Matthew, Mark, Luke, and John into one continuous
// life. This model keeps the four distinct but sets them side by side: an ordered
// sequence of episodes, each marked with the place it stands in every gospel that
// tells it. The reader sees at a glance the triple tradition, the Markan spine,
// and John's stubborn independence.

export type Gospel = "matthew" | "mark" | "luke" | "john";

export const GOSPELS: { id: Gospel; name: string; ink: string }[] = [
  { id: "matthew", name: "Matthew", ink: "#9c6b3f" },
  { id: "mark", name: "Mark", ink: "#3f6f86" },
  { id: "luke", name: "Luke", ink: "#5a7a3f" },
  { id: "john", name: "John", ink: "#86417a" },
];

export type Episode = {
  id: string;
  section: string; // HarmonySection.id
  title: string;
  refs: Partial<Record<Gospel, string>>; // a reference in each gospel that tells it
  note?: string; // why it matters, or what the harmony reveals here
  redLetter?: boolean; // carries notable words of Jesus
};

export type HarmonySection = {
  id: string;
  name: string;
  gloss?: string;
};

export type Harmony = {
  slug: string;
  name: string;
  subtitle?: string;
  blurb?: string;
  translation: string;
  sections: HarmonySection[];
  episodes: Episode[];
  howToRead?: string;
  seedNote?: string;
};

// How many of the four tell a given episode — drives the "tradition" tag.
export function tradition(refs: Episode["refs"]): {
  count: number;
  label: string;
} {
  const count = (["matthew", "mark", "luke", "john"] as Gospel[]).filter(
    (g) => refs[g],
  ).length;
  const label =
    count === 4
      ? "all four"
      : count === 1
        ? "unique"
        : count === 3
          ? "triple"
          : "double";
  return { count, label };
}
