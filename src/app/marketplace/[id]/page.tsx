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
  AlertTriangle,
  Send,
  Eye,
  Check,
  Tag,
  Clock,
  Sparkles,
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
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inquirySentSuccess, setInquirySentSuccess] = useState(false);

  useEffect(() => {
    // 1. Check local context first
    const found = products.find((p) => p.id === productId);
    if (found) {
      setProductData(found);
      setOfferPrice(found.pricePkr.toString());
      setLoading(false);
    }

    // 2. Fetch fresh from API
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

  const product = productData || products[0];
  const isSaved = savedProductIds.includes(product?.id);
  const conditionInfo = getConditionBadge(product?.condition || "fyp_tested");

  // WhatsApp Link
  const cleanPhone = (product?.seller?.phone || "").replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${product?.seller?.name}! I saw your listing for "${product?.title}" on TECHLO (Rs. ${product?.pricePkr?.toLocaleString()}). Is it still available for campus handoff at ${product?.seller?.campus || product?.location}?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on TECHLO for ${formatPKR(product.pricePkr)}`,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySentSuccess(true);
    setTimeout(() => {
      setIsInquiryModalOpen(false);
      setInquirySentSuccess(false);
    }, 1500);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product?.id && (p.category === product?.category || p.seller?.university === product?.seller?.university))
    .slice(0, 4);

  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono">
        <p className="text-neutral-500">Loading hardware details...</p>
      </div>
    );
  }

  // Schema.org Product JSON-LD for On-Page SEO
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.pricePkr,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: product.seller.name,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-mono">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Back Button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Image */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Condition Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono font-bold ${conditionInfo.badgeClass}`}>
                {conditionInfo.label}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleSaveProduct(product.id)}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white/80 dark:bg-black/60 text-black dark:text-white hover:bg-white dark:hover:bg-black"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-black dark:border-white"
                      : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
              Component Details & Description
            </h2>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
              {product.description}
            </p>

            {/* Technical Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <h3 className="text-xs font-bold text-black dark:text-white uppercase">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex justify-between gap-2"
                    >
                      <span className="text-neutral-500 font-medium">{key}:</span>
                      <span className="text-black dark:text-white font-bold text-right truncate">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Details Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Pricing Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                {getCategoryLabel(product.category)}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mt-1 leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-3xl font-black text-black dark:text-white">
                {formatPKR(product.pricePkr)}
              </span>
              {product.originalPricePkr && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPKR(product.originalPricePkr)}
                </span>
              )}
              {product.isNegotiable && (
                <span className="text-[11px] text-neutral-500 font-medium">
                  (Price Negotiable)
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="flex-1 py-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Make Price Offer</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Share listing"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
              Seller Information
            </span>

            <div className="flex items-center gap-3">
              <img
                src={product.seller.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={product.seller.name}
                className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-black dark:text-white text-sm">
                    {product.seller.name}
                  </span>
                  {product.seller.isVerifiedStudent && (
                    <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500">
                  {product.seller.university}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              <div className="p-2 bg-neutral-50 dark:bg-[#121212] rounded-lg">
                <span className="block text-[10px] text-neutral-500">Pickup Campus</span>
                <strong className="text-black dark:text-white truncate block">{product.location || product.seller.campus}</strong>
              </div>
              <div className="p-2 bg-neutral-50 dark:bg-[#121212] rounded-lg">
                <span className="block text-[10px] text-neutral-500">Deals Done</span>
                <strong className="text-black dark:text-white">{product.seller.dealsCompleted || 8} completed</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-black dark:text-white">Make an Offer to {product.seller.name}</h3>
            {inquirySentSuccess ? (
              <div className="p-4 bg-neutral-100 dark:bg-[#121212] rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 text-black dark:text-white mx-auto" />
                <p className="text-xs font-bold text-black dark:text-white">Offer dispatched via WhatsApp!</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px]">Your Offer (PKR)</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl text-black dark:text-white font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold cursor-pointer"
                  >
                    Send Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-5">
          <h2 className="text-lg font-bold text-black dark:text-white">
            Similar Hardware on Campus
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
