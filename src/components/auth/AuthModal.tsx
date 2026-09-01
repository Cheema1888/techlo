"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { TechloLogo } from "../branding/TechloLogo";
import { PhoneOtpModal } from "./PhoneOtpModal";
import { PAKISTANI_UNIVERSITIES } from "@/lib/mockData";
import {
  X,
  Lock,
  User,
  Phone,
  GraduationCap,
  Building,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
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

  // Clean Production Sign In State
  const [loginPhone, setLoginPhone] = useState("");
  const [loginUniversity, setLoginUniversity] = useState(PAKISTANI_UNIVERSITIES[0].name);
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Clean Production Sign Up State
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(PAKISTANI_UNIVERSITIES[0].name);
  const [campusCity, setCampusCity] = useState("");
  const [eduEmail, setEduEmail] = useState("");
  const [signupError, setSignupError] = useState("");

  // Student Verification State
  const [studentInput, setStudentInput] = useState("");
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);
  const [studentVerifiedSuccess, setStudentVerifiedSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginPhone || loginPhone.trim().length < 10) {
      setLoginError("Please enter your mobile phone number (+92 3XX XXXXXXX)");
      return;
    }

    if (!loginUniversity) {
      setLoginError("Please select your university");
      return;
    }

    if (!loginPassword) {
      setLoginError("Please enter your password");
      return;
    }

    setIsSubmittingLogin(true);

    try {
      const success = await loginWithEmailOrPhone(loginPhone.trim(), loginPassword, loginUniversity);
      setIsSubmittingLogin(false);
      if (!success) {
        setLoginError("Invalid credentials or account not found. Please register if you're new.");
      }
    } catch (err: any) {
      setIsSubmittingLogin(false);
      setLoginError(err?.message || "Authentication failed. Please try again.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    const formattedPhone = phoneNumber.trim();
    if (formattedPhone.length < 10) {
      setSignupError("Please provide a valid Pakistani mobile number (+92 3XX XXXXXXX)");
      return;
    }

    if (!fullName.trim()) {
      setSignupError("Full Name is required");
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setPendingSignupData({
      fullName: fullName.trim(),
      email: signupEmail.trim(),
      phoneNumber: formattedPhone,
      university: selectedUniversity,
      campus: campusCity.trim() || `${selectedUniversity} Main Campus`,
      eduEmail: eduEmail.trim(),
      city: campusCity.split("/")[0].trim() || "Islamabad",
    });

    try {
      await sendPhoneOtp(formattedPhone);
      setAuthModalView("otp");
    } catch (err: any) {
      setSignupError("Failed to dispatch SMS OTP. Try again.");
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Modal Card (Pi.dev clean floating card) */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#121215] border border-neutral-200/80 dark:border-neutral-800/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800/60 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Views */}
        {authModalView === "otp" ? (
          <PhoneOtpModal />
        ) : authModalView === "verify_student" ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800/80 text-black dark:text-white flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">
                Verify Student Status
              </h3>
              <p className="text-xs text-neutral-500">
                Unlock verified campus badge across Pakistani universities.
              </p>
            </div>

            {studentVerifiedSuccess ? (
              <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-black dark:text-white">Student Badge Activated</h4>
              </div>
            ) : (
              <form onSubmit={handleStudentVerificationSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-500 uppercase text-[10px] font-medium">
                    University Email / Student ID (.edu.pk)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023-ee-142@seecs.nust.edu.pk"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingStudent || !studentInput}
                  className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingStudent ? "Verifying..." : "Submit for Verification"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Header / Logo */}
            <div className="p-6 pb-3 text-center border-b border-neutral-100 dark:border-neutral-800/80">
              <TechloLogo size="md" showTagline={false} />
              <p className="text-xs text-neutral-500 mt-1">
                Student Hardware Marketplace & Prototyping
              </p>

              {/* Tabs (Pi.dev pill group) */}
              <div className="flex bg-neutral-100/70 dark:bg-neutral-900/60 p-1 rounded-full border border-neutral-200/60 dark:border-neutral-800/60 mt-4 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalView("login");
                    setLoginError("");
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    authModalView === "login"
                      ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalView("signup");
                    setSignupError("");
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    authModalView === "signup"
                      ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-xs"
                      : "text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Login View */}
            {authModalView === "login" ? (
              <form onSubmit={handleLogin} className="p-6 space-y-3.5 text-xs">
                {loginError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-300 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                    {loginError.toLowerCase().includes("register") && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber(loginPhone);
                          setSelectedUniversity(loginUniversity);
                          setAuthModalView("signup");
                          setLoginError("");
                        }}
                        className="w-full py-1.5 px-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold text-[11px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Create Account with {loginPhone || "this phone"} →</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 1. Mobile Phone Number */}
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] flex items-center gap-1 font-semibold">
                    <Phone className="w-3 h-3 text-neutral-400" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                {/* 2. University */}
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] flex items-center gap-1 font-semibold">
                    <Building className="w-3 h-3 text-neutral-400" />
                    <span>Your University *</span>
                  </label>
                  <select
                    value={loginUniversity}
                    onChange={(e) => setLoginUniversity(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none cursor-pointer"
                  >
                    {PAKISTANI_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.name} className="bg-white dark:bg-black">
                        {uni.shortName} — {uni.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] flex items-center gap-1 font-semibold">
                      <Lock className="w-3 h-3 text-neutral-400" />
                      <span>Password *</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-neutral-400 hover:text-black dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  <span>{isSubmittingLogin ? "Signing in..." : "Sign In to TECHLO"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* Signup View */
              <form onSubmit={handleSignupSubmit} className="p-6 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
                {signupError && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/80 rounded-2xl text-rose-600 dark:text-rose-400 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saad Tariq"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] font-semibold">
                    Pakistani University *
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs cursor-pointer"
                  >
                    {PAKISTANI_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.name} className="bg-white dark:bg-black">
                        {uni.shortName} — {uni.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] font-semibold">
                    Mobile Phone (for SMS OTP) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px]">
                    Campus / Department (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SEECS H-12 Islamabad"
                    value={campusCity}
                    onChange={(e) => setCampusCity(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px]">
                    University Email / Student ID (.edu.pk optional)
                  </label>
                  <input
                    type="email"
                    placeholder="student@seecs.nust.edu.pk"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] font-semibold">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full text-black dark:text-white text-xs focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-semibold rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send SMS Verification Code</span>
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
