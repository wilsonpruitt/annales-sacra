import { notFound } from "next/navigation";
import Timeline from "@/components/Timeline";
import { EDITIONS, getEdition } from "@/data/editions";

export function generateStaticParams() {
  return EDITIONS.map((e) => ({ edition: e.slug }));
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition: slug } = await params;
  const edition = getEdition(slug);
  if (!edition) notFound();
  return <Timeline edition={edition} />;
}
