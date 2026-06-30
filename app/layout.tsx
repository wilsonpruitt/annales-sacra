import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://annales.wrootpress.com"),
  title: "Annales Sacra · Wroot Press",
  description:
    "Scripture's years laid flat. A reader's lens on the chronology of the canon — two kingdoms, one timeline, the reigns and synchronisms Kings tells in a braid.",
  openGraph: {
    title: "Annales Sacra · Wroot Press",
    description:
      "Scripture's years laid flat. A reader's lens on the chronology of the canon — two kingdoms, one timeline.",
    siteName: "Annales Sacra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Annales Sacra · Wroot Press",
    description: "Scripture's years laid flat — a Wroot Press reading lens.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f5f0e8" }}>{children}</body>
    </html>
  );
}
