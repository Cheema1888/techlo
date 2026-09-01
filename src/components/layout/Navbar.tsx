"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TechloLogo } from "../branding/TechloLogo";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeContext";
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
  Sun,
  Moon,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, logout, savedProductIds } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    { name: "Marketplace", href: "/marketplace", highlight: true },
    { name: "PCB & CAD Services", href: "/services" },
    { name: "Universities", href: "/universities" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAFA]/90 dark:bg-[#050505]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Micro Status Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-900 bg-[#F0F0F0] dark:bg-[#080808] py-1 px-4 text-center text-[11px] text-neutral-600 dark:text-neutral-400 font-mono hidden md:flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
          <span className="text-black dark:text-white font-medium">TECHLO: Student Hardware Marketplace</span>
          <span className="text-neutral-400 dark:text-neutral-600">/</span>
          <span>Buy & Sell Components + On-Demand PCB & 3D Prototyping</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <span>NUST • FAST • UET • GIKI • NED</span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="text-black dark:text-neutral-200">Phone OTP Verified</span>
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search ESP32, STM32, Stepper, Sensors, KiCad PCB..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-14 py-1.5 bg-white dark:bg-[#0e0e0e] hover:bg-neutral-50 dark:hover:bg-[#141414] focus:bg-white dark:focus:bg-[#141414] border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-neutral-500 rounded-lg text-xs text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none transition-all font-mono"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white font-mono text-[10px] rounded border border-neutral-200 dark:border-neutral-700 transition-colors cursor-pointer"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? "text-black dark:text-white bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700"
                      : link.highlight
                      ? "text-black dark:text-white font-bold bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Day / Night) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Day Mode (Light)" : "Night Mode (Dark)"}`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* Sell Hardware Button */}
            <Link
              href="/sell"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-mono font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Sell Item</span>
            </Link>

            {/* Saved Wishlist */}
            <Link
              href="/dashboard"
              className="relative p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors hidden sm:flex items-center justify-center"
            >
              <Heart className="w-4 h-4" />
              {savedProductIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[9px] font-black flex items-center justify-center font-mono">
                  {savedProductIds.length}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-6 h-6 rounded object-cover border border-neutral-300 dark:border-neutral-700"
                  />
                  <span className="text-xs font-mono font-semibold text-black dark:text-white hidden md:block max-w-[90px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-bold text-black dark:text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate font-mono">{user.university}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Dashboard & Orders</span>
                    </Link>

                    <Link
                      href="/services/request"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Service Quote</span>
                    </Link>

                    <Link
                      href="/sell"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Hardware Listing</span>
                    </Link>

                    <div className="border-t border-neutral-200 dark:border-neutral-800 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 text-black dark:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 py-4 space-y-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-black dark:text-white placeholder-neutral-400 font-mono"
              />
            </form>

            <div className="flex flex-col gap-1 pt-1 font-mono">
              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <Cpu className="w-4 h-4" />
                <span>Hardware Marketplace</span>
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <Layers className="w-4 h-4" />
                <span>PCB & 3D CAD Services</span>
              </Link>
              <Link
                href="/universities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Universities Directory</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
