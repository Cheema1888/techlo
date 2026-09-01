"use client";

import React from "react";
import Link from "next/link";
import { QuoteEstimator } from "@/components/services/QuoteEstimator";
import {
  Layers,
  Cpu,
  Box,
  Printer,
  ArrowRight,
  Check,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 text-[11px] font-mono uppercase tracking-widest inline-block">
          // PROTOTYPING & FABRICATION SERVICES
        </span>

        <h1 className="text-3xl sm:text-5xl font-mono font-bold text-white tracking-tight">
          PCB Design, Fabrication & 3D CAD
        </h1>

        <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          On-demand hardware engineering services for university students, robotics labs, and makers in Pakistan. Fast turnarounds, verified quality, and student rates.
        </p>

        <div className="pt-2">
          <Link
            href="/services/request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-mono-sm transition-all font-mono"
          >
            <FileText className="w-4 h-4" />
            <span>Request Official Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4 Core Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PCB Design */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-3">
          <Cpu className="w-6 h-6 text-white" />
          <h3 className="text-base font-bold text-white">PCB Design & Layout</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Schematic capture, high-speed routing, RF & impedance matching in <strong>KiCad</strong> and <strong>Altium Designer</strong>.
          </p>
          <ul className="text-[11px] text-neutral-500 space-y-1 font-mono pt-2 border-t border-neutral-800">
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> 2, 4, 6 Layer Stackups
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> DRC & Gerber Generation
            </li>
          </ul>
        </div>

        {/* PCB Fabrication */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-3">
          <Layers className="w-6 h-6 text-white" />
          <h3 className="text-base font-bold text-white">PCB Batch Fabrication</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Consolidated batch orders pooled across Pakistani universities to slash international shipping & customs.
          </p>
          <ul className="text-[11px] text-neutral-500 space-y-1 font-mono pt-2 border-t border-neutral-800">
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> 5 to 50+ Board Batches
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> Matte Black / White / Green
            </li>
          </ul>
        </div>

        {/* 3D CAD Modeling */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-3">
          <Box className="w-6 h-6 text-white" />
          <h3 className="text-base font-bold text-white">3D CAD Modeling</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Precision housings, snap-fit casings, and robotics arms in <strong>SolidWorks & Fusion 360</strong>.
          </p>
          <ul className="text-[11px] text-neutral-500 space-y-1 font-mono pt-2 border-t border-neutral-800">
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> `.STEP`, `.STL` & Drawings
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> Brass Insert Tolerancing
            </li>
          </ul>
        </div>

        {/* 3D Printing */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 transition-all space-y-3">
          <Printer className="w-6 h-6 text-white" />
          <h3 className="text-base font-bold text-white">Rapid 3D Printing</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Industrial FDM and SLA Resin printing with PETG, PLA+, ABS, and UV Resin at 0.12mm - 0.20mm resolution.
          </p>
          <ul className="text-[11px] text-neutral-500 space-y-1 font-mono pt-2 border-t border-neutral-800">
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> 24-48h Rapid Delivery
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <Check className="w-3.5 h-3.5" /> High Impact Resistance
            </li>
          </ul>
        </div>
      </section>

      {/* Interactive Quotation Calculator Section */}
      <section className="space-y-4">
        <QuoteEstimator />
      </section>
    </div>
  );
}
