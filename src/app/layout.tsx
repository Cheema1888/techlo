import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "TECHLO | Pakistan's Hardware Prototyping & Component Exchange",
  description:
    "On-demand PCB design, fabrication batching, 3D CAD modeling & printing, and student hardware marketplace across Pakistani universities (NUST, FAST, UET, GIKI, NED). A product of arix.",
  keywords: [
    "TECHLO",
    "arix",
    "PCB Design Pakistan",
    "PCB Fabrication",
    "3D CAD Modeling",
    "3D Printing Islamabad Lahore Karachi",
    "Hardware Marketplace Pakistan",
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
      <body className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col antialiased bg-dot-grid">
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
