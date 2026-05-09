import type { MetadataRoute } from "next";

import { blogPosts } from "@/lib/content";
import { getBaseUrlString } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrlString();
  const staticRoutes = [
    "",
    "/pricing",
    "/blog",
    "/login",
    "/forgiving-habit-tracker",
    "/habit-tracker-no-streak",
    "/focus-session-app",
    "/website-blocker-for-deep-work",
    "/habit-tracker-adhd",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ];
}
