"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPKR } from "@/lib/utils";
import {
  Layers,
  Box,
  Cpu,
  Printer,
  ArrowRight,
  Clock,
  Check,
} from "lucide-react";

interface QuoteEstimatorProps {
  onApplyEstimate?: (serviceType: string, calculatedAmount: number, details: any) => void;
}

export const QuoteEstimator: React.FC<QuoteEstimatorProps> = ({ onApplyEstimate }) => {
  const [activeTab, setActiveTab] = useState<"pcb_design" | "pcb_fab" | "cad_model" | "3d_print">("pcb_design");

  // PCB Design state
  const [pcbLayers, setPcbLayers] = useState<number>(2);
  const [complexity, setComplexity] = useState<"simple" | "medium" | "advanced">("medium");

  // PCB Fabrication state
  const [fabQty, setFabQty] = useState<number>(5);
  const [fabLayers, setFabLayers] = useState<number>(2);
  const [color, setColor] = useState<string>("Matte Black");

  // CAD Modeling state
  const [cadScope, setCadScope] = useState<"enclosure" | "robot_part" | "complex_assembly">("enclosure");

  // 3D Print Calculator state
  const [material, setMaterial] = useState<"PLA" | "PETG" | "ABS" | "Resin">("PLA");
  const [weightGrams, setWeightGrams] = useState<number>(60);
  const [infill, setInfill] = useState<number>(30);
  const [layerHeight, setLayerHeight] = useState<"0.2mm" | "0.12mm">("0.2mm");

  // Calculations
  const calculatePCBDesign = () => {
    const base = pcbLayers === 2 ? 3800 : pcbLayers === 4 ? 7200 : 11500;
    const mult = complexity === "simple" ? 0.8 : complexity === "medium" ? 1.0 : 1.45;
    return Math.round(base * mult);
  };

  const calculatePCBFab = () => {
    const base = fabLayers === 2 ? 2600 : 5200;
    const qtyMult = fabQty === 5 ? 1 : fabQty === 10 ? 1.35 : 2.4;
    return Math.round(base * qtyMult);
  };

  const calculateCAD = () => {
    return cadScope === "enclosure" ? 3200 : cadScope === "robot_part" ? 4500 : 7500;
  };

  const calculate3DPrint = () => {
    const ratePerGram = material === "PLA" ? 14 : material === "PETG" ? 18 : material === "ABS" ? 22 : 30;
    const precisionMultiplier = layerHeight === "0.12mm" ? 1.25 : 1.0;
    const infillAdjustment = 1 + (infill - 20) * 0.005;
    const baseCost = weightGrams * ratePerGram * precisionMultiplier * infillAdjustment;
    return Math.round(Math.max(400, baseCost));
  };

  const getEstimatedCost = () => {
    switch (activeTab) {
      case "pcb_design":
        return calculatePCBDesign();
      case "pcb_fab":
        return calculatePCBFab();
      case "cad_model":
        return calculateCAD();
      case "3d_print":
        return calculate3DPrint();
    }
  };

  const currentEstimatedPrice = getEstimatedCost();

  return (
    <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-0.5">
            // PRICING ESTIMATOR
          </span>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Prototyping Cost Calculator
          </h3>
        </div>

        {/* Tab Selectors (Pi.dev clean pill cluster) */}
        <div className="flex bg-neutral-100/70 dark:bg-neutral-900/60 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60 overflow-x-auto scrollbar-none">
          {[
            { id: "pcb_design", label: "PCB Design", icon: Cpu },
            { id: "pcb_fab", label: "Fabrication", icon: Layers },
            { id: "cad_model", label: "3D CAD", icon: Box },
            { id: "3d_print", label: "3D Print", icon: Printer },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-white dark:bg-neutral-800 text-black dark:text-white font-semibold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* PCB Design Tab */}
          {activeTab === "pcb_design" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase font-medium">Layer Count</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 4, 6].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setPcbLayers(l)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        pcbLayers === l
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                          : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                      }`}
                    >
                      {l} Layers
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase font-medium">Design Scope</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "simple", name: "Standard", desc: "Sensors & Relays" },
                    { id: "medium", name: "Embedded", desc: "ESP32 / MCU" },
                    { id: "advanced", name: "High Speed", desc: "RF / Differential" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setComplexity(c.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        complexity === c.id
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                          : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                      }`}
                    >
                      <div className="text-xs font-semibold">{c.name}</div>
                      <div className={`text-[10px] mt-0.5 ${complexity === c.id ? "text-neutral-300 dark:text-neutral-700" : "text-neutral-500"}`}>
                        {c.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PCB Fab Tab */}
          {activeTab === "pcb_fab" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase font-medium">Batch Quantity</label>
                <select
                  value={fabQty}
                  onChange={(e) => setFabQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs cursor-pointer focus:outline-none"
                >
                  <option value={5}>5 Pieces (Standard Prototype)</option>
                  <option value={10}>10 Pieces</option>
                  <option value={30}>30 Pieces (Consolidated Batch)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase font-medium">Solder Mask Finish</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs cursor-pointer focus:outline-none"
                >
                  <option value="Matte Black">Matte Black (Engineering)</option>
                  <option value="White">Gloss White</option>
                  <option value="Classic Green">Classic Green</option>
                  <option value="Blue">Precision Blue</option>
                </select>
              </div>
            </div>
          )}

          {/* CAD Model Tab */}
          {activeTab === "cad_model" && (
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase font-medium">CAD Project Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "enclosure", name: "Custom Enclosure", desc: "Snap-fit / Screwed Box" },
                  { id: "robot_part", name: "Robotic Bracket", desc: "Gears & Motor Mounts" },
                  { id: "complex_assembly", name: "Full Assembly", desc: "Multi-Part System" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCadScope(s.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      cadScope === s.id
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                    }`}
                  >
                    <div className="text-xs font-semibold">{s.name}</div>
                    <div className={`text-[10px] mt-0.5 ${cadScope === s.id ? "text-neutral-300 dark:text-neutral-700" : "text-neutral-500"}`}>
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3D Print Tab */}
          {activeTab === "3d_print" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase font-medium">Material</label>
                <div className="grid grid-cols-4 gap-2">
                  {["PLA", "PETG", "ABS", "Resin"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMaterial(m as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        material === m
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                          : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Estimated Weight</span>
                  <span className="text-black dark:text-white font-semibold">{weightGrams}g</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(Number(e.target.value))}
                  className="w-full accent-black dark:accent-white cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
              Estimated Total (PKR)
            </span>
            <div className="text-3xl font-bold text-black dark:text-white tracking-tight">
              {formatPKR(currentEstimatedPrice)}
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4 font-sans">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Turnaround: <strong>2 - 3 Days</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Includes Design Review & DRC Check</span>
            </div>
          </div>

          <Link
            href="/services/request"
            className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-xl shadow-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Request Official Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
