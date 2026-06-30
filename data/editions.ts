import type { Edition } from "@/lib/types";
import dividedMonarchy from "./divided-monarchy.json";
import lifeOfPaul from "./life-of-paul.json";

// JSON infers `range` as number[] rather than the [number, number] tuple, so the
// cast goes through `unknown`. The shapes are validated by the data scripts.
export const EDITIONS: Edition[] = [
  dividedMonarchy as unknown as Edition,
  lifeOfPaul as unknown as Edition,
];

export function getEdition(slug: string): Edition | undefined {
  return EDITIONS.find((e) => e.slug === slug);
}
