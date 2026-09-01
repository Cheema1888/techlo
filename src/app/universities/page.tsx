"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import {
  GraduationCap,
  MapPin,
  Search,
  Cpu,
  ChevronRight,
  Sparkles,
  Award,
  Users,
} from "lucide-react";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");

  const filteredUnis = PAKISTANI_UNIVERSITIES.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.programs.some((p) => p.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedProvince !== "all") {
      if (!u.province.toLowerCase().includes(selectedProvince.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-techlo-cyan/15 border border-techlo-cyan/30 text-techlo-cyan text-xs font-bold shadow-glow-cyan">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Pakistani Engineering Campus Network</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
          Universities & Hardware Hubs
        </h1>

        <p className="text-xs sm:text-sm text-slate-300">
          Discover active student sellers, FYP project components, and campus handoff points across major engineering institutions in Pakistan.
        </p>
      </div>

      {/* Search & Province Filters */}
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search university by name, city, or engineering program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-techlo-surface border border-techlo-border rounded-xl text-white text-sm focus:border-techlo-cyan focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {["all", "Federal", "Punjab", "Sindh", "KPK", "Balochistan"].map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProvince === prov
                  ? "bg-techlo-cyan text-techlo-dark shadow-glow-cyan"
                  : "bg-techlo-surface border border-techlo-border text-slate-300 hover:border-slate-500"
              }`}
            >
              {prov === "all" ? "All Regions" : prov}
            </button>
          ))}
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnis.map((uni) => (
          <div
            key={uni.id}
            className="p-6 rounded-3xl bg-techlo-dark border border-techlo-border hover:border-techlo-cyan/60 transition-all flex flex-col justify-between space-y-4 group shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-techlo-cyan/15 text-techlo-cyan font-mono font-bold text-xs">
                  {uni.shortName}
                </span>
                <span className="text-[11px] text-slate-400">{uni.province}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-techlo-sky transition-colors">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-techlo-cyan" />
                  <span>{uni.city}</span>
                </p>
              </div>

              {/* Campuses */}
              {uni.campuses && (
                <div className="space-y-1 pt-2 border-t border-techlo-border/60 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Campuses:</span>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    {uni.campuses.join(" • ")}
                  </p>
                </div>
              )}

              {/* Programs */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hardware Programs:</span>
                <div className="flex flex-wrap gap-1">
                  {uni.programs.map((prog, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-techlo-surface border border-techlo-border/60 text-slate-300 text-[10px]"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
              className="w-full py-2.5 bg-techlo-surface hover:bg-techlo-cyan hover:text-techlo-dark text-white rounded-xl text-xs font-bold border border-techlo-border transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Explore {uni.shortName} Listings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Campus Ambassador Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-techlo-surface via-techlo-navy to-techlo-surface border border-techlo-cyan/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-techlo-cyan/20 text-techlo-cyan text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Join the Student Team</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Become a TECHLO Campus Ambassador
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Represent TECHLO in your department, lead hardware swaps, organize consolidated PCB batch orders for your classmates, and earn perks.
          </p>
        </div>

        <button
          onClick={() => alert("Campus Ambassador registrations open for Fall 2026! Reach out to team@techlo.pk or on WhatsApp.")}
          className="px-6 py-3.5 bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-black text-sm rounded-xl shadow-glow-cyan flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>Apply as Ambassador</span>
        </button>
      </div>
    </div>
  );
}
