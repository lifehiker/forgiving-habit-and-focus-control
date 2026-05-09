import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, getBlogPost } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) {
    return buildMetadata({ title: "Not found", path: `/blog/${slug}` });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="shell max-w-4xl space-y-8">
      <div className="space-y-4">
        <p className="eyebrow text-xs text-[var(--muted-foreground)]">{post.category}</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">{post.description}</p>
      </div>
      <div className="glass prose-copy rounded-[2rem] p-8">
        {post.body.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted-foreground)]">
        Related pages: <Link className="font-semibold text-[var(--foreground)]" href="/forgiving-habit-tracker">forgiving habit tracker</Link>,{" "}
        <Link className="font-semibold text-[var(--foreground)]" href="/focus-session-app">focus session app</Link>, and{" "}
        <Link className="font-semibold text-[var(--foreground)]" href="/pricing">pricing</Link>.
      </div>
    </article>
  );
}
