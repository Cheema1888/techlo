"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TechloLogo } from "../branding/TechloLogo";
import { useAuth } from "@/lib/authContext";
import {
  Search,
  Plus,
  Cpu,
  Layers,
  GraduationCap,
  User,
  LogOut,
  ShieldCheck,
  Heart,
  Menu,
  X,
  FileText,
  ChevronDown,
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
    { name: "Services", href: "/services", highlight: true },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Universities", href: "/universities" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-md border-b border-neutral-800 transition-all">
      {/* Micro Status Bar */}
      <div className="border-b border-neutral-900 bg-[#080808] py-1.5 px-4 text-center text-[11px] text-neutral-400 font-mono hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white font-medium">TECHLO Prototyping & Hardware Exchange</span>
          <span className="text-neutral-600">/</span>
          <span>On-Demand PCB Fabrication & 3D CAD Services</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span>NUST • FAST • UET • GIKI • NED</span>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-200">Phone OTP Verified</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search components (ESP32, STM32, Stepper, KiCad PCB...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-1.5 bg-[#0e0e0e] hover:bg-[#141414] focus:bg-[#141414] border border-neutral-800 focus:border-neutral-500 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] rounded transition-colors cursor-pointer"
              >
                ↵
              </button>
            </div>
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "text-white bg-neutral-900 border border-neutral-700"
                      : link.highlight
                      ? "text-white hover:bg-neutral-900 border border-neutral-800"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Request Quote Button */}
            <Link
              href="/services/request"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-neutral-500 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Request Quote</span>
            </Link>

            {/* Sell Hardware Button (White Primary) */}
            <Link
              href="/sell"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-mono-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Sell Hardware</span>
            </Link>

            {/* Saved Wishlist */}
            <Link
              href="/dashboard"
              className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors hidden sm:flex items-center justify-center"
            >
              <Heart className="w-4 h-4" />
              {savedProductIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center font-mono">
                  {savedProductIds.length}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-6 h-6 rounded object-cover border border-neutral-700"
                  />
                  <span className="text-xs font-semibold text-white hidden md:block max-w-[90px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-neutral-400 truncate font-mono">{user.university}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Dashboard & Orders</span>
                    </Link>

                    <Link
                      href="/services/request"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Request Service Quote</span>
                    </Link>

                    <Link
                      href="/sell"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900"
                    >
                      <Plus className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Post Hardware Listing</span>
                    </Link>

                    <div className="border-t border-neutral-800 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 py-4 space-y-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 font-mono"
              />
            </form>

            <div className="flex flex-col gap-1 pt-1">
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-200 hover:bg-neutral-900"
              >
                <Layers className="w-4 h-4 text-neutral-400" />
                <span>PCB & 3D CAD Services</span>
              </Link>
              <Link
                href="/services/request"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-200 hover:bg-neutral-900"
              >
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Request a Quote</span>
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-200 hover:bg-neutral-900"
              >
                <Cpu className="w-4 h-4 text-neutral-400" />
                <span>Hardware Marketplace</span>
              </Link>
              <Link
                href="/universities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-200 hover:bg-neutral-900"
              >
                <GraduationCap className="w-4 h-4 text-neutral-400" />
                <span>Universities Directory</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
