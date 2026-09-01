"use client";

import React from "react";
import Link from "next/link";
import { ProductListing } from "@/lib/types";
import { formatPKR, getConditionBadge, getCategoryLabel } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import {
  Heart,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Eye,
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
  const cleanPhone = product.seller.phone.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${product.seller.name}! I saw your listing for "${product.title}" on TECHLO (Rs. ${product.pricePkr.toLocaleString()}). Is it still available for campus pickup?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="group relative flex flex-col bg-[#0a0a0a] hover:bg-[#0e0e0e] border border-neutral-800 hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-200">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141414]">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
          alt={product.title}
          className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />

        {/* Condition Tag Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-tight ${conditionInfo.badgeClass}`}
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
              ? "bg-white text-black"
              : "bg-black/60 text-white hover:bg-black"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-black" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="px-2 py-0.5 rounded bg-black/90 border border-neutral-800 text-white font-mono font-bold text-xs">
            {formatPKR(product.pricePkr)}
            {product.isNegotiable && (
              <span className="text-[9px] text-neutral-400 font-normal ml-1">
                (Nego)
              </span>
            )}
          </div>

          {product.originalPricePkr && (
            <span className="text-[9px] text-neutral-500 line-through bg-black/80 px-1 py-0.5 rounded font-mono">
              {formatPKR(product.originalPricePkr)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
            {getCategoryLabel(product.category)}
          </span>

          {/* Title */}
          <Link href={`/marketplace/${product.id}`} className="block mt-1">
            <h3 className="font-bold text-white text-xs line-clamp-2 group-hover:text-neutral-200 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Location & Seller Row */}
        <div className="pt-2 border-t border-neutral-800 space-y-2 text-xs">
          {/* Campus Tag */}
          <div className="flex items-center gap-1 text-neutral-400 font-mono text-[11px]">
            <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{product.location || product.seller.university}</span>
          </div>

          {/* Seller Profile Mini */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-300 font-medium truncate max-w-[120px]">
                {product.seller.name}
              </span>
              {product.seller.isVerifiedStudent && (
                <span title="Verified Pakistani Student">
                  <ShieldCheck className="w-3.5 h-3.5 text-white flex-shrink-0" />
                </span>
              )}
            </div>

            <div className="text-[10px] font-mono text-neutral-400">
              ★ {product.seller.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
          <Link
            href={`/marketplace/${product.id}`}
            className="w-full py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
