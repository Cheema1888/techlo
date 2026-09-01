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
  MapPin,
  Box,
  Printer,
  ChevronRight,
  FileText,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const { products } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroSearch, setHeroSearch] = useState("");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "microcontrollers", label: "Microcontrollers" },
    { id: "sensors", label: "Sensors & IMUs" },
    { id: "motors_actuators", label: "Motors & Drivers" },
    { id: "power_bms", label: "Power & LiPo" },
    { id: "development_boards", label: "SBCs & FPGAs" },
    { id: "test_tools", label: "Lab Tools" },
  ];

  return (
    <div className="space-y-16 lg:space-y-20 pb-20">
      {/* 1. HERO SECTION (MARKETPLACE FOCUSED) */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#0c0c0c] text-[11px] font-mono text-neutral-800 dark:text-neutral-300 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
              <span>TECHLO • PAKISTAN STUDENT HARDWARE MARKETPLACE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-black dark:text-white tracking-tight leading-[1.12]">
              Buy, Sell & Trade Hardware Components
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Pakistan&apos;s campus exchange for engineering students to trade <strong>ESP32, STM32, sensors, motors, and lab tools</strong> — with on-demand <strong>PCB Design, Fabrication & 3D CAD services</strong>.
            </p>

            {/* Search Input Bar */}
            <div className="max-w-xl mx-auto pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearch.trim()) {
                    window.location.href = `/marketplace?search=${encodeURIComponent(heroSearch)}`;
                  }
                }}
                className="relative flex items-center p-1.5 bg-white dark:bg-[#0e0e0e] border border-neutral-300 dark:border-neutral-800 focus-within:border-black dark:focus-within:border-white rounded-2xl shadow-sm transition-all"
              >
                <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search ESP32, STM32 BlackPill, LiDAR, LiPo 3S, Stepper..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-black dark:text-white text-xs font-mono placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
              <Link
                href="/marketplace"
                className="px-5 py-2.5 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/sell"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sell Hardware Item</span>
              </Link>

              <Link
                href="/services/request"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span>Request PCB/CAD Quote</span>
              </Link>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800 max-w-3xl mx-auto font-mono text-left">
              <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="block text-lg font-bold text-black dark:text-white">Rs. 4.8M+</span>
                <span className="text-[10px] text-neutral-500">Student Savings</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="block text-lg font-bold text-black dark:text-white">25+</span>
                <span className="text-[10px] text-neutral-500">Campus Hubs</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="block text-lg font-bold text-black dark:text-white">100%</span>
                <span className="text-[10px] text-neutral-500">Phone Verified</span>
              </div>
              <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="block text-lg font-bold text-black dark:text-white">48 Hours</span>
                <span className="text-[10px] text-neutral-500">PCB / 3D Print SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN HIGHLIGHT: HARDWARE MARKETPLACE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // CAMPUS HARDWARE INVENTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white tracking-tight">
              Featured Hardware Components
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Tested microcontrollers, sensors, motors, and lab tools listed by students across Pakistan.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="text-xs font-mono font-bold text-black dark:text-white hover:underline inline-flex items-center gap-1"
          >
            <span>Browse All {products.length}+ Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm"
                    : "bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Sell Hardware Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-black dark:text-white">Have spare hardware from your last project?</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              List your ESP32, sensors, and motors for free and sell directly to students in your campus.
            </p>
          </div>

          <Link
            href="/sell"
            className="px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-sm whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Post Hardware Ad</span>
          </Link>
        </div>
      </section>

      {/* 3. PROTOTYPING & ENGINEERING SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // ON-DEMAND PROTOTYPING
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white tracking-tight">
              PCB Designing, Batch Fabrication & 3D CAD
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Custom schematics, multi-layer routing, consolidated PCB batch orders, and 3D printed housings.
            </p>
          </div>

          <Link
            href="/services/request"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs font-mono shadow-sm"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-sm">
            <Cpu className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-bold text-black dark:text-white text-sm">PCB Design (KiCad/Altium)</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              2, 4, 6 layer routing, differential pairs, and DRC validation.
            </p>
            <Link href="/services#pcb-design" className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-sm">
            <Layers className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-bold text-black dark:text-white text-sm">PCB Batch Fabrication</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Consolidated batch pooling for Pakistani students to slash customs and courier costs.
            </p>
            <Link href="/services#pcb-fabrication" className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-sm">
            <Box className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-bold text-black dark:text-white text-sm">3D CAD Modeling</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              SolidWorks & Fusion 360 housings, custom brackets, and robotics chassis.
            </p>
            <Link href="/services#cad-modeling" className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 transition-all space-y-2.5 shadow-sm">
            <Printer className="w-5 h-5 text-black dark:text-white" />
            <h3 className="font-bold text-black dark:text-white text-sm">Rapid 3D Printing</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              Precision PETG, PLA+, ABS, and UV Resin printing with brass inserts.
            </p>
            <Link href="/services#3d-printing" className="text-[11px] text-neutral-700 dark:text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Details <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Live Estimator Component */}
        <QuoteEstimator />
      </section>

      {/* 4. CAMPUS NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // UNIVERSITY HUBS
            </span>
            <h2 className="text-xl font-mono font-bold text-black dark:text-white">
              Covering 20+ Pakistani Engineering Universities
            </h2>
          </div>

          <Link href="/universities" className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">
            View All Campuses →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {PAKISTANI_UNIVERSITIES.slice(0, 6).map((uni) => (
            <Link
              key={uni.id}
              href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
              className="p-3 bg-white dark:bg-[#0a0a0a] hover:bg-neutral-50 dark:hover:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 rounded-xl transition-all block space-y-1 shadow-sm"
            >
              <span className="font-bold text-black dark:text-white block">{uni.shortName}</span>
              <span className="text-[10px] text-neutral-500 block truncate">{uni.city}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
