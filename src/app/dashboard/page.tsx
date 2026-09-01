"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { formatPKR, getConditionBadge } from "@/lib/utils";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  User,
  ShieldCheck,
  PlusCircle,
  Cpu,
  Layers,
  Heart,
  Settings,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  FileCode2,
  Trash2,
  Check,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    userProducts,
    serviceRequests,
    savedProductIds,
    products,
    markProductStatus,
    openAuthModal,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "saved">("listings");

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-techlo-cyan/60 shadow-glow-cyan"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {user?.fullName || "Muhammad Saad"}
                </h1>
                {user?.isVerifiedStudent ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Student
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal("verify_student")}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 cursor-pointer"
                  >
                    + Verify Student Badge
                  </button>
                )}

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan text-xs font-semibold">
                  <Phone className="w-3 h-3" />
                  Phone OTP Verified
                </span>
              </div>

              <p className="text-xs text-techlo-sky font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-techlo-cyan" />
                {user?.university || "National University of Sciences & Technology (NUST)"}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {user?.campus || "H-12 Islamabad"}
                </span>
                <span>•</span>
                <span className="text-amber-400 font-bold">★ {user?.rating || 4.9} Rating</span>
                <span>•</span>
                <span>{user?.dealsCompleted || 14} Successful Handoffs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="px-4 py-2.5 rounded-xl bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Ad</span>
            </Link>

            <Link
              href="/services/request"
              className="px-4 py-2.5 rounded-xl bg-techlo-surface hover:bg-techlo-border border border-techlo-border text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-4 h-4 text-techlo-sky" />
              <span>Request PCB/CAD</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-techlo-dark p-1.5 rounded-2xl border border-techlo-border max-w-md">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "listings"
              ? "bg-techlo-cyan text-techlo-dark shadow-glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>My Hardware ({userProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "orders"
              ? "bg-techlo-cyan text-techlo-dark shadow-glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Prototyping Orders ({serviceRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "saved"
              ? "bg-techlo-cyan text-techlo-dark shadow-glow-cyan"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved ({savedProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: My Hardware Listings */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Your Listed Hardware Items</h2>
            <Link href="/sell" className="text-xs text-techlo-cyan hover:underline font-semibold">
              + Add Another Component
            </Link>
          </div>

          {userProducts.length === 0 ? (
            <div className="p-12 text-center bg-techlo-dark border border-techlo-border rounded-3xl space-y-3">
              <Cpu className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">You have not listed any hardware yet</h3>
              <p className="text-xs text-slate-400">
                Turn your unused ESP32s, sensors, and motors into cash by listing them on campus.
              </p>
              <Link
                href="/sell"
                className="inline-block px-5 py-2.5 bg-techlo-cyan text-techlo-dark font-bold text-xs rounded-xl shadow-glow-cyan"
              >
                Post Your First Ad
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-techlo-dark border border-techlo-border rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-techlo-surface">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === "available"
                            ? "bg-emerald-500 text-white"
                            : p.status === "reserved"
                            ? "bg-amber-500 text-white"
                            : "bg-slate-600 text-white"
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-techlo-dark/90 text-techlo-sky font-mono font-bold text-xs">
                      {formatPKR(p.pricePkr)}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-white text-xs line-clamp-2">{p.title}</h4>
                    <div className="flex gap-2 pt-1">
                      {p.status !== "sold" ? (
                        <button
                          onClick={() => markProductStatus(p.id, "sold")}
                          className="flex-1 py-1.5 bg-techlo-surface hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-techlo-border rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Mark as Sold
                        </button>
                      ) : (
                        <button
                          onClick={() => markProductStatus(p.id, "available")}
                          className="flex-1 py-1.5 bg-techlo-surface hover:bg-techlo-border text-slate-300 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Reactivate Ad
                        </button>
                      )}
                      <Link
                        href={`/marketplace/${p.id}`}
                        className="p-1.5 bg-techlo-surface hover:bg-techlo-border border border-techlo-border rounded-lg text-slate-300"
                        title="View Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Prototyping & Service Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Custom Engineering Requests</h2>
            <Link href="/services/request" className="text-xs text-techlo-cyan hover:underline font-semibold">
              + New Quotation Request
            </Link>
          </div>

          <div className="space-y-3">
            {serviceRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-techlo-dark border border-techlo-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-techlo-cyan/15 text-techlo-cyan font-mono font-bold text-[10px] rounded">
                      #{req.id.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 bg-techlo-surface text-slate-300 text-[10px] font-bold rounded uppercase">
                      {req.serviceType.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : req.status === "in_progress"
                          ? "bg-techlo-cyan/20 text-techlo-sky"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      ● {req.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{req.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{req.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                    <span className="font-mono font-bold text-techlo-sky text-sm">
                      {formatPKR(req.estimatedCostPkr)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Saved Hardware */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Your Saved Wishlist</h2>
          {savedProducts.length === 0 ? (
            <div className="p-12 text-center bg-techlo-dark border border-techlo-border rounded-3xl space-y-2">
              <Heart className="w-12 h-12 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No hardware saved to your wishlist yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
