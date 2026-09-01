import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "TECHLO | Pakistan's Student Hardware Exchange & Prototyping Platform",
  description:
    "Buy and sell hardware components, microcontrollers, sensors, and dev boards across Pakistani university campuses (NUST, FAST, UET, GIKI, NED). Request custom PCB design, batch fabrication, and 3D CAD printing.",
  keywords: [
    "TECHLO",
    "arix",
    "Hardware Marketplace Pakistan",
    "Used ESP32 Arduino Raspberry Pi Pakistan",
    "Student FYP components",
    "PCB Design Pakistan",
    "PCB Fabrication",
    "3D CAD Modeling",
    "3D Printing Islamabad Lahore Karachi",
    "NUST",
    "FAST",
    "GIKI",
    "UET",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-techlo-deep text-slate-100 flex flex-col antialiased bg-circuit-grid">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
