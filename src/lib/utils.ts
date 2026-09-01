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
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        description: "Sealed in original anti-static bag, pins pristine.",
      };
    case "fyp_tested":
      return {
        label: "FYP Tested (100% Working)",
        badgeClass: "bg-techlo-cyan/15 text-techlo-cyan border-techlo-cyan/40",
        description: "Used in a final year project and tested working before listing.",
      };
    case "gently_used":
      return {
        label: "Gently Used",
        badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        description: "Used in lab experiments, headers soldered, fully functional.",
      };
    case "desoldered_working":
      return {
        label: "Desoldered / Working",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        description: "Carefully desoldered from demo board, tested working.",
      };
    case "for_parts":
      return {
        label: "For Parts / Salvage",
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        description: "Not fully functional or sold as-is for salvageable components.",
      };
    default:
      return {
        label: condition,
        badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        description: "",
      };
  }
}

export function getCategoryLabel(category: ComponentCategory): string {
  const map: Record<ComponentCategory, string> = {
    microcontrollers: "Microcontrollers & Dev Boards",
    sensors: "Sensors & Modules",
    motors_actuators: "Motors, Servos & Drivers",
    power_bms: "Power Supplies, LiPo & BMS",
    wireless_iot: "Wireless, LoRa & IoT",
    displays: "Displays, LCD & OLED",
    test_tools: "Lab Tools & Soldering",
    passives_ics: "ICs, Relays & Passives",
    robotics_chassis: "Robotics Chassis & Mechanical",
    development_boards: "FPGA & SBCs",
  };
  return map[category] || category;
}
