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
  Check,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function RequestServicePage() {
  const { createServiceRequest, user } = useAuth();

  const [serviceType, setServiceType] = useState<EngineeringServiceType>("pcb_design");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [clientName, setClientName] = useState(user?.fullName || "");
  const [clientUniversity, setClientUniversity] = useState(user?.university || PAKISTANI_UNIVERSITIES[0].name);
  const [clientPhone, setClientPhone] = useState(user?.phoneNumber || "+92 3");
  const [deadline, setDeadline] = useState("");
  const [budgetPkr, setBudgetPkr] = useState<string>("4500");

  const [files, setFiles] = useState<Array<{ id: string; name: string; size: string; type: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription) {
      alert("Please enter project title and description");
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
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </Link>
      </div>

      {submittedOrder ? (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 text-center space-y-6 animate-fadeIn font-mono">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mx-auto">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          <div className="space-y-1">
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded">
              ORDER REF: #{submittedOrder.id.toUpperCase()}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
              Quotation Request Received
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Our engineering team is reviewing your files for &quot;{submittedOrder.title}&quot;.
            </p>
          </div>

          <div className="p-4 bg-[#121212] border border-neutral-800 rounded-xl max-w-sm mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <span className="text-white font-bold">Under Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Estimated Cost:</span>
              <span className="text-white font-bold">{formatPKR(submittedOrder.estimatedCostPkr)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-mono-sm"
            >
              Track in Dashboard
            </Link>
            <button
              onClick={() => {
                setSubmittedOrder(null);
                setProjectTitle("");
                setProjectDescription("");
                setFiles([]);
              }}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs rounded-xl"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="space-y-1 pb-4 border-b border-neutral-800">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block">
              // SERVICE QUOTATION REQUEST
            </span>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              Request Prototyping Quotation
            </h1>
            <p className="text-xs text-neutral-400">
              Submit your project files, schematics, or dimensions to get an official quote.
            </p>
          </div>

          {/* Service Selector */}
          <div className="space-y-2 font-mono">
            <label className="text-xs uppercase text-neutral-400 block">1. Select Service</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "pcb_design", label: "PCB Design", icon: Cpu },
                { id: "pcb_fabrication", label: "PCB Fabrication", icon: Layers },
                { id: "cad_3d_modeling", label: "3D CAD Modeling", icon: Box },
                { id: "3d_printing", label: "3D Printing", icon: Printer },
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = serviceType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-black border-white font-bold"
                        : "bg-[#111111] border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4 pt-4 border-t border-neutral-800 font-mono">
            <label className="text-xs uppercase text-neutral-400 block">2. Project Details</label>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 4-Layer ESP32 Telemetry Board or Weather-Proof Sensor Box"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-neutral-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Specifications & Requirements *</label>
              <textarea
                required
                rows={4}
                placeholder="Dimensions, layer count, target MCU, mounting points, connector types..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs placeholder-neutral-600 focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Files */}
          <div className="space-y-2 pt-4 border-t border-neutral-800">
            <label className="text-xs uppercase text-neutral-400 font-mono block">
              3. Upload Gerbers / CAD / Schematics
            </label>
            <FileUploadDropzone files={files} setFiles={setFiles} />
          </div>

          {/* Contact & Timeline */}
          <div className="space-y-4 pt-4 border-t border-neutral-800 font-mono">
            <label className="text-xs uppercase text-neutral-400 block">4. Contact & Details</label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Phone (for Updates)</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">University</label>
                <select
                  value={clientUniversity}
                  onChange={(e) => setClientUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs"
                >
                  {PAKISTANI_UNIVERSITIES.map((uni) => (
                    <option key={uni.id} value={uni.name} className="bg-black">
                      {uni.shortName} - {uni.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Target Completion Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300">Target Budget (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-neutral-500">Rs.</span>
                  <input
                    type="number"
                    value={budgetPkr}
                    onChange={(e) => setBudgetPkr(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 font-mono">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-mono-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Service Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
