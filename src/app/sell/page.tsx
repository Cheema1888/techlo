"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import { formatPKR, getConditionBadge } from "@/lib/utils";
import {
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle2,
  Camera,
  Layers,
  MapPin,
  Eye,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function SellHardwarePage() {
  const router = useRouter();
  const { addProductListing, user, isAuthenticated, openAuthModal } = useAuth();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ComponentCategory>("microcontrollers");
  const [condition, setCondition] = useState<HardwareCondition>("fyp_tested");
  const [pricePkr, setPricePkr] = useState<string>("");
  const [originalPricePkr, setOriginalPricePkr] = useState<string>("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [campusLocation, setCampusLocation] = useState(
    user?.campus || "NUST H-12 Campus, Islamabad"
  );
  const [city, setCity] = useState(user?.city || "Islamabad");

  // Images state
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
  ]);

  // Specs state
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: "Working Status", value: "100% Tested & Verified" },
    { key: "Operating Voltage", value: "3.3V / 5V DC" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Add sample photos
  const samplePhotoPresets = [
    { label: "ESP32 Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    { label: "Raspberry Pi", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80" },
    { label: "Stepper Motor", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
    { label: "Sensor Module", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80" },
  ];

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal("signup");
      return;
    }

    if (!title || !pricePkr || !description) {
      alert("Please fill in the title, price, and description");
      return;
    }

    setIsSubmitting(true);

    const specsDict: { [key: string]: string } = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsDict[s.key.trim()] = s.value.trim();
      }
    });

    const newProduct = {
      title,
      category,
      condition,
      pricePkr: parseFloat(pricePkr),
      originalPricePkr: originalPricePkr ? parseFloat(originalPricePkr) : undefined,
      isNegotiable,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"],
      description,
      specs: specsDict,
      seller: {
        id: user?.id || "u-anon",
        name: user?.fullName || "Student Member",
        email: user?.email || "student@nust.edu.pk",
        university: user?.university || "NUST Islamabad",
        campus: campusLocation,
        city: city,
        avatarUrl: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isVerifiedStudent: user?.isVerifiedStudent || true,
        rating: 5.0,
        phone: user?.phoneNumber || "+92 300 1234567",
      },
      quantityAvailable: quantity,
      status: "available" as const,
      viewsCount: 1,
      location: `${campusLocation} (${city})`,
    };

    try {
      await addProductListing(newProduct);
      setIsSubmitting(false);
      setPublishSuccess(true);
      setTimeout(() => {
        router.push("/marketplace");
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      alert("Failed to publish listing. Please try again.");
    }
  };

  const conditionInfo = getConditionBadge(condition);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Header */}
      <div className="max-w-3xl space-y-1">
        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
          // HARDWARE LISTING WIZARD
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
          List a Hardware Component for Sale
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Sell your extra microcontrollers, sensors, or FYP hardware components directly to other engineering students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm text-xs"
          >
            {/* 1. Title & Category */}
            <div className="space-y-4">
              <h2 className="font-bold text-black dark:text-white uppercase text-xs">
                1. Item Title & Category
              </h2>

              <div className="space-y-1">
                <label className="text-neutral-500 uppercase text-[10px]">
                  Component Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32-WROOM-32D Development Board (Type-C)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white font-mono focus:border-black dark:focus:border-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  >
                    <option value="microcontrollers">Microcontrollers (ESP32 / STM32 / PIC)</option>
                    <option value="sensors">Sensors & IMUs</option>
                    <option value="motors_actuators">Motors, Servos & Drivers</option>
                    <option value="power_bms">Power, LiPo & BMS</option>
                    <option value="wireless_iot">Wireless & LoRa</option>
                    <option value="development_boards">Raspberry Pi & FPGAs</option>
                    <option value="displays">Displays & OLEDs</option>
                    <option value="test_tools">Lab Tools & Logic Analyzers</option>
                    <option value="passives_ics">ICs & Passives</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Hardware Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  >
                    <option value="brand_new">Brand New (Unopened in ESD Bag)</option>
                    <option value="fyp_tested">FYP Tested & 100% Working</option>
                    <option value="gently_used">Gently Used (Pins Intact)</option>
                    <option value="desoldered_working">Desoldered / Tested Working</option>
                    <option value="for_parts">For Parts / Salvage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Pricing & Quantity */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="font-bold text-black dark:text-white uppercase text-xs">
                2. Price & Quantity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Asking Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={pricePkr}
                    onChange={(e) => setPricePkr(e.target.value)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Original Market Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2400"
                    value={originalPricePkr}
                    onChange={(e) => setOriginalPricePkr(e.target.value)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Quantity Available</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-4 h-4 rounded text-black dark:text-white focus:ring-black accent-black dark:accent-white"
                />
                <span className="text-neutral-700 dark:text-neutral-300">
                  Open to reasonable negotiation from university peers
                </span>
              </label>
            </div>

            {/* 3. Description & Specs */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="font-bold text-black dark:text-white uppercase text-xs">
                3. Technical Description & Specifications
              </h2>

              <div className="space-y-1">
                <label className="text-neutral-500 uppercase text-[10px]">
                  Description & Usage History *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe how long it was used, what project it was tested on, whether header pins are soldered, and what extra cables/accessories are included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white font-mono"
                />
              </div>

              {/* Dynamic Specs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-500 uppercase text-[10px]">
                    Technical Specs Key-Value Pairs
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Spec
                  </button>
                </div>

                {specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Flash Memory"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                      className="flex-1 p-2 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-lg text-black dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 4MB SPI Flash"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                      className="flex-1 p-2 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-lg text-black dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-2 text-neutral-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Campus Location */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="font-bold text-black dark:text-white uppercase text-xs">
                4. Campus Pickup Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Campus Details *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NUST SEECS / Hostel 9"
                    value={campusLocation}
                    onChange={(e) => setCampusLocation(e.target.value)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 5. Photos */}
            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="font-bold text-black dark:text-white uppercase text-xs">
                5. Product Image Preset
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {samplePhotoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImages([preset.url])}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      images[0] === preset.url
                        ? "border-black dark:border-white bg-neutral-100 dark:bg-[#141414]"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded-lg mb-1.5" />
                    <span className="text-[10px] font-bold text-black dark:text-white block truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Listing...</span>
                ) : publishSuccess ? (
                  <span>Listing Published Successfully!</span>
                ) : (
                  <>
                    <span>Publish Hardware Listing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-2">
              // LIVE BUYER PREVIEW
            </span>

            <div className="p-4 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-[#121212] relative">
                <img
                  src={images[0]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conditionInfo.badgeClass}`}>
                    {conditionInfo.label}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-neutral-500 block">{category}</span>
                <h3 className="font-bold text-black dark:text-white text-sm line-clamp-2 mt-0.5">
                  {title || "Component Title Preview"}
                </h3>
              </div>

              <div className="flex items-baseline gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xl font-bold text-black dark:text-white">
                  {formatPKR(parseFloat(pricePkr) || 0)}
                </span>
                {originalPricePkr && (
                  <span className="text-xs text-neutral-400 line-through">
                    {formatPKR(parseFloat(originalPricePkr))}
                  </span>
                )}
              </div>

              <div className="pt-2 text-[11px] text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{campusLocation || "Campus Pickup"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
