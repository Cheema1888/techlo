"use client";

import React from "react";
import Link from "next/link";
import { QuoteEstimator } from "@/components/services/QuoteEstimator";
import {
  Layers,
  Cpu,
  Box,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code2,
  Wrench,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 lg:space-y-24">
      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-techlo-cyan/15 border border-techlo-cyan/30 text-techlo-cyan text-xs font-bold shadow-glow-cyan">
          <Layers className="w-3.5 h-3.5" />
          <span>TECHLO Engineering & Prototyping Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
          From Concept to Hardware:{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-techlo-cyan via-techlo-sky to-blue-400">
            PCB Design, Fabrication & 3D CAD
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Custom engineering prototyping designed specifically for Pakistani university students, robotics teams, and FYP groups. Fast turnaround, low student-friendly pricing, and verified quality.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/services/request"
            className="px-6 py-3.5 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-glow-cyan flex items-center gap-2"
          >
            <span>Request Instant Quote & Upload Files</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Detailed Services Breakdown */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
            Our Prototyping Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered by experienced senior hardware designers using industry standard toolchains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service 1: PCB Design */}
          <div id="pcb-design" className="p-8 bg-techlo-dark border border-techlo-border rounded-3xl space-y-4 hover:border-techlo-cyan transition-all">
            <div className="w-12 h-12 rounded-2xl bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Custom PCB Design & Schematic Review</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We design production-ready 2-layer and 4-layer boards in <strong>KiCad</strong> and <strong>Altium Designer</strong>. We handle component library management, footprint creation, impedance-matched differential pairs for USB/RF, and DRC validation.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-techlo-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-cyan" />
                <span>Schematic capture & Design Rule Check (DRC)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-cyan" />
                <span>Gerber file generation & Bill of Materials (BOM)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-cyan" />
                <span>3D STEP model export for mechanical CAD fitting</span>
              </li>
            </ul>
          </div>

          {/* Service 2: PCB Fabrication */}
          <div id="pcb-fabrication" className="p-8 bg-techlo-dark border border-techlo-border rounded-3xl space-y-4 hover:border-techlo-cyan transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-techlo-sky flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Consolidated PCB Fabrication Batching</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don&apos;t pay heavy individual international shipping and customs for 5 boards! TECHLO batches student board orders across Pakistani campuses every week, cutting import costs by up to 60%.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-techlo-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-sky" />
                <span>FR-4 TG130-140 standard quality (1.6mm thickness)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-sky" />
                <span>Choice of Matte Black, Green, Blue, Red solder mask</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-techlo-sky" />
                <span>Hassle-free local TCS/Leopard delivery to your hostel</span>
              </li>
            </ul>
          </div>

          {/* Service 3: 3D CAD Modeling */}
          <div id="cad-modeling" className="p-8 bg-techlo-dark border border-techlo-border rounded-3xl space-y-4 hover:border-techlo-cyan transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">3D CAD Modeling & Enclosure Engineering</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Turn your circuit board into a professional physical product. We design snap-fit casings, screw-mounted project enclosures, robotic chassis, and drone arms using <strong>SolidWorks & Autodesk Fusion 360</strong>.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-techlo-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Perfect port alignment (USB, DC Jack, LCD windows, buttons)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Support for brass heat-set threaded inserts (M2, M3, M4)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Delivery in `.STEP`, `.STL` and native CAD formats</span>
              </li>
            </ul>
          </div>

          {/* Service 4: Rapid 3D Printing */}
          <div id="3d-printing" className="p-8 bg-techlo-dark border border-techlo-border rounded-3xl space-y-4 hover:border-techlo-cyan transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Rapid 3D Printing Service</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fast industrial FDM and SLA Resin printing on fine-tuned CoreXY 3D printers. High dimensional accuracy with PETG, PLA+, ABS, and UV Resin.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2 border-t border-techlo-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Layer resolution down to 0.12mm (Ultra Fine)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Rigid & Heat resistant PETG / ABS for robotics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>24 - 48 Hours rapid turnaround</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live Calculator Widget */}
      <section className="space-y-6">
        <QuoteEstimator />
      </section>
    </div>
  );
}
