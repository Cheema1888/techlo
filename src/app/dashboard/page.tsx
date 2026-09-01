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
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  FileCode2,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    serviceRequests,
    savedProductIds,
    products,
    openAuthModal,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "saved">("listings");

  const userProducts = products.filter(
    (p) => p.seller.id === user?.id || p.seller.email === user?.email || p.seller.name.includes("Saad")
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
                  {user?.fullName || "Muhammad Saad"}
                </h1>
                {user?.isVerifiedStudent ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Student Badge
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal("verify_student")}
                    className="text-[11px] text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    Verify .edu.pk Student ID
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {user?.university || "National University of Sciences & Technology (NUST)"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user?.campus || "H-12 Islamabad"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Hardware</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="p-3 bg-neutral-50 dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Active Listings</span>
            <span className="text-base font-bold text-black dark:text-white">{userProducts.length} items</span>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Service Quotes</span>
            <span className="text-base font-bold text-black dark:text-white">{serviceRequests.length} active</span>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Saved Items</span>
            <span className="text-base font-bold text-black dark:text-white">{savedProductIds.length} saved</span>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Campus Rating</span>
            <span className="text-base font-bold text-black dark:text-white">★ 4.9 / 5.0</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-[#0a0a0a] p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "listings"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          My Hardware Listings ({userProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          PCB & CAD Quotes ({serviceRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "saved"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          Wishlist ({savedProducts.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          {userProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Cpu className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">No hardware listed yet</h3>
              <p className="text-xs text-neutral-500">Sell your unused sensors and dev boards to students.</p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post an Ad</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-3">
          {serviceRequests.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">No Service Requests</h3>
              <p className="text-xs text-neutral-500">Order PCB fabrication batches or custom 3D enclosures.</p>
              <Link
                href="/services/request"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold"
              >
                <span>Request Service Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black dark:text-white">{req.title}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-[10px] uppercase">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-[11px]">{req.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-black dark:text-white block">
                      {formatPKR(req.estimatedCostPkr)}
                    </span>
                    <span className="text-[10px] text-neutral-500">Ref #{req.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedProducts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0a0a0a] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <Heart className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-black dark:text-white">Wishlist is empty</h3>
              <p className="text-xs text-neutral-500">Save items while browsing the marketplace.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {savedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
