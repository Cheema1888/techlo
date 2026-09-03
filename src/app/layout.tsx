import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { ThemeProvider } from "@/lib/themeContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "TECHLO | Pakistan's Student Hardware Marketplace & Prototyping Hub",
  description:
    "Pakistan's premier marketplace for university students to buy & sell hardware components (ESP32, STM32, Arduino, sensors) and order on-demand PCB design, fabrication & 3D CAD modeling. A product of arix.",
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
    "NED",
  ],
  verification: {
    google: "MkJFEmDEZSC04IMAx0ipgvRdNQ1HtI1pKgee69EogYk",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=2026", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2026", sizes: "any" },
    ],
    shortcut: "/icon.svg?v=2026",
    apple: "/icon.svg?v=2026",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 flex flex-col antialiased bg-dot-grid transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
