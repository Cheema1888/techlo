"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TechloLogo } from "../branding/TechloLogo";
import { useAuth } from "@/lib/authContext";
import {
  Search,
  PlusCircle,
  Cpu,
  Layers,
  GraduationCap,
  User,
  LogOut,
  ShieldCheck,
  Heart,
  Menu,
  X,
  FileCode2,
  ChevronDown,
  Sparkles,
  MapPin,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, logout, savedProductIds } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Hardware Market", href: "/marketplace", icon: Cpu },
    { name: "PCB & CAD Services", href: "/services", icon: Layers, highlight: true },
    { name: "Universities", href: "/universities", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-techlo-dark/90 backdrop-blur-xl border-b border-techlo-border/60 transition-all">
      {/* Top micro-bar for student campus notice */}
      <div className="bg-gradient-to-r from-techlo-surface via-techlo-navy to-techlo-surface border-b border-techlo-border/40 py-1 px-4 text-center text-xs text-slate-300 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="inline-flex items-center gap-1 text-techlo-cyan font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            TECHLO for Pakistani Students:
          </span>
          <span>Buy & Sell FYP Hardware, Order Custom PCBs & 3D Printed Enclosures</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-techlo-cyan" />
            Covering 25+ Campuses (NUST, FAST, UET, GIKI, NED)
          </span>
          <span className="text-techlo-border">•</span>
          <span className="text-emerald-400 font-medium">✓ Phone OTP Verified Sellers</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <TechloLogo size="md" />
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components (ESP32, STM32, LiPo, Stepper, Sensors...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 bg-techlo-surface/80 hover:bg-techlo-surface focus:bg-techlo-surface border border-techlo-border rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-techlo-cyan focus:ring-1 focus:ring-techlo-cyan transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark font-bold text-xs rounded-full transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-techlo-cyan bg-techlo-surface border border-techlo-border"
                      : link.highlight
                      ? "text-white bg-techlo-surface/40 hover:bg-techlo-surface border border-techlo-cyan/30 text-techlo-sky"
                      : "text-slate-300 hover:text-white hover:bg-techlo-surface/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? "text-techlo-cyan" : ""}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Post Ad Button */}
            <Link
              href="/sell"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Hardware</span>
            </Link>

            {/* Saved Wishlist */}
            <Link
              href="/dashboard"
              className="relative p-2 rounded-xl bg-techlo-surface border border-techlo-border text-slate-300 hover:text-white hover:border-techlo-cyan/40 transition-colors hidden sm:flex items-center justify-center"
              title="Saved Items"
            >
              <Heart className="w-4 h-4" />
              {savedProductIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-techlo-cyan text-techlo-dark text-[10px] font-black flex items-center justify-center">
                  {savedProductIds.length}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan/40 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-techlo-cyan/50"
                  />
                  <div className="text-left hidden md:block">
                    <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                      {user.fullName.split(" ")[0]}
                    </span>
                    {user.isVerifiedStudent && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-techlo-dark border border-techlo-border rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-techlo-border/60">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.university}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-techlo-surface"
                    >
                      <User className="w-4 h-4 text-techlo-cyan" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      href="/sell"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-techlo-surface"
                    >
                      <PlusCircle className="w-4 h-4 text-techlo-sky" />
                      <span>Post Hardware Listing</span>
                    </Link>

                    <Link
                      href="/services/request"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-techlo-surface"
                    >
                      <FileCode2 className="w-4 h-4 text-emerald-400" />
                      <span>Request PCB / 3D CAD Quote</span>
                    </Link>

                    {!user.isVerifiedStudent && (
                      <button
                        onClick={() => openAuthModal("verify_student")}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-emerald-400 hover:bg-techlo-surface"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Verify Student Badge</span>
                      </button>
                    )}

                    <div className="border-t border-techlo-border/60 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-techlo-surface border border-techlo-border hover:border-techlo-cyan text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-techlo-cyan" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-techlo-surface border border-techlo-border text-slate-300 lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-techlo-border py-4 space-y-3 animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-sm text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-techlo-cyan text-techlo-dark font-bold text-xs rounded-lg"
              >
                Go
              </button>
            </form>

            <div className="flex flex-col gap-1 pt-2">
              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-techlo-surface"
              >
                <Cpu className="w-4 h-4 text-techlo-cyan" />
                <span>Hardware Marketplace</span>
              </Link>

              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-techlo-surface"
              >
                <Layers className="w-4 h-4 text-techlo-sky" />
                <span>PCB & 3D CAD Services</span>
              </Link>

              <Link
                href="/universities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-techlo-surface"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>University Campus Hubs</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-techlo-surface"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>Student Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
