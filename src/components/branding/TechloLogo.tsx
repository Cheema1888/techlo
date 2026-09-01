import React from "react";

interface TechloLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "monochrome" | "white" | "dark";
  iconOnly?: boolean;
}

export const TechloLogo: React.FC<TechloLogoProps> = ({
  className = "",
  size = "md",
  showTagline = true,
  variant = "white",
  iconOnly = false,
}) => {
  const heightMap = {
    sm: iconOnly ? 26 : 26,
    md: iconOnly ? 34 : 34,
    lg: iconOnly ? 44 : 44,
    xl: iconOnly ? 56 : 56,
  };

  const currentHeight = heightMap[size];

  // Robot Icon Component in Clean Monochrome
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
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" />

      {/* Inner Screen Bezel */}
      <circle cx="50" cy="50" r="37" fill="#0A0A0A" />

      {/* Robot Face Screen Container */}
      <rect
        x="22"
        y="26"
        width="56"
        height="48"
        rx="12"
        fill="#141414"
        stroke="#262626"
        strokeWidth="2"
      />

      {/* Robot Eyes (Pixel / Square Style) */}
      <rect x="32" y="40" width="11" height="11" rx="2" fill="#FFFFFF" />
      <rect x="57" y="40" width="11" height="11" rx="2" fill="#FFFFFF" />

      {/* Cute Smile */}
      <path
        d="M44 60 C47 63, 53 63, 56 60"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (iconOnly) {
    return <RobotIcon s={currentHeight} />;
  }

  const textColor = variant === "dark" ? "text-black" : "text-white";
  const taglineColor = variant === "dark" ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-1">
        <span
          className={`font-mono font-black tracking-tighter leading-none ${textColor}`}
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
          className={`font-mono tracking-widest leading-none ${taglineColor}`}
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
          a product of <span className="font-bold text-white">arix</span>
        </span>
      )}
    </div>
  );
};
