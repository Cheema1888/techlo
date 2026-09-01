"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import {
  GraduationCap,
  MapPin,
  Search,
  ChevronRight,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 text-xs font-medium inline-block">
          Pakistani Engineering Campus Directory
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Universities & Hardware Hubs
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Discover active student sellers, FYP project components, and campus pickup locations across major engineering institutions in Pakistan.
        </p>
      </div>

      {/* Search & Province Filters */}
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search university name, city, or engineering program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-xs"
          />
        </div>

        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="px-4 py-2.5 bg-neutral-50 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-xs text-black dark:text-white focus:outline-none cursor-pointer shadow-xs"
        >
          <option value="all">All Provinces</option>
          <option value="Federal">Federal Capital (Islamabad)</option>
          <option value="Punjab">Punjab</option>
          <option value="Sindh">Sindh</option>
          <option value="KPK">KPK</option>
          <option value="Balochistan">Balochistan</option>
        </select>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnis.map((uni) => (
          <div
            key={uni.id}
            className="group relative flex flex-col justify-between p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-2xl transition-all duration-200 shadow-xs hover:shadow-md space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors block">
                    {uni.shortName}
                  </span>
                  <p className="text-xs text-neutral-500 leading-snug line-clamp-2 mt-0.5">
                    {uni.name}
                  </p>
                </div>
              </div>

              {/* City Tag */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span>{uni.city}</span>
              </div>

              {/* Programs */}
              <div className="space-y-1 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                  Key Departments:
                </span>
                <div className="flex flex-wrap gap-1">
                  {uni.programs.slice(0, 3).map((prog, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/60 text-[10px] text-neutral-700 dark:text-neutral-300"
                    >
                      {prog}
                    </span>
                  ))}
                  {uni.programs.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-neutral-400">
                      +{uni.programs.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <Link
                href={`/marketplace?uni=${encodeURIComponent(uni.shortName)}`}
                className="w-full py-2 px-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>View {uni.shortName} Hardware</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
