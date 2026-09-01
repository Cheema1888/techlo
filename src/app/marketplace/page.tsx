"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { Search, Plus, SlidersHorizontal, ArrowUpDown, Cpu } from "lucide-react";
import Link from "next/link";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { products, refreshData } = useAuth();

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

  // Filtered and Sorted items directly from live database state
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesUni = p.seller?.university?.toLowerCase().includes(q);
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
        if (!p.seller?.university?.toLowerCase().includes(selectedUniversity.toLowerCase())) {
          return false;
        }
      }

      // City
      if (selectedCity !== "all" && selectedCity !== "All Cities") {
        if (!p.location?.toLowerCase().includes(selectedCity.toLowerCase()) && p.seller?.city !== selectedCity) {
          return false;
        }
      }

      // Verified Student Only
      if (verifiedOnly && !p.seller?.isVerifiedStudent) {
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
      if (sortBy === "rating") return (b.seller?.rating || 5) - (a.seller?.rating || 5);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, selectedUniversity, selectedCity, verifiedOnly, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">
              // CAMPUS DIRECTORY
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
              Hardware Marketplace
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 font-sans">
              Browse microcontrollers, sensors, development kits, and motors listed by engineering students across Pakistan.
            </p>
          </div>

          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Hardware Item</span>
          </Link>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by component title, chip model (ESP32, STM32), or campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0e0e0e] border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white rounded-xl text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white dark:bg-[#0e0e0e] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-black dark:text-white focus:outline-none cursor-pointer shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated Sellers</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0e0e0e] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white lg:hidden flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
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

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-white dark:bg-[#0a0a0a] h-full overflow-y-auto p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="font-bold text-black dark:text-white text-xs">Filter Options</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-xs text-neutral-500 hover:text-black dark:hover:text-white font-bold"
                >
                  Close ✕
                </button>
              </div>
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
          </div>
        )}

        {/* Products Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 pb-2">
            <span>
              Showing <strong>{filteredProducts.length}</strong> items in database
            </span>
            {(selectedCategory !== "all" || selectedUniversity !== "all" || searchQuery) && (
              <button
                onClick={handleReset}
                className="text-black dark:text-white hover:underline cursor-pointer"
              >
                Clear active filters
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm">
              <Cpu className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-black dark:text-white">No hardware listings found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto font-sans">
                Try adjusting your search query, price slider, or university campus filter.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black text-black dark:text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 font-mono text-xs text-neutral-500">Loading live marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
