"use client";

import React from "react";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
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
  { id: "microcontrollers", label: "Microcontrollers (ESP32 / STM32)" },
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
  { id: "fyp_tested", label: "Tested & Working" },
  { id: "gently_used", label: "Gently Used" },
  { id: "desoldered_working", label: "Desoldered / Tested" },
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
    <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-5 space-y-6 text-xs shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* University Filter */}
      <div className="space-y-2">
        <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
          Pakistani Campus
        </label>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
        >
          <option value="all">All Pakistani Universities</option>
          {PAKISTANI_UNIVERSITIES.map((uni) => (
            <option key={uni.id} value={uni.shortName} className="bg-white dark:bg-black">
              {uni.shortName} — {uni.city}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
          City / Hub
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
        >
          {CITIES.map((city) => (
            <option key={city} value={city} className="bg-white dark:bg-black">
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
          Component Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer truncate ${
                selectedCategory === cat.id
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-2">
        <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
          Hardware Condition
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCondition("all")}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedCondition === "all"
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
            }`}
          >
            Any Condition
          </button>
          {CONDITIONS.map((cond) => (
            <button
              key={cond.id}
              onClick={() => setSelectedCondition(cond.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer truncate ${
                selectedCondition === cond.id
                  ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-medium">Max Price</span>
          <span className="text-black dark:text-white font-semibold">
            Rs. {maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-black dark:accent-white cursor-pointer"
        />
      </div>

      {/* Verified Student Toggle */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded accent-black dark:accent-white"
          />
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verified Students Only</span>
          </span>
        </label>
      </div>
    </div>
  );
};
