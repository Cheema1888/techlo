"use client";

import React from "react";

export type ChotuColor = "cyan" | "emerald" | "purple" | "orange" | "rose" | "amber" | "carbon";

interface ChotuAvatarProps {
  name?: string;
  avatarUrl?: string | null;
  color?: ChotuColor | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const COLOR_PALETTES: Record<ChotuColor, { bg: string; head: string; eye: string; border: string; glow: string }> = {
  cyan: {
    bg: "from-cyan-500/20 to-cyan-600/10",
    head: "#0891b2",
    eye: "#22d3ee",
    border: "border-cyan-500/30",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-600/10",
    head: "#059669",
    eye: "#34d399",
    border: "border-emerald-500/30",
    glow: "rgba(52, 211, 153, 0.4)",
  },
  purple: {
    bg: "from-purple-500/20 to-purple-600/10",
    head: "#7c3aed",
    eye: "#c084fc",
    border: "border-purple-500/30",
    glow: "rgba(192, 132, 252, 0.4)",
  },
  orange: {
    bg: "from-orange-500/20 to-orange-600/10",
    head: "#ea580c",
    eye: "#fb923c",
    border: "border-orange-500/30",
    glow: "rgba(251, 146, 60, 0.4)",
  },
  rose: {
    bg: "from-rose-500/20 to-rose-600/10",
    head: "#e11d48",
    eye: "#fb7185",
    border: "border-rose-500/30",
    glow: "rgba(251, 113, 133, 0.4)",
  },
  amber: {
    bg: "from-amber-500/20 to-amber-600/10",
    head: "#d97706",
    eye: "#fcd34d",
    border: "border-amber-500/30",
    glow: "rgba(252, 211, 77, 0.4)",
  },
  carbon: {
    bg: "from-neutral-700/30 to-neutral-800/20",
    head: "#3f3f46",
    eye: "#e4e4e7",
    border: "border-neutral-500/30",
    glow: "rgba(228, 228, 231, 0.3)",
  },
};

const SIZES = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

/**
 * Returns a deterministic color based on string hash
 */
export function getChotuColorForString(str: string = "user"): ChotuColor {
  const colors: ChotuColor[] = ["cyan", "emerald", "purple", "orange", "rose", "amber", "carbon"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export const ChotuAvatar: React.FC<ChotuAvatarProps> = ({
  name = "Student",
  avatarUrl,
  color,
  size = "md",
  className = "",
}) => {
  // If user has a real custom photo uploaded, render image
  if (avatarUrl && !avatarUrl.includes("placeholder") && !avatarUrl.startsWith("chotu://")) {
    return (
      <div className={`relative rounded-full overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 flex-shrink-0 ${SIZES[size]} ${className}`}>
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback on broken image
            (e.target as any).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Determine color scheme
  const selectedColor = (color && COLOR_PALETTES[color as ChotuColor]) 
    ? (color as ChotuColor) 
    : getChotuColorForString(name);

  const palette = COLOR_PALETTES[selectedColor] || COLOR_PALETTES.cyan;

  return (
    <div
      className={`relative rounded-full bg-gradient-to-b ${palette.bg} border ${palette.border} flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs transition-transform hover:scale-105 select-none ${SIZES[size]} ${className}`}
      title={`${name} (Chotu Bot: ${selectedColor})`}
    >
      {/* Vector Chotu Bot Robot Face */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[78%] h-[78%] drop-shadow-xs"
      >
        {/* Antenna */}
        <path
          d="M24 10V4M21 4H27"
          stroke={palette.head}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="4" r="2" fill={palette.eye} />

        {/* Ears */}
        <rect x="5" y="19" width="4" height="8" rx="2" fill={palette.head} />
        <rect x="39" y="19" width="4" height="8" rx="2" fill={palette.head} />

        {/* Robot Head Body */}
        <rect
          x="8"
          y="11"
          width="32"
          height="25"
          rx="7"
          fill={palette.head}
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Visor Screen */}
        <rect
          x="12"
          y="16"
          width="24"
          height="14"
          rx="4"
          fill="#09090b"
          stroke="#27272a"
          strokeWidth="1"
        />

        {/* Left Eye */}
        <circle cx="18" cy="22" r="3" fill={palette.eye} />
        <circle cx="17.2" cy="21.2" r="1" fill="#ffffff" />

        {/* Right Eye */}
        <circle cx="30" cy="22" r="3" fill={palette.eye} />
        <circle cx="29.2" cy="21.2" r="1" fill="#ffffff" />

        {/* Mouth Indicator Screen */}
        <path
          d="M20 27H28"
          stroke={palette.eye}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="2 2"
        />

        {/* Neck / Collar */}
        <path
          d="M17 37H31V41C31 42.1046 30.1046 43 29 43H19C17.8954 43 17 42.1046 17 41V37Z"
          fill="#18181b"
        />
      </svg>
    </div>
  );
};
