"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { ShieldCheck, Smartphone, RefreshCw, Check, AlertCircle } from "lucide-react";

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

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      const success = verifyOtp(code);
      setIsVerifying(false);
      if (!success) {
        setError("Invalid OTP code. Use the demo code.");
      }
    }, 500);
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
    <div className="p-6 md:p-8 space-y-6 font-mono">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center mx-auto mb-2">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Verify Phone Number</h3>
        <p className="text-xs text-neutral-400">
          6-digit verification code sent to <span className="text-white font-bold">{phoneNumber}</span>
        </p>
      </div>

      {/* Demo Notification Banner */}
      <div className="p-3 rounded-xl bg-[#111111] border border-neutral-800 text-xs">
        <span className="text-neutral-400 block mb-0.5">// LIVE SMS SIMULATOR</span>
        <p className="text-neutral-300">
          Security code: <strong className="text-white px-1.5 py-0.5 bg-neutral-800 rounded">{generatedOtp || "742918"}</strong> (or enter <code className="text-white">123456</code>)
        </p>
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
              className="w-11 h-13 text-center font-mono text-xl font-bold text-white bg-[#121212] border border-neutral-800 focus:border-white rounded-xl focus:outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || digits.some((d) => d === "")}
        className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-mono-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        {isVerifying ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Check className="w-4 h-4 stroke-[3]" />
            Confirm Phone Number
          </>
        )}
      </button>

      {/* Resend Timer */}
      <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
        <button
          onClick={() => setAuthModalView("signup")}
          className="hover:text-white cursor-pointer"
        >
          Change Number
        </button>

        {canResend ? (
          <button
            onClick={handleResend}
            className="text-white hover:underline font-bold cursor-pointer"
          >
            Resend SMS OTP
          </button>
        ) : (
          <span>
            Resend in <strong className="text-white">{timer}s</strong>
          </span>
        )}
      </div>
    </div>
  );
};
