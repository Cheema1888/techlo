"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { ShieldCheck, Smartphone, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const PhoneOtpModal: React.FC = () => {
  const {
    verifyOtp,
    generatedOtp,
    pendingSignupData,
    user,
    sendPhoneOtp,
    setAuthModalView,
  } = useAuth();

  const phoneNumber = pendingSignupData?.phoneNumber || user?.phoneNumber || "+92 300 1234567";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newDigits.every((d) => d !== "") && index === 5) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      handleVerify(pasted);
    }
  };

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      const success = verifyOtp(code);
      setIsVerifying(false);
      if (!success) {
        setError("Invalid OTP code. Please check the SMS or use the demo code.");
      }
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    sendPhoneOtp(phoneNumber);
    setTimer(45);
    setCanResend(false);
    setDigits(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-techlo-cyan/10 border border-techlo-cyan/30 text-techlo-cyan mb-1 shadow-glow-cyan">
          <Smartphone className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Verify Your Phone Number</h3>
        <p className="text-sm text-slate-300">
          We sent a 6-digit security code via SMS to{" "}
          <span className="font-semibold text-techlo-cyan">{phoneNumber}</span>
        </p>
      </div>

      {/* Demo Notification Banner */}
      <div className="p-3.5 rounded-xl bg-techlo-navy/80 border border-techlo-cyan/40 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-techlo-cyan flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-techlo-sky block mb-0.5">
            [Live SMS Simulator] Techlo Security
          </span>
          <p className="text-slate-300">
            Your instant verification code is:{" "}
            <span className="font-mono font-bold text-white px-1.5 py-0.5 bg-techlo-cyan/20 rounded border border-techlo-cyan/40 text-sm">
              {generatedOtp || "742918"}
            </span>{" "}
            (or enter <code className="text-techlo-sky">123456</code>)
          </p>
        </div>
      </div>

      {/* 6 Digit Inputs */}
      <div className="space-y-3">
        <div className="flex justify-between gap-2 max-w-sm mx-auto" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center font-mono text-2xl font-bold text-white bg-techlo-surface border-2 border-techlo-border rounded-xl focus:border-techlo-cyan focus:ring-2 focus:ring-techlo-cyan/20 focus:outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || digits.some((d) => d === "")}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-techlo-cyan to-blue-600 hover:from-techlo-sky hover:to-blue-500 text-white font-semibold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isVerifying ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Verifying Code...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Confirm & Access TECHLO
          </>
        )}
      </button>

      {/* Resend Timer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-techlo-border/60">
        <button
          onClick={() => setAuthModalView("signup")}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Change Phone Number
        </button>

        {canResend ? (
          <button
            onClick={handleResend}
            className="text-techlo-cyan hover:text-techlo-sky font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend SMS OTP
          </button>
        ) : (
          <span>
            Resend code in <strong className="text-white font-mono">{timer}s</strong>
          </span>
        )}
      </div>
    </div>
  );
};
