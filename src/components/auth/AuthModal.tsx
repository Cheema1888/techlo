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
  Check,
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
  } = useAuth();

  const [loginIdentifier, setLoginIdentifier] = useState("saad.eng@nust.edu.pk");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+92 3");
  const [selectedUniversity, setSelectedUniversity] = useState(PAKISTANI_UNIVERSITIES[0].name);
  const [campusCity, setCampusCity] = useState("Islamabad / Rawalpindi");
  const [eduEmail, setEduEmail] = useState("");

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
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden font-mono">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Views */}
        {authModalView === "otp" ? (
          <PhoneOtpModal />
        ) : authModalView === "verify_student" ? (
          <div className="p-6 md:p-8 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Verify Student Status
              </h3>
              <p className="text-xs text-neutral-400">
                Unlock verified campus badge across Pakistan.
              </p>
            </div>

            {studentVerifiedSuccess ? (
              <div className="p-6 bg-[#111111] border border-neutral-800 rounded-xl text-center space-y-2">
                <Check className="w-10 h-10 text-white mx-auto" />
                <h4 className="text-sm font-bold text-white">Student Badge Activated</h4>
              </div>
            ) : (
              <form onSubmit={handleStudentVerificationSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">
                    University Email / Student ID (.edu.pk)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023-ee-142@uet.edu.pk"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingStudent || !studentInput}
                  className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl shadow-mono-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingStudent ? "Verifying..." : "Submit for Verification"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Header / Logo */}
            <div className="p-6 pb-2 text-center border-b border-neutral-800 bg-[#080808]">
              <TechloLogo size="md" />
              <p className="text-[11px] text-neutral-500 mt-2">
                Hardware Prototyping & Component Exchange
              </p>

              {/* Tabs */}
              <div className="flex bg-[#121212] p-1 rounded-xl border border-neutral-800 mt-4">
                <button
                  type="button"
                  onClick={() => setAuthModalView("login")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalView === "login"
                      ? "bg-white text-black shadow-mono-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalView("signup")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authModalView === "signup"
                      ? "bg-white text-black shadow-mono-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Register (with OTP)
                </button>
              </div>
            </div>

            {/* Login View */}
            {authModalView === "login" ? (
              <form onSubmit={handleLogin} className="p-6 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">Email or Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="name@nust.edu.pk or +92300..."
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-neutral-300 uppercase text-[10px]">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2 pr-10 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl shadow-mono-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      loginWithEmailOrPhone("saad.eng@nust.edu.pk", "pass123");
                    }}
                    className="text-[10px] text-neutral-400 hover:text-white inline-flex items-center gap-1.5 bg-[#121212] px-2.5 py-1 rounded border border-neutral-800"
                  >
                    ⚡ Demo Login (NUST Student Profile)
                  </button>
                </div>
              </form>
            ) : (
              /* Signup View */
              <form onSubmit={handleSignupSubmit} className="p-6 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamza Tariq"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">
                    Mobile Phone (for SMS OTP)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">University</label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs"
                  >
                    {PAKISTANI_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.name} className="bg-black">
                        {uni.shortName} - {uni.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 uppercase text-[10px]">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-white text-xs focus:border-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl shadow-mono-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send SMS OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
