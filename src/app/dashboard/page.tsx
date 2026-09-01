"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { formatPKR } from "@/lib/utils";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ChotuAvatar } from "@/components/common/ChotuAvatar";
import {
  User,
  ShieldCheck,
  Cpu,
  Layers,
  Heart,
  Phone,
  Building,
  MapPin,
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white flex items-center justify-center mx-auto shadow-xs">
          <User className="w-6 h-6 text-neutral-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Student Dashboard</h1>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Please sign in with your Pakistani university account and verified mobile number to manage your hardware listings and service quotes.
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

  const userProducts = products.filter(
    (p) => p.seller?.id === user?.id || (user?.phoneNumber && (p.seller?.phoneNumber === user.phoneNumber || p.seller?.phone === user.phoneNumber))
  );

  const userRequests = serviceRequests.filter(
    (r) => r.userId === user?.id || r.clientPhone === user?.phoneNumber
  );

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Profile Header Banner (Pi.dev clean profile card) */}
      <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <ChotuAvatar
              name={user.fullName}
              avatarUrl={user.avatarUrl}
              color={user.avatarColor || "cyan"}
              size="lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {user.fullName}
                </h1>
                {user.isVerifiedStudent ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Student</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal("verify_student")}
                    className="text-[11px] text-neutral-400 hover:text-black dark:hover:text-white underline"
                  >
                    Verify Student ID
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
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
              className="px-4 py-2 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Hardware</span>
            </Link>

            <Link
              href="/services/request"
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs rounded-full transition-all"
            >
              <span>Request Quote</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs (Pi.dev pill switcher) */}
      <div className="flex bg-neutral-100/70 dark:bg-neutral-900/60 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60 max-w-md">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "listings"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>My Listings ({userProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "orders"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Quotes ({userRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "saved"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
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
            <div className="p-12 text-center bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
              <Cpu className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-black dark:text-white">No active listings posted yet</h3>
              <p className="text-xs text-neutral-500">
                Sell your extra ESP32 boards, sensors, and motors to other students on campus.
              </p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full shadow-xs"
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
                  className="p-5 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] uppercase font-semibold text-neutral-700 dark:text-neutral-300">
                        {req.serviceType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{req.title}</span>
                    </div>
                    <p className="text-xs text-neutral-500">{req.description}</p>
                    <span className="text-[11px] text-neutral-400 block">Ref: #{req.id}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-black dark:text-white block">
                      {formatPKR(req.estimatedCostPkr)}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
              <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-black dark:text-white">No engineering quotes submitted yet</h3>
              <p className="text-xs text-neutral-500">
                Submit your Gerber files or 3D STEP models for rapid PCB fabrication and 3D printing.
              </p>
              <Link
                href="/services/request"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full shadow-xs"
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
            <div className="p-12 text-center bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
              <Heart className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-semibold text-black dark:text-white">Wishlist is empty</h3>
              <p className="text-xs text-neutral-500">
                Click the heart icon on any hardware item in the marketplace to save it for later.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full shadow-xs"
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
