"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChotuAvatar } from "@/components/common/ChotuAvatar";
import { formatPKR } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import { isSuperAdminEmail, ADMIN_EMAIL } from "@/lib/admin";
import {
  Activity,
  Users,
  Cpu,
  Layers,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const isAuthorizedAdmin = Boolean(isAuthenticated && isSuperAdminEmail(user?.email));

  const [activeTab, setActiveTab] = useState<"activity" | "listings" | "quotes" | "users">("activity");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filterSearch, setFilterSearch] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadAdminData();
      const interval = setInterval(loadAdminData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthorizedAdmin]);

  const handleModerate = async (action: string, targetId: string, value?: any) => {
    setActionLoadingId(targetId);
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, value, adminName: user?.fullName || "Platform Admin" }),
      });
      const json = await res.json();
      if (json.success) {
        await loadAdminData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 space-y-6">
        <div className="p-8 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Admin Access Restricted
            </h1>
            <p className="text-xs text-neutral-500 leading-relaxed">
              This control center is strictly restricted to the platform administrator (<strong>{ADMIN_EMAIL}</strong>). Access is not available to regular accounts.
            </p>
          </div>

          {isAuthenticated ? (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 text-xs">
              <p className="text-neutral-500 text-[11px]">Currently signed in as:</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 break-all">{user?.email}</p>
              <p className="text-rose-500 text-[10px] font-medium">This account does not have administrator privileges.</p>
              <button
                onClick={() => openAuthModal("login")}
                className="w-full mt-2 py-2 px-4 bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-full cursor-pointer transition-all text-xs"
              >
                Sign In with Admin Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => openAuthModal("login")}
                className="w-full py-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold rounded-full shadow-xs cursor-pointer transition-all text-xs"
              >
                Sign In as Administrator
              </button>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    verifiedStudents: 0,
    totalProducts: 0,
    activeQuotes: 0,
    totalChats: 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold block mb-1">
            // MASTER CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Admin Activity & Moderation
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-5 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-medium">Verified Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-black dark:text-white">
            {stats.verifiedStudents} <span className="text-xs text-neutral-400 font-normal">/ {stats.totalUsers}</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-medium">Hardware Ads</span>
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-black dark:text-white">{stats.totalProducts}</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-medium">PCB / CAD Quotes</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-black dark:text-white">{stats.activeQuotes}</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-medium">Chat Messages</span>
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-black dark:text-white">{stats.totalChats}</div>
        </div>
      </div>

      {/* Tabs (Pi.dev pill group) */}
      <div className="flex bg-neutral-100/70 dark:bg-neutral-900/60 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60 max-w-xl">
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "activity"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Activity</span>
        </button>

        <button
          onClick={() => setActiveTab("listings")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "listings"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Listings</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "quotes"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Quotes</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "users"
              ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Students</span>
        </button>
      </div>

      {/* 1. Live Activity Feed */}
      {activeTab === "activity" && (
        <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Live Platform Activity Log
            </h2>
            <span className="text-[11px] text-neutral-400">Auto-updating every 10s</span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {data?.activityLogs && data.activityLogs.length > 0 ? (
              data.activityLogs.map((log: any) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                        {log.actionType}
                      </span>
                      <span className="font-semibold text-black dark:text-white">{log.title}</span>
                    </div>
                    <p className="text-neutral-500">{log.description}</p>
                    <span className="text-[10px] text-neutral-400">Actor: {log.actorName}</span>
                  </div>

                  <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400">No activity recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* 2. Listings Moderation */}
      {activeTab === "listings" && (
        <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 text-[11px] text-neutral-400 uppercase">
                <tr>
                  <th className="p-3.5">Component</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Seller</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {data?.recentProducts?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="p-3.5 font-semibold text-black dark:text-white max-w-xs truncate">
                      <Link href={`/marketplace/${p.id}`} target="_blank" className="hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3.5 text-neutral-500 uppercase text-[10px]">{p.category}</td>
                    <td className="p-3.5 font-bold text-black dark:text-white">{formatPKR(p.pricePkr)}</td>
                    <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                      {p.seller?.fullName} ({p.seller?.university})
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        p.status === "available" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleModerate("UPDATE_PRODUCT_STATUS", p.id, p.status === "available" ? "sold" : "available")}
                        className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleModerate("DELETE_PRODUCT", p.id)}
                        className="p-1 rounded-md hover:bg-rose-50 text-rose-500 cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Prototyping Quotes */}
      {activeTab === "quotes" && (
        <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 text-[11px] text-neutral-400 uppercase">
                <tr>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Project Scope</th>
                  <th className="p-3.5">Client & Campus</th>
                  <th className="p-3.5">Target Budget</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {data?.recentQuotes?.map((q: any) => (
                  <tr key={q.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="p-3.5 font-semibold text-black dark:text-white uppercase text-[10px]">
                      {q.serviceType.replace("_", " ")}
                    </td>
                    <td className="p-3.5 max-w-xs truncate font-medium text-neutral-800 dark:text-neutral-200">
                      {q.title}
                    </td>
                    <td className="p-3.5 text-neutral-500">
                      {q.clientName} ({q.clientUniversity}) • {q.clientPhone}
                    </td>
                    <td className="p-3.5 font-bold text-black dark:text-white">{formatPKR(q.estimatedCostPkr)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={q.status}
                        onChange={(e) => handleModerate("UPDATE_QUOTE_STATUS", q.id, e.target.value)}
                        className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-lg text-xs cursor-pointer"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="quoted">Quoted</option>
                        <option value="in_fabrication">In Fabrication</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Students Registry */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 text-[11px] text-neutral-400 uppercase">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">University / Campus</th>
                  <th className="p-3.5">Phone Number</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Verified Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {data?.recentUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <ChotuAvatar
                        name={u.fullName}
                        avatarUrl={u.avatarUrl}
                        color={u.avatarColor || "cyan"}
                        size="sm"
                      />
                      <div>
                        <span className="font-semibold text-black dark:text-white block">{u.fullName}</span>
                        <span className="text-[10px] text-neutral-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                      {u.university} ({u.campus || "Main"})
                    </td>
                    <td className="p-3.5 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                      {u.phoneNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleModerate("TOGGLE_USER_VERIFIED", u.id, !u.isVerifiedStudent)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          u.isVerifiedStudent
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {u.isVerifiedStudent ? "✓ Verified" : "+ Grant Badge"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
