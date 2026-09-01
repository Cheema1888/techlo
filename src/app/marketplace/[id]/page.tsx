"use client";

import React, { useState } from "react";
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
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/marketplace/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products, savedProductIds, toggleSaveProduct, openAuthModal, user } = useAuth();
  const productId = params?.id as string;

  const product = products.find((p) => p.id === productId) || products[0];
  const isSaved = savedProductIds.includes(product.id);
  const conditionInfo = getConditionBadge(product.condition);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [offerPrice, setOfferPrice] = useState(product.pricePkr.toString());
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inquirySentSuccess, setInquirySentSuccess] = useState(false);

  // WhatsApp Link
  const cleanPhone = product.seller.phone.replace(/[^0-9]/g, "");
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${product.seller.name}! I saw your listing for "${product.title}" on TECHLO (Rs. ${product.pricePkr.toLocaleString()}). Is it still available for handoff at ${product.seller.campus}?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on TECHLO for ${formatPKR(product.pricePkr)}`,
        url: window.location.href,
      });
    } else {
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
    .filter((p) => p.id !== product.id && (p.category === product.category || p.seller.university === product.seller.university))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-techlo-cyan transition-colors"
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
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-techlo-surface border border-techlo-border shadow-2xl">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Condition Tag */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md shadow-lg ${conditionInfo.badgeClass}`}
              >
                {product.condition === "fyp_tested" && <Sparkles className="w-3.5 h-3.5" />}
                {conditionInfo.label}
              </span>
            </div>

            {/* Quantity Available */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-techlo-dark/90 border border-techlo-border text-xs text-slate-300 backdrop-blur-md">
              Available: <strong className="text-white font-mono">{product.quantityAvailable} units</strong>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-techlo-cyan shadow-glow-cyan"
                      : "border-techlo-border opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Technical Details */}
          <div className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Component Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-techlo-border/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Technical Specifications & Included Items
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-techlo-surface/50 border border-techlo-border/60 rounded-xl flex justify-between gap-2"
                    >
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="text-white font-semibold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Info & Seller Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price & Primary Actions Card */}
          <div className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 space-y-5 shadow-2xl">
            <div>
              <span className="text-xs font-bold text-techlo-cyan uppercase tracking-wider">
                {getCategoryLabel(product.category)}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {product.title}
              </h1>
            </div>

            {/* Price Row */}
            <div className="p-4 bg-techlo-surface/70 border border-techlo-border rounded-2xl flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Offered Price</span>
                <div className="font-mono text-3xl font-black text-techlo-sky">
                  {formatPKR(product.pricePkr)}
                </div>
              </div>

              {product.originalPricePkr && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Retail New</span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatPKR(product.originalPricePkr)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full py-3 bg-techlo-surface hover:bg-techlo-border border border-techlo-border text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Make an Offer in App
                </button>

                <button
                  onClick={() => toggleSaveProduct(product.id)}
                  className={`w-full py-3 border rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "bg-techlo-surface hover:bg-techlo-border border-techlo-border text-slate-300"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-400 text-rose-400" : ""}`} />
                  <span>{isSaved ? "Saved" : "Save Item"}</span>
                </button>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Link Copied to Clipboard!" : "Share Listing with Classmates"}</span>
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-techlo-dark border border-techlo-border rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Seller Information
            </h4>

            <div className="flex items-start gap-3.5">
              <img
                src={product.seller.avatarUrl}
                alt={product.seller.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-techlo-cyan/50 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base truncate">{product.seller.name}</h3>
                  {product.seller.isVerifiedStudent && (
                    <span title="Verified Pakistani Student">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-techlo-sky font-semibold">{product.seller.university}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-techlo-cyan" />
                  {product.seller.campus}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-techlo-border/60">
              <div className="p-2.5 bg-techlo-surface/50 rounded-xl border border-techlo-border/50 text-center">
                <span className="text-[10px] text-slate-400 block">Seller Rating</span>
                <span className="font-bold text-amber-400 text-sm">★ {product.seller.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="p-2.5 bg-techlo-surface/50 rounded-xl border border-techlo-border/50 text-center">
                <span className="text-[10px] text-slate-400 block">Phone Status</span>
                <span className="font-bold text-emerald-400 text-sm">OTP Verified</span>
              </div>
            </div>
          </div>

          {/* Student Campus Safety Tips */}
          <div className="p-5 bg-techlo-surface/40 border border-techlo-border rounded-3xl space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-techlo-cyan" />
              <span>Campus Trade Safety Guidelines</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc pl-4">
              <li>Prefer meeting inside your university campus (Department Lab, Library or Cafeteria).</li>
              <li>Test boards using your laptop / multimeter before making cash payment.</li>
              <li>For inter-city deals, request test video with timestamp before Leopard/TCS dispatch.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-techlo-dark border border-techlo-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Send Offer / Inquire in App</h3>
            <p className="text-xs text-slate-400">
              Contact <strong className="text-white">{product.seller.name}</strong> regarding {product.title}.
            </p>

            {inquirySentSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Offer Sent!</h4>
                <p className="text-xs text-emerald-300">
                  The seller has received your notification and offer in PKR.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Offer Price (PKR)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Message / Pickup Location</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Can we meet at SEECS Lab tomorrow at 2 PM?"
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white text-xs placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="flex-1 py-2.5 bg-techlo-surface hover:bg-techlo-border text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-techlo-cyan hover:bg-techlo-sky text-techlo-dark rounded-xl text-xs font-bold shadow-glow-cyan cursor-pointer"
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
        <div className="space-y-6 pt-8 border-t border-techlo-border/60">
          <h3 className="text-xl font-bold text-white">More Components You Might Need</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
