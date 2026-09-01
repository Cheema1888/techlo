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
  Sparkles,
  Camera,
  Layers,
  MapPin,
  Eye,
  AlertCircle,
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

  // Images state (URLs or Base64)
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricePkr || Number(pricePkr) <= 0) {
      alert("Please enter a valid price in PKR");
      return;
    }

    setIsSubmitting(true);

    const specsObj: { [k: string]: string } = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const newProd = addProductListing({
      title,
      category,
      condition,
      pricePkr: Number(pricePkr),
      originalPricePkr: originalPricePkr ? Number(originalPricePkr) : undefined,
      isNegotiable,
      description,
      specs: specsObj,
      images: images.length > 0 ? images : [samplePhotoPresets[0].url],
      quantityAvailable: quantity,
      location: campusLocation,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setPublishSuccess(true);
      setTimeout(() => {
        router.push(`/marketplace/${newProd.id}`);
      }, 1200);
    }, 800);
  };

  const conditionDetails = getConditionBadge(condition);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-techlo-cyan/15 border border-techlo-cyan/30 text-techlo-cyan text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Post Hardware in 60 Seconds</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
          List Your Spare Hardware
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Sell to engineering students in your campus or across Pakistan. Fast, free, and protected.
        </p>
      </div>

      {publishSuccess ? (
        <div className="max-w-md mx-auto p-8 bg-techlo-dark border border-emerald-500/40 rounded-3xl text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Listing Published!</h2>
          <p className="text-sm text-slate-300">
            Your hardware component is now live on the TECHLO marketplace. Redirecting to your listing...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Columns (7 cols) */}
          <div className="lg:col-span-7 bg-techlo-dark border border-techlo-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Component Title / Part Name <span className="text-techlo-cyan">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STM32F401 BlackPill + ST-Link V2 Debugger"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-techlo-surface border border-techlo-border rounded-xl text-white text-sm focus:border-techlo-cyan focus:outline-none"
              />
            </div>

            {/* Category & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs focus:border-techlo-cyan focus:outline-none"
                >
                  <option value="microcontrollers">Microcontrollers (ESP32/STM32/Arduino)</option>
                  <option value="sensors">Sensors & IMU Modules</option>
                  <option value="motors_actuators">Motors, Servos & Steppers</option>
                  <option value="power_bms">LiPo Batteries & BMS</option>
                  <option value="wireless_iot">Wireless, LoRa & IoT Modules</option>
                  <option value="development_boards">Raspberry Pi, SBC & FPGAs</option>
                  <option value="displays">Displays (LCD, OLED, TFT)</option>
                  <option value="test_tools">Lab Tools & Logic Analyzers</option>
                  <option value="passives_ics">ICs, Relays & Components</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Quantity Available</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Hardware Condition Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Hardware Condition <span className="text-techlo-cyan">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "fyp_tested", name: "FYP Tested (100% Working)", desc: "Used in project, verified in lab" },
                  { id: "brand_new", name: "Brand New (Unopened)", desc: "Sealed in anti-static bag" },
                  { id: "gently_used", name: "Gently Used", desc: "Headers soldered, tested" },
                  { id: "desoldered_working", name: "Desoldered / Working", desc: "Desoldered from board" },
                  { id: "for_parts", name: "For Parts / Salvage", desc: "Non-functional or as-is" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      condition === c.id
                        ? "bg-techlo-cyan/15 border-techlo-cyan text-white shadow-glow-cyan"
                        : "bg-techlo-surface border-techlo-border text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Selling Price (PKR) <span className="text-techlo-cyan">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">Rs.</span>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={pricePkr}
                    onChange={(e) => setPricePkr(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white font-mono text-sm focus:border-techlo-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Original Retail Price (PKR) <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">Rs.</span>
                  <input
                    type="number"
                    placeholder="2500"
                    value={originalPricePkr}
                    onChange={(e) => setOriginalPricePkr(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white font-mono text-sm focus:border-techlo-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="nego"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 rounded text-techlo-cyan focus:ring-techlo-cyan bg-techlo-dark border-techlo-border accent-techlo-cyan"
              />
              <label htmlFor="nego" className="text-xs text-slate-300 cursor-pointer">
                Price is slightly negotiable for students
              </label>
            </div>

            {/* Photos Upload */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Photos of Hardware & Pins</span>
                <span className="text-[11px] text-slate-400">({images.length} added)</span>
              </label>

              {/* Photos Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden bg-techlo-surface border border-techlo-border group"
                  >
                    <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                <label className="aspect-square rounded-xl border-2 border-dashed border-techlo-border hover:border-techlo-cyan bg-techlo-surface/40 flex flex-col items-center justify-center text-slate-400 hover:text-techlo-cyan cursor-pointer transition-all">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Presets for quick demo testing */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400">Sample Photos:</span>
                {samplePhotoPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImages([preset.url])}
                    className="text-[10px] px-2 py-0.5 rounded bg-techlo-surface border border-techlo-border text-slate-300 hover:text-white"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Description & Working Verification <span className="text-techlo-cyan">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Mention how long it was used, why you are selling it, what project it was tested on, and any cables/extras included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs placeholder-slate-500 focus:border-techlo-cyan focus:outline-none"
              />
            </div>

            {/* Campus & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Campus Pickup Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NUST H-12 Campus or FAST Lahore"
                  value={campusLocation}
                  onChange={(e) => setCampusLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                >
                  {["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Topi", "Taxila", "Quetta"].map((c) => (
                    <option key={c} value={c} className="bg-techlo-dark">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Publishing to Campus Feed...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Publish Hardware Listing (Free)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Eye className="w-4 h-4 text-techlo-cyan" />
              <span>Live Listing Card Preview</span>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-techlo-surface/50 border border-techlo-border rounded-3xl space-y-4">
              <div className="max-w-sm mx-auto">
                <div className="bg-techlo-dark border border-techlo-border rounded-2xl overflow-hidden shadow-2xl space-y-3">
                  <div className="relative aspect-[4/3] bg-techlo-surface">
                    <img
                      src={images[0] || samplePhotoPresets[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md shadow-sm ${conditionDetails.badgeClass}`}
                      >
                        {conditionDetails.label}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-techlo-dark/95 border border-techlo-border text-white">
                      <span className="font-mono font-black text-sm text-techlo-sky">
                        {pricePkr ? formatPKR(Number(pricePkr)) : "Rs. 0"}
                      </span>
                      {isNegotiable && (
                        <span className="text-[10px] text-slate-400 ml-1.5">(Negotiable)</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-techlo-cyan uppercase tracking-wider">
                      {category}
                    </span>
                    <h3 className="font-bold text-white text-sm line-clamp-2">
                      {title || "Untitled Hardware Component"}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {description || "No description entered yet."}
                    </p>
                    <div className="pt-2 border-t border-techlo-border/60 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-techlo-cyan" />
                        {campusLocation}
                      </span>
                      <span className="text-emerald-400 font-semibold">✓ Verified Seller</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
