"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { Smartphone, RefreshCw, AlertCircle } from "lucide-react";

export const PhoneOtpModal: React.FC = () => {
  const {
    verifyOtp,
    pendingSignupData,
    user,
    sendPhoneOtp,
    setAuthModalView,
  } = useAuth();

  const phoneNumber = pendingSignupData?.phoneNumber || user?.phoneNumber || "";
  const userEmail = pendingSignupData?.email || user?.email || "";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
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

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

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

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const success = await verifyOtp(code);
      setIsVerifying(false);
      if (!success) {
        setError("Invalid OTP code. Please check your SMS or resend code.");
      }
    } catch (e: any) {
      setIsVerifying(false);
      setError(e?.message || "Verification failed. Try again.");
    }
  };

  const handleResend = () => {
    if (!canResend || !phoneNumber) return;
    sendPhoneOtp(phoneNumber);
    setTimer(60);
    setCanResend(false);
    setDigits(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-mono">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white flex items-center justify-center mx-auto mb-2">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">Verify Your Account</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Enter 6-digit code sent to <span className="text-black dark:text-white font-bold">{userEmail || "your email"}</span>
        </p>
        {phoneNumber && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Registered Mobile: <span className="font-mono text-neutral-600 dark:text-neutral-300">{phoneNumber}</span>
          </p>
        )}
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
              className="w-11 h-13 text-center font-mono text-xl font-bold text-black dark:text-white bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white rounded-xl focus:outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || digits.some((d) => d === "")}
          className="w-full py-3 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold rounded-xl shadow-sm transition-all text-xs disabled:opacity-50 cursor-pointer"
        >
          {isVerifying ? "Verifying..." : "Verify & Activate Account"}
        </button>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <button
            onClick={() => setAuthModalView("signup")}
            className="hover:text-black dark:hover:text-white cursor-pointer"
          >
            ← Change Number
          </button>

          {canResend ? (
            <button
              onClick={handleResend}
              className="text-black dark:text-white font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resend Code</span>
            </button>
          ) : (
            <span>Resend code in {timer}s</span>
          )}
        </div>
      </div>
    </div>
  );
};
