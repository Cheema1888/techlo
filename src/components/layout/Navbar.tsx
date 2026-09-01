"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TechloLogo } from "../branding/TechloLogo";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeContext";
import { ChotuAvatar } from "../common/ChotuAvatar";
import {
  Search,
  Plus,
  MessageCircle,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
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
    { name: "Marketplace", href: "/marketplace" },
    { name: "PCB & CAD Services", href: "/services" },
    { name: "Universities", href: "/universities" },
    { name: "Live Chat", href: "/chat" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <TechloLogo size="md" showTagline={false} />
          </Link>

          {/* Navigation Links (Desktop - Pi.dev Clean Pills) */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/70 dark:bg-neutral-900/60 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xs relative items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search hardware, chips, campuses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100/70 dark:bg-neutral-900/60 focus:bg-white dark:focus:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800/70 focus:border-black dark:focus:border-white rounded-full text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none transition-all"
              />
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Chat Direct Icon (When signed in) */}
            {isAuthenticated && (
              <Link
                href="/chat"
                className="p-2 rounded-full bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all"
                title="Open Web Chat"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Theme Toggle (Day / Night) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Day Mode (Light)" : "Night Mode (Dark)"}`}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700" />
              )}
            </button>

            {/* Post Hardware Button */}
            <Link
              href="/sell"
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Ad</span>
            </Link>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all cursor-pointer"
                >
                  <ChotuAvatar
                    name={user.fullName}
                    avatarUrl={user.avatarUrl}
                    color={user.avatarColor || "cyan"}
                    size="xs"
                  />
                  <span className="text-xs font-medium text-black dark:text-white hidden sm:block max-w-[90px] truncate">
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800/80">
                      <p className="text-xs font-bold text-black dark:text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{user.university}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Dashboard & Listings</span>
                    </Link>

                    <Link
                      href="/chat"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Web Chat</span>
                    </Link>

                    <Link
                      href="/services/request"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Request Prototyping</span>
                    </Link>

                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <Shield className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Admin Control Panel</span>
                    </Link>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>

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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-black dark:hover:border-white text-black dark:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-400 md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span>Admin Panel</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
