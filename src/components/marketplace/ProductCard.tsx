"use client";

import React from "react";
import Link from "next/link";
import { ProductListing } from "@/lib/types";
import { formatPKR, getConditionBadge, getCategoryLabel } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import {
  Heart,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface ProductCardProps {
  product: ProductListing;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { savedProductIds, toggleSaveProduct } = useAuth();
  const isSaved = savedProductIds.includes(product.id);
  const conditionInfo = getConditionBadge(product.condition);

  // WhatsApp Direct Link
  const rawPhone = product.seller?.phone || product.seller?.phoneNumber || "923000000000";
  const sellerName = product.seller?.name || product.seller?.fullName || "Seller";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${sellerName}! I saw your listing for "${product.title}" on TECHLO (Rs. ${product.pricePkr.toLocaleString()}). Is it still available for campus pickup?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#0a0a0a] hover:bg-neutral-50 dark:hover:bg-[#0e0e0e] border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md font-mono">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-[#141414]">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
        />

        {/* Condition Tag Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-tight ${conditionInfo.badgeClass}`}
          >
            {conditionInfo.label}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
            isSaved
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/80 dark:bg-black/60 text-black dark:text-white hover:bg-white dark:hover:bg-black"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="px-2 py-0.5 rounded bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white font-bold text-xs shadow-sm">
            {formatPKR(product.pricePkr)}
            {product.isNegotiable && (
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-normal ml-1">
                (Nego)
              </span>
            )}
          </div>

          {product.originalPricePkr && (
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 line-through bg-white/90 dark:bg-black/80 px-1 py-0.5 rounded">
              {formatPKR(product.originalPricePkr)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            {getCategoryLabel(product.category)}
          </span>

          {/* Title */}
          <Link href={`/marketplace/${product.id}`} className="block mt-1">
            <h3 className="font-bold text-black dark:text-white text-xs line-clamp-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Location & Seller Row */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
          {/* Campus Tag */}
          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 text-[11px]">
            <MapPin className="w-3 h-3 text-neutral-500 flex-shrink-0" />
            <span className="truncate">{product.location || product.seller?.university || "Campus Pickup"}</span>
          </div>

          {/* Seller Profile Mini */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-800 dark:text-neutral-300 font-medium truncate max-w-[120px]">
                {sellerName}
              </span>
              {product.seller?.isVerifiedStudent && (
                <span title="Verified Pakistani Student">
                  <ShieldCheck className="w-3.5 h-3.5 text-black dark:text-white flex-shrink-0" />
                </span>
              )}
            </div>

            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">
              ★ {(product.seller?.rating || 5.0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <Link
            href={`/marketplace/${product.id}`}
            className="w-full py-1.5 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1 transition-colors font-bold"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-2 rounded-lg bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black flex items-center justify-center gap-1 transition-colors font-bold"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
