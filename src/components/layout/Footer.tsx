import React from "react";
import Link from "next/link";
import { TechloLogo } from "../branding/TechloLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-[#09090b] border-t border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 dark:text-neutral-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <TechloLogo size="sm" showTagline={true} />
            <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed font-sans">
              Student hardware exchange and on-demand PCB fabrication / 3D CAD prototyping for Pakistani universities.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-2.5">
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs block">
              Prototyping Services
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services#pcb-design" className="hover:text-black dark:hover:text-white transition-colors">
                  PCB Design & Schematics
                </Link>
              </li>
              <li>
                <Link href="/services#pcb-fabrication" className="hover:text-black dark:hover:text-white transition-colors">
                  Consolidated Batch Fabrication
                </Link>
              </li>
              <li>
                <Link href="/services#cad-modeling" className="hover:text-black dark:hover:text-white transition-colors">
                  3D CAD Enclosure Modeling
                </Link>
              </li>
              <li>
                <Link href="/services#3d-printing" className="hover:text-black dark:hover:text-white transition-colors">
                  Rapid 3D Printing (PETG/Resin)
                </Link>
              </li>
              <li>
                <Link href="/services/request" className="text-black dark:text-white font-medium hover:underline">
                  Request Official Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div className="space-y-2.5">
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs block">
              Marketplace
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace?category=microcontrollers" className="hover:text-black dark:hover:text-white transition-colors">
                  Microcontrollers (ESP32 / STM32)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=sensors" className="hover:text-black dark:hover:text-white transition-colors">
                  Sensors & IMUs
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=motors_actuators" className="hover:text-black dark:hover:text-white transition-colors">
                  Motors & Drivers
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=power_bms" className="hover:text-black dark:hover:text-white transition-colors">
                  LiPo & Power Systems
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-black dark:text-white font-medium hover:underline">
                  Post Hardware Component →
                </Link>
              </li>
            </ul>
          </div>

          {/* Universities */}
          <div className="space-y-2.5">
            <span className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs block">
              Campus Hubs
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace?uni=NUST" className="hover:text-black dark:hover:text-white transition-colors">
                  NUST (SEECS / CEME)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=FAST" className="hover:text-black dark:hover:text-white transition-colors">
                  FAST-NUCES (All Campuses)
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=GIKI" className="hover:text-black dark:hover:text-white transition-colors">
                  GIKI Topi Swabi
                </Link>
              </li>
              <li>
                <Link href="/marketplace?uni=UET" className="hover:text-black dark:hover:text-white transition-colors">
                  UET Lahore & Taxila
                </Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-black dark:hover:text-white transition-colors">
                  All 20+ Campuses →
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-black dark:text-white font-medium hover:underline">
                  Hardware & FYP Blog ↗
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <div>
            © {new Date().getFullYear()} TECHLO. A product of <span className="text-black dark:text-white font-semibold">arix</span>.
          </div>
          <div className="flex gap-4">
            <span>Verified Student Network</span>
            <span>•</span>
            <span>Pakistan Campus Exchange</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
