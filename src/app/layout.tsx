import type { Metadata } from "next";
import "./globals.css";

import { getBaseUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: "Forging Habit",
    template: "%s | Forging Habit",
  },
  description:
    "A forgiving habit tracker built for people who miss days and restart often. Track momentum, recover quickly, and run commitment-grade focus sessions with website blocking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
