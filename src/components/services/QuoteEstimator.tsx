"use client";

import React, { useState } from "react";
import { formatPKR } from "@/lib/utils";
import {
  Layers,
  Box,
  Cpu,
  Printer,
  Sparkles,
  Calculator,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";

interface QuoteEstimatorProps {
  onApplyEstimate?: (serviceType: string, calculatedAmount: number, details: any) => void;
}

export const QuoteEstimator: React.FC<QuoteEstimatorProps> = ({ onApplyEstimate }) => {
  const [activeTab, setActiveTab] = useState<"3d_print" | "pcb_design" | "pcb_fab" | "cad_model">("3d_print");

  // 3D Print Calculator state
  const [material, setMaterial] = useState<"PLA" | "PETG" | "ABS" | "Resin">("PLA");
  const [weightGrams, setWeightGrams] = useState<number>(65);
  const [infill, setInfill] = useState<number>(30);
  const [layerHeight, setLayerHeight] = useState<"0.2mm" | "0.12mm">("0.2mm");

  // PCB Design state
  const [pcbLayers, setPcbLayers] = useState<number>(2);
  const [complexity, setComplexity] = useState<"simple" | "medium" | "advanced">("medium");

  // PCB Fabrication state
  const [fabQty, setFabQty] = useState<number>(5);
  const [fabLayers, setFabLayers] = useState<number>(2);
  const [color, setColor] = useState<string>("Matte Black");

  // CAD Modeling state
  const [cadScope, setCadScope] = useState<"enclosure" | "robot_part" | "complex_assembly">("enclosure");

  // Calculate 3D Print Cost
  const calculate3DPrint = () => {
    const ratePerGram = material === "PLA" ? 14 : material === "PETG" ? 18 : material === "ABS" ? 22 : 32;
    const precisionMultiplier = layerHeight === "0.12mm" ? 1.25 : 1.0;
    const infillAdjustment = 1 + (infill - 20) * 0.005;
    const baseCost = weightGrams * ratePerGram * precisionMultiplier * infillAdjustment;
    return Math.round(Math.max(450, baseCost));
  };

  // Calculate PCB Design Cost
  const calculatePCBDesign = () => {
    const base = pcbLayers === 2 ? 4000 : pcbLayers === 4 ? 7500 : 12000;
    const mult = complexity === "simple" ? 0.75 : complexity === "medium" ? 1.0 : 1.5;
    return Math.round(base * mult);
  };

  // Calculate PCB Fab Cost
  const calculatePCBFab = () => {
    const base = fabLayers === 2 ? 2800 : 5400;
    const qtyMult = fabQty === 5 ? 1 : fabQty === 10 ? 1.4 : 2.5;
    return Math.round(base * qtyMult);
  };

  // Calculate CAD Modeling
  const calculateCAD = () => {
    return cadScope === "enclosure" ? 3500 : cadScope === "robot_part" ? 4800 : 7800;
  };

  const getEstimatedCost = () => {
    switch (activeTab) {
      case "3d_print":
        return calculate3DPrint();
      case "pcb_design":
        return calculatePCBDesign();
      case "pcb_fab":
        return calculatePCBFab();
      case "cad_model":
        return calculateCAD();
    }
  };

  const currentEstimatedPrice = getEstimatedCost();

  return (
    <div className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-techlo-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan text-xs font-bold mb-1">
            <Calculator className="w-3.5 h-3.5" />
            Instant Engineering Cost Estimator
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Calculate Prototyping & Fabrication Cost
          </h3>
        </div>

        {/* Tab Selectors */}
        <div className="flex bg-techlo-surface p-1 rounded-xl border border-techlo-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("3d_print")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === "3d_print"
                ? "bg-techlo-cyan text-techlo-dark shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>3D Printing</span>
          </button>

          <button
            onClick={() => setActiveTab("pcb_design")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === "pcb_design"
                ? "bg-techlo-cyan text-techlo-dark shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>PCB Design</span>
          </button>

          <button
            onClick={() => setActiveTab("pcb_fab")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === "pcb_fab"
                ? "bg-techlo-cyan text-techlo-dark shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PCB Fabrication</span>
          </button>

          <button
            onClick={() => setActiveTab("cad_model")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === "cad_model"
                ? "bg-techlo-cyan text-techlo-dark shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D CAD Design</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Controls Column (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {activeTab === "3d_print" && (
            <div className="space-y-4">
              {/* Material Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Material Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "PLA", name: "PLA+ Standard", desc: "General Enclosures" },
                    { id: "PETG", name: "PETG Tough", desc: "High Heat & Impact" },
                    { id: "ABS", name: "ABS Engineering", desc: "Durable & Sandable" },
                    { id: "Resin", name: "SLA Resin", desc: "Ultra Smooth 0.05mm" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        material === m.id
                          ? "bg-techlo-cyan/15 border-techlo-cyan text-white shadow-glow-cyan"
                          : "bg-techlo-surface border-techlo-border text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Estimated Part Weight</span>
                  <span className="text-techlo-sky font-mono">{weightGrams} grams</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="350"
                  step="5"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(Number(e.target.value))}
                  className="w-full accent-techlo-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Small bracket (~15g)</span>
                  <span>Standard Enclosure (~65g)</span>
                  <span>Heavy Chassis (~250g+)</span>
                </div>
              </div>

              {/* Infill & Layer Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Internal Infill</span>
                    <span className="text-techlo-sky font-mono">{infill}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="w-full accent-techlo-cyan cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    20-30% recommended for FYP electronic boxes
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300 block">Layer Resolution</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLayerHeight("0.2mm")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer ${
                        layerHeight === "0.2mm"
                          ? "bg-techlo-cyan/15 border-techlo-cyan text-white"
                          : "bg-techlo-surface border-techlo-border text-slate-400"
                      }`}
                    >
                      0.20mm (Fast/Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayerHeight("0.12mm")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-center cursor-pointer ${
                        layerHeight === "0.12mm"
                          ? "bg-techlo-cyan/15 border-techlo-cyan text-white"
                          : "bg-techlo-surface border-techlo-border text-slate-400"
                      }`}
                    >
                      0.12mm (Fine Detail)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pcb_design" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">PCB Layer Count</label>
                <div className="grid grid-cols-3 gap-3">
                  {[2, 4, 6].map((layers) => (
                    <button
                      key={layers}
                      type="button"
                      onClick={() => setPcbLayers(layers)}
                      className={`p-3 rounded-xl border text-center font-bold text-sm cursor-pointer transition-all ${
                        pcbLayers === layers
                          ? "bg-techlo-cyan/15 border-techlo-cyan text-techlo-sky shadow-glow-cyan"
                          : "bg-techlo-surface border-techlo-border text-slate-300"
                      }`}
                    >
                      {layers} Layers
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Design Complexity</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "simple", name: "Simple", desc: "Basic Sensors / Relays" },
                    { id: "medium", name: "Medium", desc: "ESP32/STM32 + Power" },
                    { id: "advanced", name: "High Speed", desc: "DDR/RF/Impedance" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setComplexity(c.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        complexity === c.id
                          ? "bg-techlo-cyan/15 border-techlo-cyan text-white shadow-glow-cyan"
                          : "bg-techlo-surface border-techlo-border text-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "pcb_fab" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Quantity (Pieces)</label>
                  <select
                    value={fabQty}
                    onChange={(e) => setFabQty(Number(e.target.value))}
                    className="w-full p-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                  >
                    <option value={5}>5 Pieces (Standard Prototype)</option>
                    <option value={10}>10 Pieces</option>
                    <option value={30}>30 Pieces (Batch / Class)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Solder Mask Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                  >
                    <option value="Matte Black">Matte Black (Sleek)</option>
                    <option value="Green">Classic Green</option>
                    <option value="Blue">Tech Blue</option>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cad_model" && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300">CAD Model Scope</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "enclosure", name: "Custom Enclosure", desc: "Snap-fit / Screwed Box" },
                  { id: "robot_part", name: "Robotic Chassis / Arm", desc: "Gears, Motor Mounts" },
                  { id: "complex_assembly", name: "Multi-Part Assembly", desc: "Full Drone / Robot" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCadScope(s.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      cadScope === s.id
                        ? "bg-techlo-cyan/15 border-techlo-cyan text-white shadow-glow-cyan"
                        : "bg-techlo-surface border-techlo-border text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Estimate Card (1 col) */}
        <div className="bg-techlo-surface/90 border border-techlo-border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Total
            </span>
            <div className="font-mono text-3xl font-black text-techlo-sky tracking-tight">
              {formatPKR(currentEstimatedPrice)}
            </div>

            <div className="space-y-2 pt-3 border-t border-techlo-border/60 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-techlo-cyan" />
                <span>Turnaround: <strong>2 - 4 Business Days</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Includes Design DRC & Print Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-techlo-sky" />
                <span>Campus Delivery Available</span>
              </div>
            </div>
          </div>

          <a
            href="/services/request"
            className="w-full py-3 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-glow-cyan text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Upload Files & Request</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
