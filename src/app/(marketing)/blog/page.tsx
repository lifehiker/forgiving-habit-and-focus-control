import Link from "next/link";

import { blogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
  keywords: ["habit tracker blog", "restart habits", "focus blocker blog"],
});

export default function BlogIndexPage() {
  return (
    <section className="shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">Blog</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Recovery-first habits and stronger focus, explained plainly.
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            className="glass rounded-[1.8rem] p-6 transition hover:-translate-y-0.5"
            href={`/blog/${post.slug}`}
          >
            <p className="eyebrow text-xs text-[var(--muted-foreground)]">{post.category}</p>
            <h2 className="mt-3 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
