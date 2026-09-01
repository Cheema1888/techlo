"use client";

import React from "react";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import { getCategoryLabel } from "@/lib/utils";
import { Filter, RotateCcw, ShieldCheck } from "lucide-react";

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  selectedUniversity: string;
  setSelectedUniversity: (uni: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  onReset: () => void;
}

const CATEGORIES: { id: ComponentCategory; label: string }[] = [
  { id: "microcontrollers", label: "Microcontrollers (ESP32/STM32)" },
  { id: "sensors", label: "Sensors & IMUs" },
  { id: "motors_actuators", label: "Motors, Servos & Steppers" },
  { id: "power_bms", label: "Power, LiPo & BMS" },
  { id: "wireless_iot", label: "Wireless, LoRa & IoT" },
  { id: "development_boards", label: "Raspberry Pi & FPGAs" },
  { id: "displays", label: "Displays & OLEDs" },
  { id: "test_tools", label: "Lab Tools & Logic Analyzers" },
  { id: "passives_ics", label: "ICs & Components" },
];

const CONDITIONS: { id: HardwareCondition; label: string }[] = [
  { id: "brand_new", label: "Brand New (Unopened)" },
  { id: "fyp_tested", label: "FYP Tested (100% Working)" },
  { id: "gently_used", label: "Gently Used" },
  { id: "desoldered_working", label: "Desoldered / Functional" },
  { id: "for_parts", label: "For Parts / Salvage" },
];

const CITIES = ["All Cities", "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Topi", "Taxila", "Quetta"];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  selectedUniversity,
  setSelectedUniversity,
  selectedCity,
  setSelectedCity,
  verifiedOnly,
  setVerifiedOnly,
  maxPrice,
  setMaxPrice,
  onReset,
}) => {
  return (
    <aside className="w-full bg-techlo-dark border border-techlo-border rounded-2xl p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-techlo-border/60">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Filter className="w-4 h-4 text-techlo-cyan" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-techlo-sky flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Verified Students Only Toggle */}
      <div className="p-3 bg-techlo-surface/60 border border-techlo-border rounded-xl">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Students Only
          </span>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-techlo-cyan focus:ring-techlo-cyan bg-techlo-dark border-techlo-border cursor-pointer accent-techlo-cyan"
          />
        </label>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Component Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-techlo-cyan text-techlo-dark font-bold shadow-sm"
                : "text-slate-300 hover:bg-techlo-surface"
            }`}
          >
            All Components
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer truncate ${
                selectedCategory === cat.id
                  ? "bg-techlo-cyan text-techlo-dark font-bold shadow-sm"
                  : "text-slate-300 hover:bg-techlo-surface"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div className="space-y-2 pt-3 border-t border-techlo-border/60">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Hardware Condition
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCondition("all")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedCondition === "all"
                ? "bg-techlo-surface text-techlo-cyan font-bold border border-techlo-cyan/40"
                : "text-slate-300 hover:bg-techlo-surface"
            }`}
          >
            Any Condition
          </button>
          {CONDITIONS.map((cond) => (
            <button
              key={cond.id}
              onClick={() => setSelectedCondition(cond.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedCondition === cond.id
                  ? "bg-techlo-surface text-techlo-cyan font-bold border border-techlo-cyan/40"
                  : "text-slate-300 hover:bg-techlo-surface"
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* University Campus Filter */}
      <div className="space-y-2 pt-3 border-t border-techlo-border/60">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          University / Campus
        </h4>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full px-3 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-xs text-white focus:border-techlo-cyan focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-techlo-dark">All Pakistani Universities</option>
          {PAKISTANI_UNIVERSITIES.map((uni) => (
            <option key={uni.id} value={uni.shortName} className="bg-techlo-dark">
              {uni.shortName} - {uni.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="space-y-2 pt-3 border-t border-techlo-border/60">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          City Location
        </h4>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-xs text-white focus:border-techlo-cyan focus:outline-none cursor-pointer"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === "All Cities" ? "all" : c} className="bg-techlo-dark">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2 pt-3 border-t border-techlo-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase">Max Budget</span>
          <span className="font-mono font-bold text-techlo-sky">Rs. {maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="30000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-techlo-cyan cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Rs. 500</span>
          <span>Rs. 30,000+</span>
        </div>
      </div>
    </aside>
  );
};
