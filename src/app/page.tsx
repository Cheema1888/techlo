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
  ShieldCheck,
  ArrowRight,
  Plus,
  Search,
  MapPin,
  Box,
  Printer,
  ChevronRight,
  FileText,
  Check,
  ArrowUpRight,
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
    <div className="space-y-20 pb-20 bg-dot-grid">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-[#0c0c0c] text-[11px] font-mono text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>TECHLO • HARDWARE PROTOTYPING & EXCHANGE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-white tracking-tight leading-[1.15]">
              PCB Design, 3D CAD & Hardware Exchange
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Order on-demand <strong>PCB Designing, Consolidated Fabrication & 3D CAD Enclosures</strong> or trade spare development boards and sensors across Pakistani university campuses.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
              <Link
                href="/services/request"
                className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-mono-sm transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Request Service Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/services"
                className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Explore Services</span>
              </Link>

              <Link
                href="/marketplace"
                className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                <span>Browse Marketplace</span>
              </Link>
            </div>

            {/* Specs / Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 border-t border-neutral-800 max-w-3xl mx-auto font-mono text-left">
              <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800">
                <span className="block text-xl font-bold text-white">48 Hours</span>
                <span className="text-[10px] text-neutral-500">Fabrication SLA</span>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800">
                <span className="block text-xl font-bold text-white">25+</span>
                <span className="text-[10px] text-neutral-500">Campus Hubs</span>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800">
                <span className="block text-xl font-bold text-white">100%</span>
                <span className="text-[10px] text-neutral-500">Phone Verified</span>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800">
                <span className="block text-xl font-bold text-white">0.12mm</span>
                <span className="text-[10px] text-neutral-500">3D Print Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED PROTOTYPING & SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // ON-DEMAND PROTOTYPING
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              Engineering Services & Quote Request
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Upload your schematics, Gerbers, or 3D CAD dimensions for rapid prototyping.
            </p>
          </div>

          <Link
            href="/services/request"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono shadow-mono-sm"
          >
            <span>Request Quote Directly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-2.5">
            <Cpu className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white text-sm">PCB Design (KiCad/Altium)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              2, 4, 6 layer routing, high-speed differential pairs, and DRC validation.
            </p>
            <Link href="/services#pcb-design" className="text-[11px] text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Learn more <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-2.5">
            <Layers className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white text-sm">PCB Batch Fabrication</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Consolidated batch pooling for Pakistani students to slash customs and courier costs.
            </p>
            <Link href="/services#pcb-fabrication" className="text-[11px] text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Learn more <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-2.5">
            <Box className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white text-sm">3D CAD Modeling</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              SolidWorks & Fusion 360 housings, custom brackets, and robotics chassis.
            </p>
            <Link href="/services#cad-modeling" className="text-[11px] text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Learn more <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-2.5">
            <Printer className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white text-sm">Rapid 3D Printing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Precision PETG, PLA+, ABS, and UV Resin printing with brass inserts.
            </p>
            <Link href="/services#3d-printing" className="text-[11px] text-neutral-300 font-mono inline-flex items-center gap-1 hover:underline pt-1">
              Learn more <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Live Estimator Component */}
        <QuoteEstimator />
      </section>

      {/* 3. HARDWARE MARKETPLACE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // CAMPUS HARDWARE EXCHANGE
            </span>
            <h2 className="text-2xl font-mono font-bold text-white tracking-tight">
              Spare Components from Fellow Students
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tested microcontrollers, sensors, motors, and lab tools available for campus handoff.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="text-xs font-mono font-bold text-white hover:underline inline-flex items-center gap-1"
          >
            <span>Browse All {products.length}+ Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-mono-sm"
                    : "bg-[#111111] border border-neutral-800 text-neutral-400 hover:text-white"
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
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Have spare hardware from your last project?</h3>
            <p className="text-xs text-neutral-400">
              List your ESP32, sensors, and motors for free and sell directly to students in your campus.
            </p>
          </div>

          <Link
            href="/sell"
            className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-mono-sm whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Component (Free)</span>
          </Link>
        </div>
      </section>

      {/* 4. CAMPUS NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              // UNIVERSITY HUBS
            </span>
            <h2 className="text-xl font-mono font-bold text-white">
              Covering 20+ Engineering Institutions
            </h2>
          </div>

          <Link href="/universities" className="text-xs font-mono text-neutral-400 hover:text-white">
            View All Campuses →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          {PAKISTANI_UNIVERSITIES.slice(0, 6).map((uni) => (
            <Link
              key={uni.id}
              href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
              className="p-3 bg-[#0a0a0a] hover:bg-[#121212] border border-neutral-800 hover:border-neutral-600 rounded-xl transition-all block space-y-1"
            >
              <span className="font-bold text-white block">{uni.shortName}</span>
              <span className="text-[10px] text-neutral-500 block truncate">{uni.city}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
