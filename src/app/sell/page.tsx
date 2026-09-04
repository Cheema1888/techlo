"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { ComponentCategory, HardwareCondition } from "@/lib/types";
import {
  adaptivelyCompressToWebP,
  validateOriginalFile,
  formatFileSize,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/imageCompression";
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
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export interface ListingImageSlot {
  id: string;
  blob?: Blob;
  previewUrl: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  status: "ready" | "uploading" | "uploaded" | "failed";
  uploadProgress: number; // 0-100
  publicUrl?: string;
  objectKey?: string;
  error?: string;
  isPreset?: boolean;
}

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

  // 4-Slot Cloudflare R2 Images State
  const [imageSlots, setImageSlots] = useState<ListingImageSlot[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresetFallback, setShowPresetFallback] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState("");

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

  const handleFilesSelected = async (files: FileList | File[]) => {
    const rawFiles = Array.from(files);
    if (rawFiles.length === 0) return;

    const availableSlots = 4 - imageSlots.length;
    if (availableSlots <= 0) {
      alert("Maximum 4 photos allowed per advertisement.");
      return;
    }

    const filesToProcess = rawFiles.slice(0, availableSlots);
    if (rawFiles.length > availableSlots) {
      alert(`Only ${availableSlots} more photo(s) can be added. Maximum is 4 photos per listing.`);
    }

    setIsCompressing(true);

    for (const file of filesToProcess) {
      const validation = validateOriginalFile(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      try {
        const compressed = await adaptivelyCompressToWebP(file);
        const newSlot: ListingImageSlot = {
          id: `slot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          blob: compressed.blob,
          previewUrl: compressed.previewUrl,
          sizeBytes: compressed.sizeBytes,
          width: compressed.width,
          height: compressed.height,
          status: "ready",
          uploadProgress: 0,
        };

        setImageSlots((prev) => [...prev, newSlot].slice(0, 4));
      } catch (err: any) {
        console.error("Adaptive compression error:", err);
        alert(err.message || "Failed to process photo.");
      }
    }

    setIsCompressing(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = (urlToAdd?: string) => {
    const target = (urlToAdd || imageUrlInput).trim();
    if (!target) return;

    if (imageSlots.length >= 4) {
      alert("Maximum 4 photos allowed per advertisement.");
      return;
    }

    const newSlot: ListingImageSlot = {
      id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      previewUrl: target,
      publicUrl: target,
      sizeBytes: 0,
      status: "uploaded",
      uploadProgress: 100,
      isPreset: true,
    };

    setImageSlots((prev) => [...prev, newSlot].slice(0, 4));
    setImageUrlInput("");
  };

  const handleRemoveSlot = (index: number) => {
    setImageSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverSlot = (index: number) => {
    if (index === 0) return;
    setImageSlots((prev) => {
      const target = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [target, ...remaining];
    });
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

  // Direct Browser-to-Cloudflare-R2 Upload with progress
  const uploadSlotToR2 = (
    slot: ListingImageSlot,
    draftId: string,
    position: number
  ): Promise<{ publicUrl: string; objectKey: string }> => {
    return new Promise(async (resolve, reject) => {
      if (slot.isPreset && slot.publicUrl) {
        return resolve({ publicUrl: slot.publicUrl, objectKey: "" });
      }

      if (!slot.blob) {
        return reject(new Error("Image binary not found"));
      }

      try {
        // 1. Request 5-minute pre-signed upload URL
        const signRes = await fetch("/api/uploads/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draftId,
            contentType: "image/webp",
            size: slot.sizeBytes,
            position,
            userId: user?.id,
          }),
        });

        const signData = await signRes.json();
        if (!signRes.ok || !signData.success || !signData.data?.uploadUrl) {
          throw new Error(signData.error || "Failed to generate upload signature");
        }

        const { uploadUrl, publicUrl, objectKey } = signData.data;

        // 2. Direct HTTP PUT to Cloudflare R2 with progress
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", "image/webp");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setImageSlots((prev) =>
              prev.map((s) => (s.id === slot.id ? { ...s, uploadProgress: percent, status: "uploading" } : s))
            );
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // 3. Confirm upload with TECHLO API
            try {
              const confirmRes = await fetch("/api/uploads/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  objectKey,
                  userId: user?.id,
                }),
              });
              const confirmData = await confirmRes.json();
              if (!confirmRes.ok || !confirmData.success) {
                throw new Error(confirmData.error || "Failed to confirm R2 upload");
              }

              setImageSlots((prev) =>
                prev.map((s) =>
                  s.id === slot.id
                    ? { ...s, status: "uploaded", uploadProgress: 100, publicUrl, objectKey }
                    : s
                )
              );

              resolve({ publicUrl, objectKey });
            } catch (confirmErr: any) {
              reject(confirmErr);
            }
          } else {
            reject(new Error(`Cloudflare R2 returned HTTP ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during Cloudflare R2 upload"));
        xhr.send(slot.blob);
      } catch (err: any) {
        setImageSlots((prev) =>
          prev.map((s) => (s.id === slot.id ? { ...s, status: "failed", error: err.message } : s))
        );
        reject(err);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      openAuthModal("login");
      return;
    }

    if (!title.trim() || !pricePkr) {
      alert("Please fill in required fields: Item Title and Asking Price (PKR)");
      return;
    }

    if (isCompressing) {
      alert("Please wait for photo compression to complete.");
      return;
    }

    setIsSubmitting(true);
    setUploadStatusText("Initializing listing draft...");

    try {
      // 1. Create short-lived draft
      const draftRes = await fetch("/api/products/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const draftData = await draftRes.json();
      const draftId = draftData.data?.draftId || `draft_${Date.now()}`;

      // 2. Upload images directly to Cloudflare R2
      const finalImageUrls: string[] = [];

      if (imageSlots.length > 0) {
        for (let i = 0; i < imageSlots.length; i++) {
          const slot = imageSlots[i];
          setUploadStatusText(`Uploading photo ${i + 1} of ${imageSlots.length} to Cloudflare R2...`);
          const result = await uploadSlotToR2(slot, draftId, i);
          finalImageUrls.push(result.publicUrl);
        }
      } else {
        // Stock fallback
        finalImageUrls.push("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80");
      }

      setUploadStatusText("Publishing hardware listing to database...");

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
        images: finalImageUrls,
        draftId,
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
    } catch (err: any) {
      console.error("Submission error:", err);
      setIsSubmitting(false);
      setUploadStatusText("");
      alert(err.message || "Failed to publish listing. Please check your connection.");
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
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-mono">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Student Hardware Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          List Hardware Component
        </h1>
        <p className="text-xs text-neutral-500 max-w-xl">
          Sell microcontrollers, sensors, actuators, and dev boards to fellow engineering students across Pakistan.
        </p>
      </div>

      {publishSuccess ? (
        <div className="p-8 sm:p-12 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl text-center space-y-4 shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Hardware Published!</h2>
            <p className="text-xs text-neutral-500">
              Photos uploaded directly to Cloudflare R2 CDN. Redirecting to marketplace...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Component Basics */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              1. Component Information
            </h2>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                Component Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ESP32-WROOM-32D Development Board (Dual Core, WiFi/BLE)"
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
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                >
                  <option value="microcontrollers">Microcontrollers & Dev Boards (ESP32, STM32, Arduino)</option>
                  <option value="sensors">Sensors & Modules (LiDAR, IMU, Ultrasonic, Temp)</option>
                  <option value="motors_actuators">Motors & Actuators (BLDC, Stepper, Servos)</option>
                  <option value="power_bms">Power & Battery (LiPo, BMS, Buck Converters)</option>
                  <option value="wireless_iot">Wireless & RF (LoRa, Zigbee, NRF24, GSM)</option>
                  <option value="passives_ics">ICs & Passives (Op-Amps, Relays, MOSFETs)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as HardwareCondition)}
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
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

          {/* 3. Component Photos Upload (Cloudflare R2 + WebP <= 250KB) */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                <span>3. Component Photos (Cloudflare R2)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-normal">
                  {imageSlots.length}/4 photos
                </span>
              </h2>
              <span className="text-[10px] text-neutral-400">WebP • Max 250 KB each</span>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
            />

            {/* Interactive Drag & Drop Upload Zone (Disabled when 4 slots full) */}
            {imageSlots.length < 4 && (
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
                    {isCompressing
                      ? "Optimizing & Compressing to WebP (<= 250 KB)..."
                      : `Click or Drag Photos (${4 - imageSlots.length} remaining)`}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    JPG, PNG, or WebP up to 10 MB. Automatically converted to fast WebP format.
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
            )}

            {/* Photo Previews Grid (Exact 4 slots) */}
            {imageSlots.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Listing Photos ({imageSlots.length}/4) — Slot 1 is the main Cover Photo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageSlots.map((slot, i) => (
                    <div
                      key={slot.id}
                      className="relative group aspect-square rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-xs flex flex-col"
                    >
                      <img
                        src={slot.previewUrl}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Position / Cover Badge */}
                      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1">
                        {i === 0 ? (
                          <div className="px-1.5 py-0.5 rounded-md bg-black/85 dark:bg-white/90 text-white dark:text-black text-[9px] font-bold flex items-center gap-1 shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                            <span>Cover</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverSlot(i)}
                            className="px-1.5 py-0.5 rounded-md bg-black/70 hover:bg-black text-white text-[9px] font-medium opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Make Cover Photo"
                          >
                            Set Cover
                          </button>
                        )}
                      </div>

                      {/* Size Badge */}
                      <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[9px] font-mono shadow-xs">
                        {slot.sizeBytes > 0 ? formatFileSize(slot.sizeBytes) : "Preset"}
                      </div>

                      {/* Status / Progress Overlay */}
                      {slot.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] space-y-1 p-2 z-20">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{slot.uploadProgress}%</span>
                          <div className="w-full bg-neutral-700 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-150"
                              style={{ width: `${slot.uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {slot.status === "uploaded" && (
                        <div className="absolute top-1.5 right-8 z-10 p-0.5 rounded-full bg-emerald-500 text-white shadow-xs" title="Verified in Cloudflare R2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(i)}
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
                          disabled={imageSlots.length >= 4}
                          onClick={() => handleAddImageUrl(preset.url)}
                          className="p-2 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-[11px] text-left text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer truncate disabled:opacity-40"
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
                      disabled={imageSlots.length >= 4}
                      className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl()}
                      disabled={imageSlots.length >= 4 || !imageUrlInput.trim()}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
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

          {/* Overall Upload Status message if submitting */}
          {isSubmitting && uploadStatusText && (
            <div className="p-3.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
              <span>{uploadStatusText}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            className="w-full py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Publishing to Marketplace..." : "Publish Hardware Listing"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
