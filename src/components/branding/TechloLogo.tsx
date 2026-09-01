import React from "react";

interface TechloLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "color" | "monochrome" | "light";
  iconOnly?: boolean;
}

export const TechloLogo: React.FC<TechloLogoProps> = ({
  className = "",
  size = "md",
  showTagline = true,
  variant = "color",
  iconOnly = false,
}) => {
  // Dimensions
  const heightMap = {
    sm: iconOnly ? 28 : 28,
    md: iconOnly ? 38 : 38,
    lg: iconOnly ? 48 : 48,
    xl: iconOnly ? 64 : 64,
  };

  const currentHeight = heightMap[size];

  // Robot Icon Component
  const RobotIcon = ({ s = 36 }: { s?: number }) => (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block flex-shrink-0 align-middle"
    >
      <defs>
        <linearGradient id="techloRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#00A8FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
        <radialGradient id="techloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00A8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00A8FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Cyan Ring */}
      {variant === "monochrome" ? (
        <circle cx="50" cy="50" r="46" fill="#0A1931" />
      ) : (
        <>
          <circle cx="50" cy="50" r="49" fill="url(#techloGlow)" />
          <circle cx="50" cy="50" r="45" fill="url(#techloRingGrad)" />
        </>
      )}

      {/* Inner Screen Bezel */}
      <circle
        cx="50"
        cy="50"
        r="37"
        fill={variant === "monochrome" ? "#FFFFFF" : "#081325"}
      />

      {/* Robot Face Screen Container */}
      <rect
        x="22"
        y="26"
        width="56"
        height="48"
        rx="14"
        fill={variant === "monochrome" ? "#0A1931" : "#0A1B30"}
      />

      {/* Robot Eyes (Pixel / Square Style) */}
      <rect
        x="32"
        y="40"
        width="11"
        height="11"
        rx="2"
        fill={variant === "monochrome" ? "#FFFFFF" : "#FFFFFF"}
      />
      <rect
        x="57"
        y="40"
        width="11"
        height="11"
        rx="2"
        fill={variant === "monochrome" ? "#FFFFFF" : "#FFFFFF"}
      />

      {/* Cute Smile */}
      <path
        d="M44 60 C47 63, 53 63, 56 60"
        stroke={variant === "monochrome" ? "#FFFFFF" : "#FFFFFF"}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (iconOnly) {
    return <RobotIcon s={currentHeight} />;
  }

  const textColor =
    variant === "monochrome"
      ? "text-techlo-navy"
      : variant === "light"
      ? "text-white"
      : "text-techlo-navy dark:text-white";

  const taglineColor =
    variant === "monochrome"
      ? "text-techlo-navy/70"
      : variant === "light"
      ? "text-techlo-cyan"
      : "text-techlo-cyan dark:text-techlo-sky";

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-1">
        <span
          className={`font-display font-black tracking-tight leading-none ${textColor}`}
          style={{
            fontSize:
              size === "sm"
                ? "1.35rem"
                : size === "md"
                ? "1.75rem"
                : size === "lg"
                ? "2.35rem"
                : "3.2rem",
            letterSpacing: "-0.04em",
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
                ? 24
                : size === "md"
                ? 30
                : size === "lg"
                ? 38
                : 50
            }
          />
        </div>
      </div>
      {showTagline && (
        <span
          className={`font-sans tracking-wide font-medium leading-none ${taglineColor}`}
          style={{
            fontSize:
              size === "sm"
                ? "0.55rem"
                : size === "md"
                ? "0.68rem"
                : size === "lg"
                ? "0.85rem"
                : "1.1rem",
            letterSpacing: "0.06em",
            marginTop: size === "sm" ? "2px" : "3px",
            alignSelf: "flex-end",
          }}
        >
          a product of <span className="font-bold">arix</span>
        </span>
      )}
    </div>
  );
};
