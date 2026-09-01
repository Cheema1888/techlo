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
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ProductCardProps {
  product: ProductListing;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { savedProductIds, toggleSaveProduct } = useAuth();
  const isSaved = savedProductIds.includes(product.id);
  const conditionInfo = getConditionBadge(product.condition);

  // Generate WhatsApp Direct Link
  const cleanPhone = product.seller.phone.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${product.seller.name}! I saw your listing for "${product.title}" on TECHLO (Rs. ${product.pricePkr.toLocaleString()}). Is it still available for campus pickup?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="group relative flex flex-col bg-techlo-dark hover:bg-techlo-surface/90 border border-techlo-border hover:border-techlo-cyan/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow-cyan">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-techlo-surface">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Condition Tag Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md shadow-sm ${conditionInfo.badgeClass}`}
          >
            {product.condition === "fyp_tested" && <Sparkles className="w-3 h-3" />}
            {conditionInfo.label}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
            isSaved
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-black/50 text-white/80 hover:text-white hover:bg-black/70"
          }`}
          title={isSaved ? "Remove from saved" : "Save item"}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="px-2.5 py-1 rounded-lg bg-techlo-dark/95 border border-techlo-border backdrop-blur-md text-white">
            <span className="font-mono font-black text-sm text-techlo-sky">
              {formatPKR(product.pricePkr)}
            </span>
            {product.isNegotiable && (
              <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                (Negotiable)
              </span>
            )}
          </div>

          {product.originalPricePkr && (
            <span className="text-[10px] text-slate-400 line-through bg-black/60 px-1.5 py-0.5 rounded">
              {formatPKR(product.originalPricePkr)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold text-techlo-cyan tracking-wider uppercase">
            {getCategoryLabel(product.category)}
          </span>

          {/* Title */}
          <Link href={`/marketplace/${product.id}`} className="block mt-1">
            <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-techlo-sky transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Location & Seller Row */}
        <div className="pt-2 border-t border-techlo-border/60 space-y-2">
          {/* Campus Tag */}
          <div className="flex items-center gap-1 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-techlo-cyan flex-shrink-0" />
            <span className="truncate font-medium">{product.location || product.seller.university}</span>
          </div>

          {/* Seller Profile Mini */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img
                src={product.seller.avatarUrl}
                alt={product.seller.name}
                className="w-5 h-5 rounded-full object-cover border border-techlo-cyan/40"
              />
              <span className="text-xs text-slate-300 font-medium truncate max-w-[110px]">
                {product.seller.name}
              </span>
              {product.seller.isVerifiedStudent && (
                <span title="Verified Pakistani Student">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
              ★ {product.seller.rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/marketplace/${product.id}`}
            className="w-full py-2 px-2.5 rounded-xl bg-techlo-surface hover:bg-techlo-border text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
