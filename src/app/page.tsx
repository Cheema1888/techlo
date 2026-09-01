"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { TechloLogo } from "@/components/branding/TechloLogo";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { QuoteEstimator } from "@/components/services/QuoteEstimator";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import { ComponentCategory } from "@/lib/types";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  PlusCircle,
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  Box,
  Printer,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react";

export default function HomePage() {
  const { products, openAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroSearch, setHeroSearch] = useState("");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Items", icon: Sparkles },
    { id: "microcontrollers", label: "Microcontrollers (ESP32/STM32)", icon: Cpu },
    { id: "sensors", label: "Sensors & IMUs", icon: Zap },
    { id: "motors_actuators", label: "Motors & Drivers", icon: Box },
    { id: "power_bms", label: "LiPo & BMS Power", icon: Zap },
    { id: "development_boards", label: "Raspberry Pi & FPGAs", icon: Cpu },
    { id: "test_tools", label: "Lab Tools & Debuggers", icon: Layers },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-techlo-border/60">
        {/* Glow Ambient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-techlo-cyan/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-techlo-surface border border-techlo-cyan/40 text-xs font-semibold text-techlo-sky shadow-glow-cyan">
              <span className="w-2 h-2 rounded-full bg-techlo-cyan animate-pulse" />
              <span>🇵🇰 Pakistan&apos;s #1 Student Hardware & Prototyping Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-[1.15]">
              Don&apos;t Let Expensive Hardware Gather Dust.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-techlo-cyan via-techlo-sky to-blue-400">
                Buy, Sell & Fabricate.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              <strong>TECHLO</strong> (a product of arix) connects engineering students across <strong>NUST, FAST, UET, GIKI, NED</strong> & 20+ universities to trade affordable FYP components and order custom <strong>PCB Design, Fabrication & 3D CAD Printing</strong>.
            </p>

            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearch.trim()) {
                    window.location.href = `/marketplace?search=${encodeURIComponent(heroSearch)}`;
                  }
                }}
                className="relative flex items-center p-1.5 bg-techlo-surface/90 border-2 border-techlo-border hover:border-techlo-cyan/70 focus-within:border-techlo-cyan rounded-2xl shadow-2xl transition-all"
              >
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search ESP32, STM32 BlackPill, LiDAR, LiPo 3S, Stepper Motor, Altium PCB..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-glow-cyan transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/marketplace"
                className="px-6 py-3.5 rounded-xl bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-black text-sm shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Browse Hardware Market</span>
              </Link>

              <Link
                href="/sell"
                className="px-6 py-3.5 rounded-xl bg-techlo-surface hover:bg-techlo-border border border-techlo-border text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-techlo-cyan" />
                <span>Post Your Spare Hardware</span>
              </Link>

              <Link
                href="/services/request"
                className="px-6 py-3.5 rounded-xl bg-techlo-card hover:bg-techlo-surface border border-techlo-cyan/40 text-techlo-sky font-bold text-sm transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Order Custom PCB / 3D CAD</span>
              </Link>
            </div>

            {/* Key Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-techlo-border/60 max-w-4xl mx-auto">
              <div className="p-3 bg-techlo-surface/40 rounded-2xl border border-techlo-border/60">
                <span className="block font-mono text-2xl font-black text-techlo-sky">Rs. 4.8M+</span>
                <span className="text-[11px] text-slate-400 font-medium">Saved by Pakistani Students</span>
              </div>
              <div className="p-3 bg-techlo-surface/40 rounded-2xl border border-techlo-border/60">
                <span className="block font-mono text-2xl font-black text-emerald-400">25+</span>
                <span className="text-[11px] text-slate-400 font-medium">Engineering Campuses</span>
              </div>
              <div className="p-3 bg-techlo-surface/40 rounded-2xl border border-techlo-border/60">
                <span className="block font-mono text-2xl font-black text-purple-400">100%</span>
                <span className="text-[11px] text-slate-400 font-medium">Phone OTP Verified Sellers</span>
              </div>
              <div className="p-3 bg-techlo-surface/40 rounded-2xl border border-techlo-border/60">
                <span className="block font-mono text-2xl font-black text-amber-400">48 Hours</span>
                <span className="text-[11px] text-slate-400 font-medium">Rapid PCB / 3D Print SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-techlo-cyan uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Campus Hardware Exchange</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Featured Components Ready for Campus Pickup
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tested microcontrollers, sensors, modules, and lab instruments listed by fellow students.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-techlo-cyan hover:text-techlo-sky transition-colors"
          >
            <span>View All {products.length}+ Items</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-techlo-cyan text-techlo-dark shadow-glow-cyan"
                    : "bg-techlo-surface border border-techlo-border text-slate-300 hover:border-slate-500"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Sell Banner Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-techlo-surface via-techlo-card to-techlo-surface border border-techlo-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              💰 Turn Project Leftovers into PKR
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Finished your semester or FYP?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Don&apos;t store your Arduino, ESP32, sensors, or motor drivers in a hostel drawer. List them in 60 seconds and sell directly to students in your campus.
            </p>
          </div>

          <Link
            href="/sell"
            className="px-6 py-3.5 bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-black text-sm rounded-xl shadow-glow-cyan flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Item for Free</span>
          </Link>
        </div>
      </section>

      {/* 3. ENGINEERING SERVICES & ON-DEMAND PROTOTYPING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>On-Demand Prototyping Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            PCB Designing, Batch Fabrication & 3D CAD
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Need a professional 2/4 layer PCB layout, consolidated batch fabrication, custom SolidWorks 3D CAD enclosure, or 3D printing for your robotics or FYP project?
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">PCB Design & Layout</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Schematic capture, high-speed routing, RF & impedance matching in <strong>KiCad & Altium Designer</strong>.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>✓ 2, 4, 6 Layer Stackups</li>
              <li>✓ DRC & Manufacturing Files</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-techlo-sky flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">PCB Fabrication Assistance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Group fabrication pooling for Pakistani students. Matte Black, Green, Blue solder mask with HASL/ENIG.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>✓ 5 to 50+ Board Batches</li>
              <li>✓ Rapid Customs Clearance</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">3D CAD Modeling</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Custom housings, robotic arms, drone frames, and snap-fit sensor enclosures in <strong>SolidWorks & Fusion 360</strong>.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>✓ `.STEP`, `.STL` & 2D Drawings</li>
              <li>✓ Toleranced for 3D Printing</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Rapid 3D Printing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              High precision FDM and SLA Resin printing using PETG, PLA+, ABS, and UV Resin at 0.12-0.20mm layer height.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>✓ Brass Threaded Inserts</li>
              <li>✓ 24-48h Fast Delivery</li>
            </ul>
          </div>
        </div>

        {/* Live Interactive Quote Estimator Widget */}
        <QuoteEstimator />
      </section>

      {/* 4. PAKISTANI CAMPUS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Campus Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Active Hardware Hubs Across Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore hardware inventory and student sellers at your university campus.
            </p>
          </div>

          <Link
            href="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-techlo-cyan hover:text-techlo-sky"
          >
            <span>View All Campuses</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAKISTANI_UNIVERSITIES.slice(0, 6).map((uni) => (
            <Link
              key={uni.id}
              href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
              className="p-5 rounded-2xl bg-techlo-surface hover:bg-techlo-card border border-techlo-border hover:border-techlo-cyan/60 transition-all flex items-start justify-between group"
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-techlo-cyan/15 text-techlo-cyan font-bold text-[11px] font-mono">
                  {uni.shortName}
                </span>
                <h3 className="font-bold text-white text-sm group-hover:text-techlo-sky transition-colors">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-techlo-cyan" />
                  {uni.city}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {uni.programs.slice(0, 2).map((p, idx) => (
                    <span key={idx} className="text-[10px] text-slate-400 bg-techlo-dark px-2 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-techlo-cyan group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW TECHLO WORKS (SECURITY & TRUST) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 lg:p-12 rounded-3xl bg-techlo-dark border border-techlo-border space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              Built Specifically for Pakistani Engineering Students
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Safe, fast, transparent peer-to-peer exchange with phone verification and campus handoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-techlo-surface/50 border border-techlo-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-techlo-cyan/15 text-techlo-cyan flex items-center justify-center font-mono font-bold text-base">
                01
              </div>
              <h3 className="font-bold text-white text-base">Phone OTP & Edu Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every seller is verified via SMS OTP to eliminate spam and scalpers. University `.edu.pk` badges provide 100% peer trust.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-techlo-surface/50 border border-techlo-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-techlo-sky/15 text-techlo-sky flex items-center justify-center font-mono font-bold text-base">
                02
              </div>
              <h3 className="font-bold text-white text-base">Direct Campus Meetups & WhatsApp</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect the microcontroller or sensor live in your university lab before paying, or ship via Leopard/TCS across cities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-techlo-surface/50 border border-techlo-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-mono font-bold text-base">
                03
              </div>
              <h3 className="font-bold text-white text-base">Custom Prototyping Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Can&apos;t find standard parts? Order custom KiCad PCB designs, batch fabrication, and 3D printed enclosures in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
