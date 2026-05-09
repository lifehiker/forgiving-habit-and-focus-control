import type { Metadata } from "next";

import { getBaseUrlString } from "@/lib/env";

const appName = "Forging Habit";
const defaultDescription =
  "A forgiving habit tracker built for people who miss days and restart often. Track momentum, recover quickly, and run commitment-grade focus sessions with website blocking.";

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  keywords = [],
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${getBaseUrlString()}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${appName}`,
      description,
      url,
      siteName: appName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${appName}`,
      description,
    },
  };
}
