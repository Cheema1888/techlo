"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Send,
  Building,
  Phone,
  FileCode2,
} from "lucide-react";

export default function RequestServicePage() {
  const router = useRouter();
  const { createServiceRequest, user, openAuthModal } = useAuth();

  const [serviceType, setServiceType] = useState<EngineeringServiceType>("pcb_design");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientName, setClientName] = useState(user?.fullName || "");
  const [clientUniversity, setClientUniversity] = useState(user?.university || PAKISTANI_UNIVERSITIES[0].name);
  const [clientPhone, setClientPhone] = useState(user?.phoneNumber || "+92 3");
  const [deadline, setDeadline] = useState("");
  const [budgetPkr, setBudgetPkr] = useState<string>("5000");

  const [files, setFiles] = useState<Array<{ id: string; name: string; size: string; type: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription) {
      alert("Please fill in the project title and description");
      return;
    }

    setIsSubmitting(true);

    const newReq = createServiceRequest({
      serviceType,
      title: projectTitle,
      description: projectDescription,
      clientName: clientName || "Student Client",
      clientUniversity: clientUniversity || "National University",
      clientPhone: clientPhone || "+923001234567",
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      estimatedCostPkr: Number(budgetPkr) || 4500,
      deadline,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedOrder(newReq);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-techlo-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services Overview</span>
        </Link>
      </div>

      {submittedOrder ? (
        <div className="bg-techlo-dark border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-cyan">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-techlo-cyan/15 text-techlo-cyan text-xs font-mono font-bold">
              Order ID: #{submittedOrder.id.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Service Request Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Our engineering team has received your files and specs for &quot;<strong>{submittedOrder.title}</strong>&quot;.
            </p>
          </div>

          <div className="p-4 bg-techlo-surface/60 border border-techlo-border rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-amber-400 font-bold">Under Engineering Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Deadline:</span>
              <span className="text-white font-semibold">{deadline || "As soon as possible"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Budget:</span>
              <span className="text-techlo-sky font-mono font-bold">{formatPKR(submittedOrder.estimatedCostPkr)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-bold text-xs rounded-xl shadow-glow-cyan"
            >
              Track Order in Dashboard
            </Link>
            <button
              onClick={() => {
                setSubmittedOrder(null);
                setProjectTitle("");
                setProjectDescription("");
                setFiles([]);
              }}
              className="px-6 py-3 bg-techlo-surface hover:bg-techlo-border text-white text-xs font-semibold rounded-xl"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Header */}
          <div className="space-y-2 border-b border-techlo-border/60 pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-techlo-cyan/15 border border-techlo-cyan/30 text-techlo-cyan text-xs font-bold">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Engineering Quotation Wizard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Request Custom Prototyping & Fabrication
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit your project files, schematics, or dimensions to get an exact quotation within a few hours.
            </p>
          </div>

          {/* Step 1: Service Type Select */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Engineering Service
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: "pcb_design", name: "PCB Design (KiCad/Altium)", icon: Cpu },
                { id: "pcb_fabrication", name: "PCB Fabrication Batching", icon: Layers },
                { id: "cad_3d_modeling", name: "3D CAD Enclosure Design", icon: Box },
                { id: "3d_printing", name: "Rapid 3D Printing", icon: Printer },
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = serviceType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-techlo-cyan/15 border-techlo-cyan text-white shadow-glow-cyan"
                        : "bg-techlo-surface border-techlo-border text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-techlo-cyan" : "text-slate-400"}`} />
                    <span className="text-xs font-bold leading-tight">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Project Details */}
          <div className="space-y-4 pt-4 border-t border-techlo-border/60">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Project Specifications & Requirements
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Project Title <span className="text-techlo-cyan">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 4-Layer ESP32 Telemetry Board or Weather-Proof Sensor Box"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-sm focus:border-techlo-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Detailed Specifications & Notes <span className="text-techlo-cyan">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your design specifications: e.g. Dimensions (100x60mm), Layer count (2 or 4 layers), Target material (PETG / PLA), Connector types (Type-C, JST-XH, Screw Terminals), microcontroller used..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs placeholder-slate-500 focus:border-techlo-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Step 3: File Upload Dropzone */}
          <div className="space-y-3 pt-4 border-t border-techlo-border/60">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Upload Design / Gerber / CAD Files
            </label>
            <FileUploadDropzone files={files} setFiles={setFiles} />
          </div>

          {/* Step 4: Contact, University & Budget */}
          <div className="space-y-4 pt-4 border-t border-techlo-border/60">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              4. Contact & Timeline
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Ahmed"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone (for Updates)</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">University / Campus</label>
                <select
                  value={clientUniversity}
                  onChange={(e) => setClientUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                >
                  {PAKISTANI_UNIVERSITIES.map((uni) => (
                    <option key={uni.id} value={uni.name} className="bg-techlo-dark">
                      {uni.shortName} - {uni.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Completion Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-mono">Rs.</span>
                  <input
                    type="number"
                    placeholder="4500"
                    value={budgetPkr}
                    onChange={(e) => setBudgetPkr(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Request & Uploading Files...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Service Request for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
