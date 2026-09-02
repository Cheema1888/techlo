"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import {
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  User,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Loader2,
  Star,
  Sparkles,
  X,
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
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [campusLocation, setCampusLocation] = useState(user?.campus || "");
  const [city, setCity] = useState(user?.city || "Islamabad");

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresetFallback, setShowPresetFallback] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Specs state
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Quick photo presets for student convenience
  const photoPresets = [
    { label: "Microcontroller / Dev Board", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    { label: "SBC / Raspberry Pi / Jetson", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80" },
    { label: "Motors & Actuators", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
    { label: "Sensor & Measurement IC", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80" },
  ];

  // Client-side smart canvas image compression
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > 8) {
      alert("You can upload up to 8 photos per hardware listing.");
    }

    setIsCompressing(true);
    try {
      const compressPromises = validFiles.map((file) => compressImage(file));
      const compressedUrls = await Promise.all(compressPromises);
      setImages((prev) => [...prev, ...compressedUrls].slice(0, 8));
    } catch (err) {
      console.error("Error compressing image:", err);
      alert("Failed to process some images. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = (urlToAdd?: string) => {
    const target = urlToAdd || imageUrlInput.trim();
    if (target && !images.includes(target)) {
      if (images.length >= 8) {
        alert("Maximum 8 photos allowed.");
        return;
      }
      setImages([...images, target]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, i) => i !== index);
    setImages([target, ...remaining]);
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
        showPhoneNumber,
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
                  onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="microcontrollers">Microcontrollers & Dev Boards</option>
                  <option value="sensors">Sensors & Modules</option>
                  <option value="actuators_motors">Motors, Actuators & Drivers</option>
                  <option value="wireless_iot">Wireless, IoT & RF</option>
                  <option value="power_batteries">Power Supplies, Batteries & Regulators</option>
                  <option value="passives_discrete">Passives, Diodes & ICs</option>
                  <option value="lab_tools">Lab Equipment & Multimeters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Hardware Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as HardwareCondition)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="brand_new">Brand New (Unopened / Antistatic Seal)</option>
                  <option value="fyp_tested">FYP Tested (100% Working, Pins Intact)</option>
                  <option value="bench_working">Bench Working (Light Use / Desoldered)</option>
                  <option value="parts_only">For Parts / Repair</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                Detailed Description & Notes
              </label>
              <textarea
                rows={3}
                placeholder="Mention working condition, firmware tested, pin header soldering status, or accessories included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Pricing & Privacy */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              2. Pricing & Privacy Options
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Asking Price (PKR) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={pricePkr}
                  onChange={(e) => setPricePkr(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none font-medium"
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

            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <label className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded accent-black dark:accent-white"
                />
                <span>Price is negotiable for students</span>
              </label>

              <label className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={showPhoneNumber}
                  onChange={(e) => setShowPhoneNumber(e.target.checked)}
                  className="rounded accent-black dark:accent-white mt-0.5"
                />
                <div>
                  <span className="font-semibold text-black dark:text-white block">
                    Show Mobile Phone Publicly on Listing
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {showPhoneNumber
                      ? "Buyers can contact you directly on WhatsApp and phone."
                      : "Phone number will be hidden. Buyers will communicate with you via TECHLO Web Chat."}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Component Photos Upload & Specifications */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                <span>3. Component Photos & Specifications</span>
                {images.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-normal">
                    {images.length}/8 uploaded
                  </span>
                )}
              </h2>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              accept="image/*"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Interactive Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-3 ${
                isDragOver
                  ? "border-black dark:border-white bg-neutral-100 dark:bg-neutral-800"
                  : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-center shadow-xs">
                {isCompressing ? (
                  <Loader2 className="w-6 h-6 text-black dark:text-white animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-black dark:text-white" />
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">
                  {isCompressing ? "Optimizing & Compressing Photos..." : "Click to Upload Component Photos"}
                </p>
                <p className="text-[11px] text-neutral-500">
                  Select pictures from your computer or phone camera roll (JPEG, PNG, WebP)
                </p>
              </div>

              {/* Action Buttons Row inside Dropzone */}
              <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-[11px] hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose Files</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-full font-semibold text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Photo</span>
                </button>
              </div>
            </div>

            {/* Photo Previews Grid */}
            {images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Uploaded Photos (First image is the cover thumbnail):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-xs"
                    >
                      <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />

                      {/* Cover Badge */}
                      {i === 0 ? (
                        <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-black/80 dark:bg-white/90 text-white dark:text-black text-[9px] font-bold flex items-center gap-1 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(i)}
                          className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-black/60 hover:bg-black text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Set as main cover photo"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expandable Fallback: Category Stock Presets & Direct URL */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <button
                type="button"
                onClick={() => setShowPresetFallback(!showPresetFallback)}
                className="text-[11px] text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{showPresetFallback ? "▼ Hide stock presets and URL input" : "▶ Don't have a photo? Use stock preset or paste direct URL"}</span>
              </button>

              {showPresetFallback && (
                <div className="space-y-3 pt-3">
                  {/* Photo preset selectors */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">Quick Category Presets:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {photoPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddImageUrl(preset.url)}
                          className="p-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-[11px] text-left text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer truncate"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl()}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              )}
            </div>

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
