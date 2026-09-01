"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { QuoteEstimator } from "@/components/services/QuoteEstimator";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import {
  Cpu,
  Layers,
  ArrowRight,
  Plus,
  Search,
  Box,
  Printer,
  FileText,
  ArrowUpRight,
  User,
} from "lucide-react";

export default function HomePage() {
  const { products, user, isAuthenticated, openAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroSearch, setHeroSearch] = useState("");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Components" },
    { id: "microcontrollers", label: "Microcontrollers" },
    { id: "sensors", label: "Sensors & IMUs" },
    { id: "motors_actuators", label: "Motors & Drivers" },
    { id: "power_bms", label: "Power & LiPo" },
    { id: "development_boards", label: "SBCs & FPGAs" },
    { id: "test_tools", label: "Lab Tools" },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (PI.DEV SERENE MINIMALISM) */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-200/70 dark:border-neutral-800/70 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* User Status / Platform Pill */}
          {isAuthenticated && user ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 text-xs text-neutral-800 dark:text-neutral-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Signed in as <strong>{user.fullName}</strong> ({user.university})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 text-xs text-neutral-600 dark:text-neutral-400 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
              <span>Pakistan Student Hardware Exchange & Prototyping</span>
            </div>
          )}

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
            Hardware exchange for engineering students.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Trade microcontrollers, sensors, motors, and lab tools across Pakistani campuses — or order rapid <strong>PCB design, fabrication pooling, and 3D printing</strong>.
          </p>

          {/* Search Input Bar (Pi.dev pill search) */}
          <div className="max-w-lg mx-auto pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (heroSearch.trim()) {
                  window.location.href = `/marketplace?search=${encodeURIComponent(heroSearch)}`;
                }
              }}
              className="relative flex items-center p-1.5 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 focus-within:border-black dark:focus-within:border-white rounded-full shadow-xs transition-all"
            >
              <Search className="w-4 h-4 text-neutral-400 ml-3.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search ESP32, STM32, LiDAR, LiPo, Stepper..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-black dark:text-white text-xs placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full transition-all cursor-pointer flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/marketplace"
              className="px-5 py-2.5 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isAuthenticated ? (
              <Link
                href="/sell"
                className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Hardware</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Sign In with University</span>
              </button>
            )}

            <Link
              href="/services/request"
              className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              <span>Request PCB/CAD Quote</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HARDWARE MARKETPLACE SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
              // LIVE HARDWARE INVENTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Hardware Components
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Tested microcontrollers, sensors, motors, and lab tools listed by students across Pakistan.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="text-xs font-semibold text-black dark:text-white hover:underline inline-flex items-center gap-1"
          >
            <span>Browse All {products.length} Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Pills (Pi.dev pill group) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                    : "bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-neutral-50 dark:bg-[#121215] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-3 shadow-xs">
            <Cpu className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-semibold text-black dark:text-white">No items found in this category</h3>
            <p className="text-xs text-neutral-500">Be the first student to post hardware in your university!</p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Hardware Ad</span>
            </Link>
          </div>
        )}
      </section>

      {/* 3. PROTOTYPING & ENGINEERING SERVICES SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pt-8 border-t border-neutral-200/70 dark:border-neutral-800/70">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
              // ON-DEMAND PROTOTYPING
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              PCB Designing, Batch Fabrication & 3D CAD
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Custom schematics, multi-layer routing, consolidated PCB batch orders, and 3D printed housings.
            </p>
          </div>

          <Link
            href="/services/request"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs shadow-xs"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-xs">
            <Cpu className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">PCB Design (KiCad/Altium)</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              2, 4, 6 layer routing, differential pairs, and DRC validation.
            </p>
            <Link href="/services#pcb-design" className="text-xs text-black dark:text-white inline-flex items-center gap-1 hover:underline pt-1 font-medium">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-xs">
            <Layers className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">PCB Batch Fabrication</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Consolidated batch pooling for Pakistani students to slash customs and courier costs.
            </p>
            <Link href="/services#pcb-fabrication" className="text-xs text-black dark:text-white inline-flex items-center gap-1 hover:underline pt-1 font-medium">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-xs">
            <Box className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">3D CAD Modeling</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              SolidWorks & Fusion 360 housings, custom brackets, and robotics chassis.
            </p>
            <Link href="/services#cad-modeling" className="text-xs text-black dark:text-white inline-flex items-center gap-1 hover:underline pt-1 font-medium">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-xs">
            <Printer className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">Rapid 3D Printing</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Precision PETG, PLA+, ABS, and UV Resin printing with brass inserts.
            </p>
            <Link href="/services#3d-printing" className="text-xs text-black dark:text-white inline-flex items-center gap-1 hover:underline pt-1 font-medium">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Live Estimator Component */}
        <QuoteEstimator />
      </section>

      {/* 4. CAMPUS NETWORK */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pt-8 border-t border-neutral-200/70 dark:border-neutral-800/70">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
              // UNIVERSITY HUBS
            </span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Covering 20+ Pakistani Engineering Universities
            </h2>
          </div>

          <Link href="/universities" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">
            View All Campuses →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {PAKISTANI_UNIVERSITIES.slice(0, 6).map((uni) => (
            <Link
              key={uni.id}
              href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
              className="p-3.5 bg-white dark:bg-[#121215] hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-2xl transition-all block space-y-1 shadow-xs"
            >
              <span className="font-semibold text-black dark:text-white block">{uni.shortName}</span>
              <span className="text-[11px] text-neutral-500 block truncate">{uni.city}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
