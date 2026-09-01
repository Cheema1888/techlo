"use client";

import React from "react";
import { useTheme } from "@/lib/themeContext";

interface TechloLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  iconOnly?: boolean;
}

export const TechloLogo: React.FC<TechloLogoProps> = ({
  className = "",
  size = "md",
  showTagline = true,
  iconOnly = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const heightMap = {
    sm: iconOnly ? 26 : 26,
    md: iconOnly ? 34 : 34,
    lg: iconOnly ? 44 : 44,
    xl: iconOnly ? 56 : 56,
  };

  const currentHeight = heightMap[size];

  // Robot Icon Component
  const RobotIcon = ({ s = 34 }: { s?: number }) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block flex-shrink-0 align-middle"
    >
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="46" fill={isDark ? "#FFFFFF" : "#0A0A0A"} />

      {/* Inner Screen Bezel */}
      <circle cx="50" cy="50" r="37" fill={isDark ? "#0A0A0A" : "#FFFFFF"} />

      {/* Robot Face Screen Container */}
      <rect
        x="22"
        y="26"
        width="56"
        height="48"
        rx="12"
        fill={isDark ? "#141414" : "#F5F5F5"}
        stroke={isDark ? "#262626" : "#E5E5E5"}
        strokeWidth="2"
      />

      {/* Robot Eyes (Pixel / Square Style) */}
      <rect x="32" y="40" width="11" height="11" rx="2" fill={isDark ? "#FFFFFF" : "#0A0A0A"} />
      <rect x="57" y="40" width="11" height="11" rx="2" fill={isDark ? "#FFFFFF" : "#0A0A0A"} />

      {/* Cute Smile */}
      <path
        d="M44 60 C47 63, 53 63, 56 60"
        stroke={isDark ? "#FFFFFF" : "#0A0A0A"}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (iconOnly) {
    return <RobotIcon s={currentHeight} />;
  }

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-1">
        <span
          className="font-mono font-black tracking-tighter leading-none text-black dark:text-white transition-colors"
          style={{
            fontSize:
              size === "sm"
                ? "1.3rem"
                : size === "md"
                ? "1.65rem"
                : size === "lg"
                ? "2.2rem"
                : "3rem",
            letterSpacing: "-0.05em",
          }}
        >
          TECHL
        </span>
        <div
          style={{
            transform:
              size === "sm"
                ? "translateY(-1px)"
                : size === "md"
                ? "translateY(-1px)"
                : "translateY(-2px)",
          }}
        >
          <RobotIcon
            s={
              size === "sm"
                ? 22
                : size === "md"
                ? 28
                : size === "lg"
                ? 36
                : 48
            }
          />
        </div>
      </div>
      {showTagline && (
        <span
          className="font-mono tracking-widest leading-none text-neutral-500 dark:text-neutral-400 transition-colors"
          style={{
            fontSize:
              size === "sm"
                ? "0.55rem"
                : size === "md"
                ? "0.64rem"
                : size === "lg"
                ? "0.8rem"
                : "1rem",
            letterSpacing: "0.12em",
            marginTop: size === "sm" ? "2px" : "3px",
            alignSelf: "flex-end",
          }}
        >
          a product of <span className="font-bold text-black dark:text-white">arix</span>
        </span>
      )}
    </div>
  );
};
