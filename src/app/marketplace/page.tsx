"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { Search, PlusCircle, Sparkles, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { products } = useAuth();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get("condition") || "all");
  const [selectedUniversity, setSelectedUniversity] = useState(searchParams.get("uni") || "all");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s) setSearchQuery(s);
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const u = searchParams.get("uni");
    if (u) setSelectedUniversity(u);
  }, [searchParams]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedUniversity("all");
    setSelectedCity("all");
    setVerifiedOnly(false);
    setMaxPrice(30000);
  };

  // Filtered and Sorted items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesUni = p.seller.university.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesUni && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }

      // Condition
      if (selectedCondition !== "all" && p.condition !== selectedCondition) {
        return false;
      }

      // University
      if (selectedUniversity !== "all") {
        if (!p.seller.university.toLowerCase().includes(selectedUniversity.toLowerCase())) {
          return false;
        }
      }

      // City
      if (selectedCity !== "all") {
        if (p.seller.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Verified Only
      if (verifiedOnly && !p.seller.isVerifiedStudent) {
        return false;
      }

      // Max Price
      if (p.pricePkr > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePkr - b.pricePkr;
      if (sortBy === "price_desc") return b.pricePkr - a.pricePkr;
      if (sortBy === "rating") return b.seller.rating - a.seller.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedCondition,
    selectedUniversity,
    selectedCity,
    verifiedOnly,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-techlo-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            Hardware Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse {filteredProducts.length} verified hardware listings from university students across Pakistan.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-techlo-surface border border-techlo-border text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-techlo-cyan" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-techlo-surface border border-techlo-border rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-techlo-cyan mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest" className="bg-techlo-dark">Newest Listings First</option>
              <option value="price_asc" className="bg-techlo-dark">Price: Low to High</option>
              <option value="price_desc" className="bg-techlo-dark">Price: High to Low</option>
              <option value="rating" className="bg-techlo-dark">Top Rated Sellers</option>
            </select>
          </div>

          {/* Post Ad CTA */}
          <Link
            href="/sell"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark text-xs font-bold shadow-glow-cyan transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Component</span>
          </Link>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Desktop */}
        <div className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"} lg:col-span-1`}>
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            selectedUniversity={selectedUniversity}
            setSelectedUniversity={setSelectedUniversity}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            verifiedOnly={verifiedOnly}
            setVerifiedOnly={setVerifiedOnly}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onReset={handleReset}
          />
        </div>

        {/* Listings Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Search / Filters Indicator */}
          {(selectedCategory !== "all" ||
            selectedCondition !== "all" ||
            selectedUniversity !== "all" ||
            selectedCity !== "all" ||
            searchQuery.trim() !== "") && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {searchQuery.trim() && (
                <span className="px-2.5 py-1 bg-techlo-surface border border-techlo-border rounded-lg text-white font-mono">
                  &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-2.5 py-1 bg-techlo-surface border border-techlo-border rounded-lg text-techlo-cyan font-semibold">
                  {selectedCategory}
                </span>
              )}
              {selectedCondition !== "all" && (
                <span className="px-2.5 py-1 bg-techlo-surface border border-techlo-border rounded-lg text-techlo-sky font-semibold">
                  {selectedCondition}
                </span>
              )}
              {selectedUniversity !== "all" && (
                <span className="px-2.5 py-1 bg-techlo-surface border border-techlo-border rounded-lg text-emerald-400 font-semibold">
                  {selectedUniversity}
                </span>
              )}
              <button
                onClick={handleReset}
                className="text-techlo-cyan hover:underline ml-1 font-bold cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-techlo-dark border border-techlo-border rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-techlo-surface border border-techlo-border flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No hardware components found</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Try widening your price range, clearing filters, or searching for alternative part numbers.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-techlo-surface hover:bg-techlo-border border border-techlo-border rounded-xl text-xs text-white font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
                <Link
                  href="/sell"
                  className="px-4 py-2 bg-techlo-cyan text-techlo-dark rounded-xl text-xs font-bold shadow-glow-cyan"
                >
                  Post a Request / Sell Hardware
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 font-mono">Loading TECHLO Marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
