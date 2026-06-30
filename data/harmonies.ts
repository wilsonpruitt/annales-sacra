import type { Harmony } from "@/lib/harmony";
import diatessaron from "./diatessaron.json";

export const HARMONIES: Harmony[] = [diatessaron as unknown as Harmony];

export function getHarmony(slug: string): Harmony | undefined {
  return HARMONIES.find((h) => h.slug === slug);
}
