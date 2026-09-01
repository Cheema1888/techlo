import React from "react";
import Link from "next/link";
import { TechloLogo } from "../branding/TechloLogo";
import { ShieldCheck, MapPin, Cpu, Layers, MessageSquare, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-techlo-dark border-t border-techlo-border text-slate-400 text-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <TechloLogo size="md" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Pakistan&apos;s first student hardware exchange and on-demand prototyping platform. Empowering engineering, mechatronics, and CS students to buy and sell components and fabricate custom PCBs & 3D CAD enclosures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-techlo-surface border border-techlo-cyan/30 text-techlo-cyan text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Phone OTP Verified Students
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-techlo-surface border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                🇵🇰 100% For Pakistani Campuses
              </span>
            </div>
          </div>

          {/* Hardware Marketplace Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-techlo-cyan" />
              Hardware Market
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace?category=microcontrollers" className="hover:text-white transition-colors">
                  Microcontrollers (ESP32, STM32)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=sensors" className="hover:text-white transition-colors">
                  Sensors & IMUs
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=motors_actuators" className="hover:text-white transition-colors">
                  Motors, Servos & Drivers
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=power_bms" className="hover:text-white transition-colors">
                  LiPo Batteries & BMS
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=development_boards" className="hover:text-white transition-colors">
                  Raspberry Pi & FPGAs
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=test_tools" className="hover:text-white transition-colors">
                  Logic Analyzers & Soldering
                </Link>
              </li>
            </ul>
          </div>

          {/* Prototyping Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-techlo-sky" />
              Engineering Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services#pcb-design" className="hover:text-white transition-colors">
                  Custom PCB Design (KiCad/Altium)
                </Link>
              </li>
              <li>
                <Link href="/services#pcb-fabrication" className="hover:text-white transition-colors">
                  PCB Fabrication Group Batching
                </Link>
              </li>
              <li>
                <Link href="/services#cad-modeling" className="hover:text-white transition-colors">
                  3D CAD Enclosure Design
                </Link>
              </li>
              <li>
                <Link href="/services#3d-printing" className="hover:text-white transition-colors">
                  3D Printing (PETG, PLA, Resin)
                </Link>
              </li>
              <li>
                <Link href="/services#firmware" className="hover:text-white transition-colors">
                  Embedded Firmware (FreeRTOS/C++)
                </Link>
              </li>
              <li>
                <Link href="/services/request" className="text-techlo-cyan font-bold hover:underline">
                  ⚡ Request Instant Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Campus Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Campus Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace?uni=NUST" className="hover:text-white transition-colors">
                  NUST (SEECS & CEME)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=FAST" className="hover:text-white transition-colors">
                  FAST-NUCES (All Campuses)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=UET" className="hover:text-white transition-colors">
                  UET Lahore & UET Taxila
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=GIKI" className="hover:text-white transition-colors">
                  GIKI Topi Swabi
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=NED" className="hover:text-white transition-colors">
                  NED UET Karachi
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-techlo-sky font-bold hover:underline">
                  View All 20+ Universities →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-techlo-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} <strong>TECHLO</strong>. All rights reserved.</span>
            <span className="text-slate-600">|</span>
            <span className="text-techlo-cyan font-semibold">a product of arix</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>Student Hardware Safety Guide</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
