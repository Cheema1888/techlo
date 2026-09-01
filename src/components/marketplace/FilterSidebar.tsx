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
    <aside className="w-full bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 space-y-6 font-mono text-xs shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-black dark:text-white font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Verified Students Only Toggle */}
      <div className="p-3 bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-black dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Verified Students
          </span>
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-black dark:text-white focus:ring-black accent-black dark:accent-white cursor-pointer"
          />
        </label>
      </div>

      {/* Categories */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#121212]"
            }`}
          >
            All Components
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer truncate ${
                selectedCategory === cat.id
                  ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#121212]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
          Condition
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCondition("all")}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCondition === "all"
                ? "bg-neutral-200 dark:bg-neutral-900 text-black dark:text-white font-bold border border-neutral-300 dark:border-neutral-700"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#121212]"
            }`}
          >
            Any Condition
          </button>
          {CONDITIONS.map((cond) => (
            <button
              key={cond.id}
              onClick={() => setSelectedCondition(cond.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCondition === cond.id
                  ? "bg-neutral-200 dark:bg-neutral-900 text-black dark:text-white font-bold border border-neutral-300 dark:border-neutral-700"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#121212]"
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* University Campus Filter */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
          Campus / University
        </h4>
        <select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value)}
          className="w-full px-2.5 py-2 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-lg text-black dark:text-white focus:outline-none cursor-pointer"
        >
          <option value="all" className="bg-white dark:bg-black">All Universities</option>
          {PAKISTANI_UNIVERSITIES.map((uni) => (
            <option key={uni.id} value={uni.shortName} className="bg-white dark:bg-black">
              {uni.shortName} - {uni.name}
            </option>
          ))}
        </select>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="font-bold text-neutral-500 uppercase text-[10px]">Max Price</span>
          <span className="font-bold text-black dark:text-white">Rs. {maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="30000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-black dark:accent-white cursor-pointer"
        />
      </div>
    </aside>
  );
};
