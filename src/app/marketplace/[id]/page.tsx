"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { formatPKR, getConditionBadge, getCategoryLabel } from "@/lib/utils";
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/marketplace/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, savedProductIds, toggleSaveProduct } = useAuth();
  const productId = params?.id as string;

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [offerPrice, setOfferPrice] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // 1. Check local state first
    const found = products.find((p) => p.id === productId);
    if (found) {
      setProductData(found);
      setOfferPrice(found.pricePkr.toString());
      setLoading(false);
    }

    // 2. Fetch fresh from database API
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProductData(json.data);
          setOfferPrice(json.data.pricePkr.toString());
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, products]);

  if (loading && !productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-xs text-neutral-500">
        Loading hardware component details...
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Component Listing Not Found</h1>
        <p className="text-xs text-neutral-500">This hardware item may have been sold or removed by the student seller.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedProductIds.includes(productData.id);
  const conditionInfo = getConditionBadge(productData.condition);

  const rawPhone = productData.seller?.phone || productData.seller?.phoneNumber || "923000000000";
  const sellerName = productData.seller?.name || productData.seller?.fullName || "Seller";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${sellerName}! I saw your listing for "${productData.title}" on TECHLO (${formatPKR(productData.pricePkr)}). Is it still available for campus pickup?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const relatedProducts = products
    .filter((p) => p.id !== productData.id && (p.category === productData.category || p.seller?.university === productData.seller?.university))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${productData.title} on TECHLO`,
        text: `Check out ${productData.title} for ${formatPKR(productData.pricePkr)} on TECHLO!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Share listing"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => toggleSaveProduct(productData.id)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSaved
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Images (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Main Image View */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <img
              src={productData.images[activeImageIndex] || productData.images[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
              alt={productData.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 left-3 z-10">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs ${conditionInfo.badgeClass}`}>
                {conditionInfo.label}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {productData.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {productData.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    activeImageIndex === idx
                      ? "border-black dark:border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Technical Specs List */}
          {productData.specs && Object.keys(productData.specs).length > 0 && (
            <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(productData.specs).map(([k, v]: [string, any]) => (
                  <div key={k} className="p-2.5 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800/60">
                    <span className="text-neutral-400 text-[11px] block">{k}</span>
                    <span className="font-semibold text-black dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details & Purchase (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Info Card */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold block">
                {getCategoryLabel(productData.category)}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                {productData.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <span className="text-3xl font-bold text-black dark:text-white tracking-tight">
                {formatPKR(productData.pricePkr)}
              </span>
              {productData.originalPricePkr && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPKR(productData.originalPricePkr)}
                </span>
              )}
              {productData.isNegotiable && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  • Price Negotiable
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Item Overview
              </span>
              <p>{productData.description}</p>
            </div>

            {/* Campus Location */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              <span>Campus Pickup: <strong>{productData.location || productData.seller?.university}</strong></span>
            </div>

            {/* WhatsApp Direct Action */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Seller on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="p-6 bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl space-y-3 shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold block">
              Student Seller
            </span>
            <div className="flex items-center gap-3">
              <img
                src={productData.seller?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="Seller"
                className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{sellerName}</span>
                  {productData.seller?.isVerifiedStudent && (
                    <span title="Verified Student">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500">{productData.seller?.university}</p>
                <span className="text-[11px] text-neutral-400">★ {(productData.seller?.rating || 5.0).toFixed(1)} • {productData.seller?.dealsCompleted || 0} items traded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-neutral-200/70 dark:border-neutral-800/70">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            More from this Campus & Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
