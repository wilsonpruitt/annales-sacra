import { notFound } from "next/navigation";
import Harmony from "@/components/Harmony";
import { HARMONIES, getHarmony } from "@/data/harmonies";

export function generateStaticParams() {
  return HARMONIES.map((h) => ({ slug: h.slug }));
}

export default async function HarmonyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const harmony = getHarmony(slug);
  if (!harmony) notFound();
  return <Harmony harmony={harmony} />;
}
