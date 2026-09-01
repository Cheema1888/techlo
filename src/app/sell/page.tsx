"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  User,
} from "lucide-react";

export default function SellHardwarePage() {
  const router = useRouter();
  const { addProductListing, user, isAuthenticated, openAuthModal } = useAuth();

  // Clean Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ComponentCategory>("microcontrollers");
  const [condition, setCondition] = useState<HardwareCondition>("fyp_tested");
  const [pricePkr, setPricePkr] = useState<string>("");
  const [originalPricePkr, setOriginalPricePkr] = useState<string>("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [campusLocation, setCampusLocation] = useState(user?.campus || "");
  const [city, setCity] = useState(user?.city || "Islamabad");

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Specs state
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Quick photo presets for student convenience
  const photoPresets = [
    { label: "Microcontroller / Dev Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    { label: "SBC / Single Board Computer", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80" },
    { label: "Motors & Actuators", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
    { label: "Sensor & Measurement IC", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80" },
  ];

  const handleAddImage = (urlToAdd?: string) => {
    const target = urlToAdd || imageUrlInput.trim();
    if (target && !images.includes(target)) {
      setImages([...images, target]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecs([...specs, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      openAuthModal("login");
      return;
    }

    if (!title.trim() || !pricePkr) {
      alert("Please fill in required fields: Item Title and Price (PKR)");
      return;
    }

    setIsSubmitting(true);

    try {
      const finalImages =
        images.length > 0
          ? images
          : ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"];

      const specsDict: Record<string, string> = {};
      specs.forEach((s) => {
        specsDict[s.key] = s.value;
      });

      await addProductListing({
        title: title.trim(),
        category,
        condition,
        pricePkr: parseFloat(pricePkr),
        originalPricePkr: originalPricePkr ? parseFloat(originalPricePkr) : undefined,
        isNegotiable,
        images: finalImages,
        description: description.trim() || `Listed by ${user.fullName} (${user.university}). Tested and available for campus pickup or courier.`,
        specs: Object.keys(specsDict).length > 0 ? specsDict : undefined,
        quantityAvailable: quantity,
        status: "available",
        location: campusLocation || user.campus || `${user.university} Campus`,
        seller: {
          id: user.id,
          name: user.fullName,
          fullName: user.fullName,
          university: user.university,
          campus: user.campus || `${user.university} Campus`,
          phoneNumber: user.phoneNumber,
          rating: user.rating || 5.0,
          dealsCompleted: user.dealsCompleted || 0,
          isVerifiedStudent: user.isVerifiedStudent,
          avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          city: city || user.city || "Islamabad",
        },
      });

      setIsSubmitting(false);
      setPublishSuccess(true);
      setTimeout(() => {
        router.push("/marketplace");
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      alert("Failed to publish listing to database. Please check your connection.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white flex items-center justify-center mx-auto shadow-xs">
          <User className="w-6 h-6 text-neutral-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Sign In Required to Post Ads</h1>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            To ensure trust and verified campus trading across Pakistani universities, sellers must sign in with their university and phone number.
          </p>
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs cursor-pointer"
        >
          Sign In with University Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
          // HARDWARE AD WIZARD
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Post Hardware Component Ad
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          List your microcontrollers, sensors, motors, or lab tools to sell directly to engineering students.
        </p>
      </div>

      {publishSuccess ? (
        <div className="p-12 text-center bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Listing Published to Database!</h2>
          <p className="text-xs text-neutral-500">Redirecting you to the live marketplace...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Item Core Details */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              1. Item Information
            </h2>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                Item Title / Model Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ESP32-WROOM-32D Development Board (Dual Core, WiFi+BT)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="microcontrollers">Microcontrollers (ESP32, STM32, Arduino)</option>
                  <option value="sensors">Sensors & IMUs (MPU6050, LiDAR, BMP280)</option>
                  <option value="motors_actuators">Motors & Drivers (Stepper, Servo, BLDC)</option>
                  <option value="power_bms">Power & LiPo (BMS, 18650, Buck Converters)</option>
                  <option value="development_boards">SBCs & FPGAs (Raspberry Pi, Jetson, Zynq)</option>
                  <option value="test_tools">Lab Tools (Multimeters, Logic Analyzers)</option>
                  <option value="displays">Displays & OLEDs (Nextion, TFT, 16x2)</option>
                  <option value="passives_ics">Passive Kits & ICs</option>
                  <option value="robotics_chassis">Robotics Chassis & Hardware</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="brand_new">Brand New (Unopened / Sealed)</option>
                  <option value="fyp_tested">FYP Tested (Verified Working for Project)</option>
                  <option value="gently_used">Gently Used (Minor cosmetic signs, full function)</option>
                  <option value="desoldered_working">Desoldered Working (Cleanly harvested)</option>
                  <option value="for_parts">For Parts / Repair (Needs troubleshooting)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                Item Description
              </label>
              <textarea
                rows={3}
                placeholder="Detail what pin headers are soldered, operating status, whether cables/accessories are included, and campus pickup details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Pricing & Quantity */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              2. Pricing & Quantity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Selling Price (PKR) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={pricePkr}
                  onChange={(e) => setPricePkr(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs">
                  Original Retail Price (PKR Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1800"
                  value={originalPricePkr}
                  onChange={(e) => setOriginalPricePkr(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Available Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="rounded accent-black dark:accent-white"
              />
              <span>Price is negotiable for students</span>
            </label>
          </div>

          {/* 3. Photos & Technical Specs */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              3. Photos & Specifications
            </h2>

            {/* Photo preset selectors */}
            <div className="space-y-2">
              <span className="text-xs text-neutral-400 block">Quick Category Photo Presets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {photoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddImage(preset.url)}
                    className="p-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-xs text-left text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer truncate"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Image
              </button>
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group w-20 h-20 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Specifications Add */}
            <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
              <span className="text-xs text-neutral-400 block font-medium">
                Key Hardware Specs (Optional):
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Spec (e.g. Operating Voltage)"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 3.3V DC)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>

              {specs.length > 0 && (
                <div className="space-y-1 pt-1">
                  {specs.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80">
                      <span><strong>{s.key}</strong>: {s.value}</span>
                      <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-rose-500 hover:text-rose-700">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4. Location & Contact */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              4. Campus Pickup & Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Campus / Hostel Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. NUST H-12 SEECS Gate 4"
                  value={campusLocation}
                  onChange={(e) => setCampusLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Islamabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Publishing to Database..." : "Publish Hardware Listing"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
