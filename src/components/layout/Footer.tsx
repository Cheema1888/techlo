import React from "react";
import Link from "next/link";
import { TechloLogo } from "../branding/TechloLogo";
import { ShieldCheck, MapPin, Cpu, Layers } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-neutral-800 text-neutral-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <TechloLogo size="md" />
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Student hardware marketplace & on-demand PCB fabrication / 3D CAD services for Pakistani universities.
            </p>
            <div className="text-[10px] text-neutral-500 pt-1">
              <span>NUST • FAST • UET • GIKI • NED • PIEAS</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-wider block text-[11px]">
              Services
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/services#pcb-design" className="hover:text-white transition-colors">
                  PCB Design & Schematic Review
                </Link>
              </li>
              <li>
                <Link href="/services#pcb-fabrication" className="hover:text-white transition-colors">
                  Consolidated PCB Fabrication
                </Link>
              </li>
              <li>
                <Link href="/services#cad-modeling" className="hover:text-white transition-colors">
                  3D CAD Enclosure Design
                </Link>
              </li>
              <li>
                <Link href="/services#3d-printing" className="hover:text-white transition-colors">
                  Rapid 3D Printing (PETG/Resin)
                </Link>
              </li>
              <li>
                <Link href="/services/request" className="text-white font-bold hover:underline">
                  Request Official Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-wider block text-[11px]">
              Marketplace
            </span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/marketplace?category=microcontrollers" className="hover:text-white transition-colors">
                  Microcontrollers (ESP32/STM32)
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
                <Link href="/sell" className="text-white font-bold hover:underline">
                  Sell Hardware Component →
                </Link>
              </li>
            </ul>
          </div>

          {/* Universities */}
          <div className="space-y-2">
            <span className="text-white font-bold uppercase tracking-wider block text-[11px]">
              Campus Network
            </span>
            <ul className="space-y-1.5 text-[11px]">
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
                <Link href="/universities" className="text-white font-bold hover:underline">
                  All 20+ Universities →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} TECHLO. All rights reserved. (a product of <span className="text-white font-bold">arix</span>)
          </div>
          <div className="flex gap-4">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
