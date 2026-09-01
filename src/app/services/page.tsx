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
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 text-xs font-medium inline-block">
          On-Demand Prototyping & Fabrication
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          PCB Design, Fabrication & 3D CAD
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Hardware engineering services for Pakistani university students, FYP groups, and robotics labs. Rapid turnaround and student-friendly batch pricing.
        </p>

        <div className="pt-2">
          <Link
            href="/services/request"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs shadow-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Request Official Quotation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4 Core Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PCB Design */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-3 shadow-xs">
          <Cpu className="w-5 h-5 text-black dark:text-white" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">PCB Design & Layout</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Schematic capture, high-speed routing, and DRC validation in <strong>KiCad</strong> and <strong>Altium Designer</strong>.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 2, 4, 6 Layer Stackups
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Gerber & Drill Generation
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> BOM Generation (JLCPCB/LCSC)
            </li>
          </ul>
        </div>

        {/* PCB Fabrication */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-3 shadow-xs">
          <Layers className="w-5 h-5 text-black dark:text-white" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Batch Fabrication</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Consolidated batch fabrication pooling for Pakistani students to slash customs and DHL courier fees.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> FR-4 High TG Substrate
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> HASL / ENIG Gold Finish
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Customs Cleared Delivery
            </li>
          </ul>
        </div>

        {/* 3D CAD Modeling */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-3 shadow-xs">
          <Box className="w-5 h-5 text-black dark:text-white" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">3D CAD Modeling</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Custom parametric enclosures, snap-fits, sensor mounts, and robotics mechanisms in <strong>SolidWorks & Fusion 360</strong>.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> STEP / STL Export
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Screw Bosses & Brass Inserts
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 3D Assembly Renders
            </li>
          </ul>
        </div>

        {/* Rapid 3D Printing */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-3 shadow-xs">
          <Printer className="w-5 h-5 text-black dark:text-white" />
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Rapid 3D Printing</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            High precision FDM and UV Resin 3D printing with strong layer adhesion and dimensional accuracy.
          </p>
          <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> PETG, PLA+, ABS & Resin
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 0.12mm - 0.2mm Precision
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 48h Campus Delivery
            </li>
          </ul>
        </div>
      </section>

      {/* Estimator Section */}
      <section className="space-y-4">
        <QuoteEstimator />
      </section>
    </div>
  );
}
