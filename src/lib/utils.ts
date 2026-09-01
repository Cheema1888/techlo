import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { HardwareCondition, ComponentCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-PK");
}

export function getConditionBadge(condition: HardwareCondition): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (condition) {
    case "brand_new":
      return {
        label: "Brand New (Unopened)",
        badgeClass: "bg-white text-black border border-white font-semibold",
        description: "Sealed in original anti-static bag, pins pristine.",
      };
    case "fyp_tested":
      return {
        label: "Tested (100% Functional)",
        badgeClass: "bg-neutral-900 text-white border border-neutral-700 font-semibold",
        description: "Tested and verified in lab with full working status.",
      };
    case "gently_used":
      return {
        label: "Gently Used",
        badgeClass: "bg-neutral-900 text-neutral-300 border border-neutral-800",
        description: "Minor lab use, headers soldered, fully functional.",
      };
    case "desoldered_working":
      return {
        label: "Desoldered / Tested",
        badgeClass: "bg-neutral-900 text-neutral-400 border border-neutral-800",
        description: "Desoldered from dev board, pin-tested working.",
      };
    case "for_parts":
      return {
        label: "For Parts / Salvage",
        badgeClass: "bg-neutral-900 text-neutral-500 border border-neutral-800 line-through",
        description: "Sold as-is for salvageable passives/ICs.",
      };
    default:
      return {
        label: condition,
        badgeClass: "bg-neutral-900 text-neutral-300 border border-neutral-800",
        description: "",
      };
  }
}

export function getCategoryLabel(category: ComponentCategory): string {
  const map: Record<ComponentCategory, string> = {
    microcontrollers: "Microcontrollers (ESP32 / STM32)",
    sensors: "Sensors & Modules",
    motors_actuators: "Motors & Actuators",
    power_bms: "Power & LiPo BMS",
    wireless_iot: "Wireless & IoT",
    displays: "Displays & OLEDs",
    test_tools: "Lab Tools & Debuggers",
    passives_ics: "ICs & Components",
    robotics_chassis: "Robotics & Hardware",
    development_boards: "SBCs & FPGAs",
  };
  return map[category] || category;
}
