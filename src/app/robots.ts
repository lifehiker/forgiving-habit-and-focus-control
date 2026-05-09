import type { MetadataRoute } from "next";

import { getBaseUrlString } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrlString();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/habits", "/focus", "/history", "/settings", "/billing"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
