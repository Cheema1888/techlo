"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { formatPKR, getConditionBadge } from "@/lib/utils";
import { ProductCard } from "@/components/marketplace/ProductCard";
import {
  User,
  ShieldCheck,
  Cpu,
  Layers,
  Heart,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    isAuthenticated,
    serviceRequests,
    savedProductIds,
    products,
    openAuthModal,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "saved">("listings");

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center font-mono space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-black dark:text-white">Student Dashboard</h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto font-sans">
            Please sign in with your Pakistani university account and verified mobile number to manage your hardware listings and PCB/CAD requests.
          </p>
        </div>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-sm cursor-pointer"
        >
          Sign In with University Account
        </button>
      </div>
    );
  }

  const userProducts = products.filter(
    (p) => p.seller?.id === user?.id || p.seller?.phoneNumber === user?.phoneNumber
  );

  const userRequests = serviceRequests.filter(
    (r) => r.userId === user?.id || r.clientPhone === user?.phoneNumber
  );

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt="Avatar"
              className="w-16 h-16 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">
                  {user.fullName}
                </h1>
                {user.isVerifiedStudent ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Student</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal("verify_student")}
                    className="text-[11px] text-neutral-500 hover:text-black dark:hover:text-white underline"
                  >
                    Verify Student ID
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.university}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.phoneNumber}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{user.campus || user.city}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sell"
              className="px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post New Hardware</span>
            </Link>

            <Link
              href="/services/request"
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold text-xs rounded-xl transition-all"
            >
              <span>Request Quote</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex gap-6 text-xs">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "listings"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>My Hardware Listings ({userProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Service Requests ({userRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "saved"
              ? "border-black dark:border-white text-black dark:text-white"
              : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({savedProducts.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "listings" && (
        <div>
          {userProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm">
              <Cpu className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">No active listings posted yet</h3>
              <p className="text-xs text-neutral-500 font-sans">
                Sell your extra ESP32 boards, sensors, and motors to other students on campus.
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Your First Item</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          {userRequests.length > 0 ? (
            <div className="space-y-3">
              {userRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-bold">
                        {req.serviceType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-black dark:text-white">{req.title}</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-sans">{req.description}</p>
                    <span className="text-[10px] text-neutral-400 block">Ref: #{req.id}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-black dark:text-white block">
                      {formatPKR(req.estimatedCostPkr)}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm">
              <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">No engineering quotes submitted yet</h3>
              <p className="text-xs text-neutral-500 font-sans">
                Submit your Gerber files or 3D STEP models for rapid PCB fabrication and 3D printing.
              </p>
              <Link
                href="/services/request"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-sm"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div>
          {savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm">
              <Heart className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">Wishlist is empty</h3>
              <p className="text-xs text-neutral-500 font-sans">
                Click the heart icon on any hardware item in the marketplace to save it for later.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl shadow-sm"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
