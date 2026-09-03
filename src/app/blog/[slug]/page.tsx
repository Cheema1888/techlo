import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blogData";
import {
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Check,
  Cpu,
  Layers,
  Wrench,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | TECHLO",
    };
  }

  return {
    title: `${post.title} | TECHLO Engineering Journal`,
    description: post.excerpt,
    keywords: [...post.tags, "TECHLO", "Pakistan Hardware", "FYP Engineering"],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      url: `https://www.techlo.store/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, post.category, 2);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Hardware Guides":
        return <Cpu className="w-3.5 h-3.5 text-cyan-500" />;
      case "PCB Prototyping":
        return <Layers className="w-3.5 h-3.5 text-emerald-500" />;
      case "Engineering Tips":
        return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
      case "FYP Success":
        return <GraduationCap className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return null;
    }
  };

  const shareUrl = `https://www.techlo.store/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title} via @techlostore`);

  return (
    <article className="min-h-screen py-10 md:py-16 px-4 sm:px-6 max-w-4xl mx-auto font-sans">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>
        <span>/</span>
        <span className="text-neutral-400 dark:text-neutral-600">{post.category}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-6 pb-8 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-200">
            {getCategoryIcon(post.category)}
            <span>{post.category}</span>
          </span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs font-mono text-neutral-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
          {post.excerpt}
        </p>

        {/* Author Details & Share Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-mono font-bold text-sm flex items-center justify-center shadow-sm">
              {post.author.avatarInitials}
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                {post.author.name}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                {post.author.role}
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 transition-colors"
            >
              Share on WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-800/60 transition-colors"
            >
              Share on X
            </a>
          </div>
        </div>
      </header>

      {/* Article Content Body */}
      <div className="py-10 space-y-10">
        {post.sections.map((sec, idx) => (
          <section key={idx} className="space-y-4">
            {sec.heading && (
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white pt-2">
                {sec.heading}
              </h2>
            )}

            <div className="space-y-3.5 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base font-sans">
              {sec.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Callout Box */}
            {sec.callout && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-sans flex items-start gap-3.5 ${
                  sec.callout.type === "warning"
                    ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200"
                    : sec.callout.type === "tip"
                    ? "bg-cyan-50/70 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800/50 text-cyan-900 dark:text-cyan-200"
                    : "bg-neutral-100/70 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
                }`}
              >
                {sec.callout.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                ) : sec.callout.type === "tip" ? (
                  <Sparkles className="w-5 h-5 flex-shrink-0 text-cyan-500 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 flex-shrink-0 text-neutral-400 mt-0.5" />
                )}
                <div>
                  <span className="font-mono font-bold uppercase text-[11px] block mb-1">
                    {sec.callout.type === "warning" ? "Caution" : sec.callout.type === "tip" ? "Pro Tip" : "Note"}
                  </span>
                  <span className="leading-relaxed">{sec.callout.text}</span>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Tags Section */}
      <div className="pt-6 pb-10 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-neutral-400 mr-2">Tags:</span>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 rounded-3xl bg-neutral-100 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
        <div className="space-y-1 max-w-md">
          <h4 className="font-mono font-bold text-neutral-900 dark:text-white text-base">
            Need hardware or custom PCBs for this?
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
            Post your component request or browse active listings from students across Pakistan on TECHLO.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-mono text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/services/request"
            className="px-4 py-2 rounded-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-mono text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Request PCB Quote
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
            Related Engineering Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.slug}
                href={`/blog/${rPost.slug}`}
                className="group block p-5 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-black dark:hover:border-neutral-600 transition-all shadow-sm"
              >
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  {rPost.category}
                </span>
                <h5 className="font-mono font-bold text-sm text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {rPost.title}
                </h5>
                <span className="text-xs font-mono font-semibold text-black dark:text-white mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
