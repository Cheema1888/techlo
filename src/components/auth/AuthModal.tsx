"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { TechloLogo } from "../branding/TechloLogo";
import { PhoneOtpModal } from "./PhoneOtpModal";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  GraduationCap,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalView,
    setAuthModalView,
    loginWithEmailOrPhone,
    setPendingSignupData,
    sendPhoneOtp,
    verifyStudentBadge,
    user,
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("saad.eng@nust.edu.pk");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+92 3");
  const [selectedUniversity, setSelectedUniversity] = useState(PAKISTANI_UNIVERSITIES[0].name);
  const [campusCity, setCampusCity] = useState("Islamabad / Rawalpindi");
  const [eduEmail, setEduEmail] = useState("");

  // Student verification state
  const [studentInput, setStudentInput] = useState("");
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [studentVerifiedSuccess, setStudentVerifiedSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithEmailOrPhone(loginIdentifier, loginPassword);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = phoneNumber.trim();
    setPendingSignupData({
      fullName,
      email: signupEmail,
      phoneNumber: formattedPhone,
      university: selectedUniversity,
      campus: campusCity,
      eduEmail,
      city: campusCity.split("/")[0].trim(),
    });

    await sendPhoneOtp(formattedPhone);
    setAuthModalView("otp");
  };

  const handleStudentVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput) return;
    setIsVerifyingStudent(true);
    setTimeout(() => {
      verifyStudentBadge(studentInput);
      setIsVerifyingStudent(false);
      setStudentVerifiedSuccess(true);
      setTimeout(() => {
        closeAuthModal();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-techlo-dark border border-techlo-border rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-techlo-surface/80 text-slate-400 hover:text-white hover:bg-techlo-border transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Views */}
        {authModalView === "otp" ? (
          <PhoneOtpModal />
        ) : authModalView === "verify_student" ? (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan mb-1 shadow-glow-cyan">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Get Verified Student Badge 🎓
              </h3>
              <p className="text-sm text-slate-300">
                Unlock high buyer trust, free project promotions, and verified campus badges across Pakistan.
              </p>
            </div>

            {studentVerifiedSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Student Badge Activated!</h4>
                <p className="text-xs text-emerald-300">
                  Your university verification has been approved. You now display the green verified student badge.
                </p>
              </div>
            ) : (
              <form onSubmit={handleStudentVerificationSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Official University Email or Student ID (.edu.pk)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2023-ee-142@uet.edu.pk or CMS ID"
                      value={studentInput}
                      onChange={(e) => setStudentInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:ring-1 focus:ring-techlo-cyan focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Supported: NUST, FAST, GIKI, UET, NED, COMSATS, PIEAS, Air, IST, ITU, etc.
                  </span>
                </div>

                <div className="p-3 bg-techlo-surface/50 border border-techlo-border rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-techlo-cyan flex-shrink-0 mt-0.5" />
                  <span>
                    We verify active student enrollment to prevent hardware scalpers and ensure 100% genuine peer-to-peer student transactions.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingStudent || !studentInput}
                  className="w-full py-3.5 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-semibold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingStudent ? "Verifying Credentials..." : "Submit for Verification"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Header / Logo */}
            <div className="p-6 pb-2 text-center border-b border-techlo-border/60 bg-techlo-surface/40">
              <TechloLogo size="md" />
              <p className="text-xs text-slate-400 mt-2">
                Pakistan&apos;s Student Hardware Exchange & Prototyping Platform
              </p>

              {/* Tabs */}
              <div className="flex bg-techlo-dark p-1 rounded-xl border border-techlo-border mt-5">
                <button
                  type="button"
                  onClick={() => setAuthModalView("login")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authModalView === "login"
                      ? "bg-techlo-cyan text-white shadow-glow-cyan"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalView("signup")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authModalView === "signup"
                      ? "bg-techlo-cyan text-white shadow-glow-cyan"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Account (with Phone OTP)
                </button>
              </div>
            </div>

            {/* Login View */}
            {authModalView === "login" ? (
              <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. name@nust.edu.pk or +92300..."
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:ring-1 focus:ring-techlo-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <a href="#" className="text-xs text-techlo-cyan hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:ring-1 focus:ring-techlo-cyan focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-semibold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick Demo Login */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier("saad.eng@nust.edu.pk");
                      setLoginPassword("pass123");
                      loginWithEmailOrPhone("saad.eng@nust.edu.pk", "pass123");
                    }}
                    className="text-xs text-techlo-sky hover:underline inline-flex items-center gap-1.5 bg-techlo-surface/80 px-3 py-1.5 rounded-lg border border-techlo-border/60"
                  >
                    ⚡ Quick Demo Login (NUST Student Profile)
                  </button>
                </div>
              </form>
            ) : (
              /* Signup View */
              <form onSubmit={handleSignupSubmit} className="p-6 md:p-8 space-y-3.5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hamza Tariq"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Mobile Number <span className="text-techlo-cyan">(for SMS OTP)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* University Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Your University / Institute
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white text-sm focus:border-techlo-cyan focus:outline-none"
                    >
                      {PAKISTANI_UNIVERSITIES.map((uni) => (
                        <option key={uni.id} value={uni.name} className="bg-techlo-dark">
                          {uni.shortName} - {uni.name} ({uni.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Campus / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. H-12 Islamabad or Faisal Town"
                      value={campusCity}
                      onChange={(e) => setCampusCity(e.target.value)}
                      className="w-full px-3.5 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Min 8 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-techlo-surface border border-techlo-border rounded-xl text-white placeholder-slate-500 text-sm focus:border-techlo-cyan focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-semibold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send SMS OTP & Verify Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400">
                  By registering, you agree to Techlo&apos;s Student Hardware Trade Guidelines.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
