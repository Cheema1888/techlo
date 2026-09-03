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
    sm: iconOnly ? 24 : 24,
    md: iconOnly ? 30 : 30,
    lg: iconOnly ? 38 : 38,
    xl: iconOnly ? 48 : 48,
  };

  const currentHeight = heightMap[size];

  // Geometric Pi Monogram Icon Component (Transparent Background)
  const PiMonogramIcon = ({ s = 30 }: { s?: number }) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block flex-shrink-0 align-middle transition-colors"
    >
      <g fill={isDark ? "#FFFFFF" : "#0A0A0A"}>
        {/* Full left vertical spine */}
        <rect x="0" y="0" width="16" height="64" />
        {/* Top horizontal crossbar */}
        <rect x="16" y="0" width="32" height="16" />
        {/* Upper right stem */}
        <rect x="32" y="16" width="16" height="16" />
        {/* Middle bridge */}
        <rect x="16" y="32" width="16" height="16" />
        {/* Lower right stem */}
        <rect x="48" y="32" width="16" height="32" />
      </g>
    </svg>
  );

  if (iconOnly) {
    return <PiMonogramIcon s={currentHeight} />;
  }

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-2">
        <PiMonogramIcon
          s={
            size === "sm"
              ? 20
              : size === "md"
              ? 26
              : size === "lg"
              ? 34
              : 44
          }
        />
        <span
          className="font-mono font-black tracking-tighter leading-none text-black dark:text-white transition-colors"
          style={{
            fontSize:
              size === "sm"
                ? "1.25rem"
                : size === "md"
                ? "1.55rem"
                : size === "lg"
                ? "2.1rem"
                : "2.8rem",
            letterSpacing: "-0.04em",
          }}
        >
          TECHLO
        </span>
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
            marginTop: size === "sm" ? "3px" : "4px",
            paddingLeft: size === "sm" ? "26px" : "34px",
          }}
        >
          a product of <span className="font-bold text-black dark:text-white">arix</span>
        </span>
      )}
    </div>
  );
};
