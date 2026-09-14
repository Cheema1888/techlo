"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/themeContext";
import { RotateCcw } from "lucide-react";

interface TechloAnimatedLogoProps {
  className?: string;
  size?: "md" | "lg" | "xl" | "hero";
  showTagline?: boolean;
  onAnimationComplete?: () => void;
}

export const TechloAnimatedLogo: React.FC<TechloAnimatedLogoProps> = ({
  className = "",
  size = "hero",
  showTagline = false,
  onAnimationComplete,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Animation state
  const [replayKey, setReplayKey] = useState(0);
  const [isWinking, setIsWinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations matching Techlo brand styling
  // L drops straight from above into natural baseline alignment with standard monospace spacing
  // O (smiley face) follows with standard brand spacing
  const config = {
    md: {
      fontSize: "2rem",
      iconSize: 34,
      containerHeight: "h-14",
      oMarginLeft: "0.08em",
    },
    lg: {
      fontSize: "3rem",
      iconSize: 50,
      containerHeight: "h-18",
      oMarginLeft: "0.08em",
    },
    xl: {
      fontSize: "4.2rem",
      iconSize: 68,
      containerHeight: "h-24",
      oMarginLeft: "0.08em",
    },
    hero: {
      fontSize: "clamp(3.2rem, 8vw, 5.4rem)",
      iconSize: 84,
      containerHeight: "min-h-[90px] sm:min-h-[115px]",
      oMarginLeft: "0.08em",
    },
  }[size];

  const triggerWink = useCallback(() => {
    setIsWinking(true);
    setTimeout(() => {
      setIsWinking(false);
    }, 380);
  }, []);

  const replay = () => {
    setIsWinking(false);
    setReplayKey((prev) => prev + 1);
  };

  useEffect(() => {
    // 1. Initial wink right after O rolls in and settles (~2.1s)
    const initialWinkTimer = setTimeout(() => {
      triggerWink();
      if (onAnimationComplete) onAnimationComplete();
    }, 2150);

    // 2. Periodic playful wink every 8 seconds when idle
    const periodicWinkInterval = setInterval(() => {
      triggerWink();
    }, 8000);

    return () => {
      clearTimeout(initialWinkTimer);
      clearInterval(periodicWinkInterval);
    };
  }, [replayKey, triggerWink, onAnimationComplete]);

  return (
    <div
      key={replayKey}
      className={`relative inline-flex flex-col items-center select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Logo Row: TECH + L + O — click anywhere to replay */}
      <div
        onClick={replay}
        title="Click to replay animation"
        className={`flex items-center justify-center ${config.containerHeight} px-2 overflow-visible cursor-pointer`}
        style={{ fontSize: config.fontSize }}
      >
        {/* 1. "TECH" — slides in smoothly from the left */}
        <motion.div
          initial={{ x: -140, opacity: 0, filter: "blur(5px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-flex items-center relative z-10"
        >
          <span
            className="font-mono font-black tracking-tighter leading-none text-black dark:text-white transition-colors select-none"
            style={{
              fontSize: "1em",
              letterSpacing: "-0.05em",
            }}
          >
            TECH
          </span>
        </motion.div>

        {/* 2. "L" — drops straight from above, perfectly upright with standard monospace spacing */}
        <motion.div
          initial={{
            y: -200,
            opacity: 0,
            scaleY: 1.15,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scaleY: 1,
          }}
          transition={{
            delay: 0.65,
            type: "spring",
            stiffness: 280,
            damping: 18,
            mass: 0.9,
          }}
          style={{
            transformOrigin: "bottom center",
            display: "inline-flex",
            alignItems: "center",
          }}
          className="relative z-10 pointer-events-none"
        >
          <span
            className="font-mono font-black tracking-tighter leading-none text-black dark:text-white transition-colors select-none inline-block"
            style={{
              fontSize: "1em",
              letterSpacing: "-0.05em",
            }}
          >
            L
          </span>
        </motion.div>

        {/* 3. "O" (Smiley Robot Icon) — rolls in so top-left arc supports the foot of L */}
        <motion.div
          initial={{
            x: 160,
            opacity: 0,
            rotate: 240,
            scale: 0.65,
          }}
          animate={{
            x: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
          }}
          transition={{
            delay: 1.35,
            type: "spring",
            stiffness: 190,
            damping: 15,
            mass: 1.1,
          }}
          style={{
            marginLeft: config.oMarginLeft,
          }}
          className="inline-flex items-center justify-center relative z-10 cursor-pointer"
          onClick={replay}
          title="Click to replay animation"
          whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            width={config.iconSize}
            height={config.iconSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block flex-shrink-0 align-middle"
            animate={
              isWinking
                ? {
                    rotate: [0, 4, -2, 0],
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{ duration: 0.35 }}
          >
            {/* Outer Ring */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill={isDark ? "#FFFFFF" : "#0A0A0A"}
            />

            {/* Inner Circle (solid black in dark mode, solid white in light mode) */}
            <circle
              cx="50"
              cy="50"
              r="37"
              fill={isDark ? "#0A0A0A" : "#FFFFFF"}
            />

            {/* Left Robot Eye */}
            <rect
              x="32"
              y="40"
              width="11"
              height="11"
              rx="2"
              fill={isDark ? "#FFFFFF" : "#0A0A0A"}
            />

            {/* Right Robot Eye — Animated Wink */}
            {isWinking ? (
              <path
                d="M56 46 Q62.5 40.5 69 46"
                stroke={isDark ? "#FFFFFF" : "#0A0A0A"}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            ) : (
              <rect
                x="57"
                y="40"
                width="11"
                height="11"
                rx="2"
                fill={isDark ? "#FFFFFF" : "#0A0A0A"}
              />
            )}

            {/* Cute Smile — widens cheerfully during wink */}
            <path
              d={
                isWinking
                  ? "M42 58.5 C46 64.5, 54 64.5, 58 58.5"
                  : "M44 60 C47 63, 53 63, 56 60"
              }
              stroke={isDark ? "#FFFFFF" : "#0A0A0A"}
              strokeWidth={isWinking ? "4" : "3.5"}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </motion.svg>
        </motion.div>

        {/* Floating Quick Replay Trigger */}
        <button
          onClick={replay}
          type="button"
          className={`ml-3 transition-opacity duration-200 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          title="Replay animation"
          aria-label="Replay animation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
