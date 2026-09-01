"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { EngineeringServiceType } from "@/lib/types";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import { FileUploadDropzone } from "@/components/services/FileUploadDropzone";
import { formatPKR } from "@/lib/utils";
import {
  Layers,
  Cpu,
  Box,
  Printer,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function RequestServicePage() {
  const { createServiceRequest, user, isAuthenticated, openAuthModal } = useAuth();

  const [serviceType, setServiceType] = useState<EngineeringServiceType>("pcb_design");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientName, setClientName] = useState(user?.fullName || "");
  const [clientUniversity, setClientUniversity] = useState(user?.university || PAKISTANI_UNIVERSITIES[0].name);
  const [clientPhone, setClientPhone] = useState(user?.phoneNumber || "");
  const [deadline, setDeadline] = useState("");
  const [budgetPkr, setBudgetPkr] = useState<string>("4500");

  const [files, setFiles] = useState<Array<{ id: string; name: string; size: string; type: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDescription.trim()) {
      alert("Please enter project title and description");
      return;
    }

    if (!clientPhone || clientPhone.trim().length < 10) {
      alert("Please provide a valid Pakistani mobile number for contact");
      return;
    }

    setIsSubmitting(true);

    try {
      const newReq = await createServiceRequest({
        serviceType,
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        clientName: clientName || user?.fullName || "Student Client",
        clientUniversity: clientUniversity || user?.university || PAKISTANI_UNIVERSITIES[0].name,
        clientPhone: clientPhone || user?.phoneNumber || "",
        files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
        estimatedCostPkr: Number(budgetPkr) || 4500,
        deadline: deadline || undefined,
      });

      setIsSubmitting(false);
      setSubmittedOrder(newReq);
    } catch (e) {
      setIsSubmitting(false);
      alert("Failed to submit quote request. Please try again.");
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Quotation Request Submitted
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Our engineering team will review your specifications and files and contact you on WhatsApp at{" "}
            <strong>{submittedOrder.clientPhone}</strong> within 12 hours.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl text-left text-xs space-y-1.5 shadow-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order Ref:</span>
            <span className="font-semibold text-black dark:text-white">#{submittedOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Service:</span>
            <span className="font-semibold text-black dark:text-white uppercase">{submittedOrder.serviceType.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Target Budget:</span>
            <span className="font-semibold text-black dark:text-white">{formatPKR(submittedOrder.estimatedCostPkr)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs shadow-xs"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/marketplace"
            className="px-5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Services Overview</span>
      </Link>

      {/* Title */}
      <div className="border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
        <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
          // CUSTOM PROTOTYPING
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Request Prototyping Quotation
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Submit your design files (Gerbers, STEP, STL, Schematics) for rapid engineering review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Service Selection */}
        <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
            1. Select Engineering Service *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "pcb_design", label: "PCB Design", icon: Cpu },
              { id: "pcb_fabrication", label: "PCB Fabrication", icon: Layers },
              { id: "cad_3d_modeling", label: "3D CAD Model", icon: Box },
              { id: "3d_printing", label: "3D Printing", icon: Printer },
            ].map((s) => {
              const Icon = s.icon;
              const isSelected = serviceType === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceType(s.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs font-semibold"
                      : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200/80 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px]">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Project Details */}
        <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
            2. Project Scope & Specifications *
          </label>

          <div className="space-y-1">
            <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 4-Layer STM32 Quadcopter Flight Controller PCB"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">Technical Requirements & Notes</label>
            <textarea
              rows={4}
              required
              placeholder="Describe layer stackup, key chips (ESP32, STM32), dimensions, power supply rails, and special tolerances..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">Target Budget (PKR)</label>
              <input
                type="number"
                placeholder="e.g. 4500"
                value={budgetPkr}
                onChange={(e) => setBudgetPkr(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Attach Files */}
        <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
            3. Upload Gerber / STEP / STL / Schematic Files
          </label>
          <FileUploadDropzone files={files} setFiles={setFiles} />
        </div>

        {/* 4. Contact Info */}
        <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold block">
            4. Student Contact Details *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">Your Name</label>
              <input
                type="text"
                required
                placeholder="Saad Tariq"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">WhatsApp Number *</label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-600 dark:text-neutral-400 text-xs font-medium">University</label>
              <select
                value={clientUniversity}
                onChange={(e) => setClientUniversity(e.target.value)}
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl text-black dark:text-white text-xs focus:outline-none cursor-pointer"
              >
                {PAKISTANI_UNIVERSITIES.map((uni) => (
                  <option key={uni.id} value={uni.name} className="bg-white dark:bg-black">
                    {uni.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? "Submitting Quote Request..." : "Submit Quotation Request"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
