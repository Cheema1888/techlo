"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from "@/lib/blogData";
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Tag,
  Cpu,
  Layers,
  Wrench,
  GraduationCap,
} from "lucide-react";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Hardware Guides":
        return <Cpu className="w-3 h-3 text-cyan-500" />;
      case "PCB Prototyping":
        return <Layers className="w-3 h-3 text-emerald-500" />;
      case "Engineering Tips":
        return <Wrench className="w-3 h-3 text-amber-500" />;
      case "FYP Success":
        return <GraduationCap className="w-3 h-3 text-purple-500" />;
      default:
        return <BookOpen className="w-3 h-3 text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>TECHLO Engineering Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
          Hardware & FYP Guides
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
          Technical deep-dives, hardware sourcing guides, KiCad PCB fabrication advice, and FYP project blueprints for engineering students across Pakistan.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search guides, ESP32, PCB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Hero Featured Article (When no active search filter) */}
      {!searchQuery && selectedCategory === "All" && featuredPost && (
        <div className="mb-12">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/90 dark:border-neutral-800/90 hover:border-black dark:hover:border-neutral-600 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/50">
                    {getCategoryIcon(featuredPost.category)}
                    <span>Featured Guide</span>
                  </span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-mono text-xs font-bold flex items-center justify-center">
                    {featuredPost.author.avatarInitials}
                  </div>
                  <div className="text-xs font-mono">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-neutral-400 text-[10px]">
                      {featuredPost.publishedAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2 font-mono text-xs font-bold text-black dark:text-white group-hover:translate-x-1.5 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            {selectedCategory === "All" ? "All Engineering Guides" : `${selectedCategory} Articles`} ({filteredPosts.length})
          </h3>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-neutral-50 dark:bg-[#0c0c0e] border border-neutral-200 dark:border-neutral-800 space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
            <div className="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No articles found matching &quot;{searchQuery}&quot;
            </div>
            <p className="text-xs text-neutral-500 font-sans">
              Try searching with a different keyword or switch categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#0c0c0e] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-black dark:hover:border-neutral-600 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300">
                      {getCategoryIcon(post.category)}
                      <span>{post.category}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 font-sans">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {post.author.avatarInitials}
                    </div>
                    <span className="text-xs font-mono text-neutral-500">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold text-black dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-16 p-8 rounded-3xl bg-neutral-900 text-white dark:bg-[#121215] border border-neutral-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h4 className="text-xl font-mono font-black tracking-tight text-white">
            Need Components for Your FYP Project?
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            Connect directly with engineering students across 20+ Pakistani universities to buy verified microcontrollers, sensors, and development boards at student prices.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/marketplace"
            className="px-5 py-2.5 rounded-full bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition-colors"
          >
            Browse Marketplace →
          </Link>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-medium text-xs border border-neutral-700 transition-colors"
          >
            PCB Fabrication
          </Link>
        </div>
      </div>
    </div>
  );
}
