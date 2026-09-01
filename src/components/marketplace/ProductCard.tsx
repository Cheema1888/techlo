"use client";

import React from "react";
import Link from "next/link";
import { ProductListing } from "@/lib/types";
import { formatPKR, getConditionBadge, getCategoryLabel } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import { ChotuAvatar } from "../common/ChotuAvatar";
import {
  Heart,
  MessageCircle,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  Lock,
} from "lucide-react";

interface ProductCardProps {
  product: ProductListing;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { savedProductIds, toggleSaveProduct } = useAuth();
  const isSaved = savedProductIds.includes(product.id);
  const conditionInfo = getConditionBadge(product.condition);

  const rawPhone = product.seller?.phone || product.seller?.phoneNumber;
  const sellerName = product.seller?.name || product.seller?.fullName || "Seller";
  const hasVisiblePhone = Boolean(product.showPhoneNumber && rawPhone);

  const cleanPhone = (rawPhone || "923000000000").replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${sellerName}! I saw your listing for "${product.title}" on TECHLO (${formatPKR(product.pricePkr)}). Is it still available for campus pickup?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;
  const webChatUrl = `/chat?productId=${product.id}&sellerId=${product.seller?.id}`;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src={product.images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
        />

        {/* Condition Tag Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-tight shadow-xs ${conditionInfo.badgeClass}`}
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
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isSaved
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/80 dark:bg-black/60 text-black dark:text-white hover:bg-white dark:hover:bg-black"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white font-semibold text-xs shadow-xs">
            {formatPKR(product.pricePkr)}
            {product.isNegotiable && (
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal ml-1">
                (Nego)
              </span>
            )}
          </div>

          {product.originalPricePkr && (
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through bg-white/90 dark:bg-black/80 px-1.5 py-0.5 rounded-md">
              {formatPKR(product.originalPricePkr)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            {getCategoryLabel(product.category)}
          </span>

          {/* Title */}
          <Link href={`/marketplace/${product.id}`} className="block mt-1">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Location & Seller */}
        <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2 text-xs">
          {/* Campus Tag */}
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs">
            <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{product.location || product.seller?.university || "Campus Pickup"}</span>
          </div>

          {/* Seller Profile Mini with ChotuAvatar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ChotuAvatar
                name={sellerName}
                avatarUrl={product.seller?.avatarUrl}
                color={product.seller?.avatarColor || "cyan"}
                size="xs"
              />
              <div className="flex items-center gap-1 truncate max-w-[110px]">
                <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">
                  {sellerName}
                </span>
                {product.seller?.isVerifiedStudent && (
                  <span title="Verified Pakistani Student">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 font-medium">
              ★ {(product.seller?.rating || 5.0).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <Link
            href={`/marketplace/${product.id}`}
            className="w-full py-1.5 px-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1 transition-colors font-medium"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400" />
          </Link>

          {hasVisiblePhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-2 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black flex items-center justify-center gap-1 transition-colors font-medium"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <Link
              href={webChatUrl}
              className="w-full py-1.5 px-2 rounded-xl bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black flex items-center justify-center gap-1 transition-colors font-medium"
              title="Phone number hidden by seller • Chat on TECHLO"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Web Chat</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
