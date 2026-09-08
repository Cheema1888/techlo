"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, ProductListing, ServiceQuoteRequest } from "./types";

interface PendingSignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  university: string;
  gender: string;
  campus?: string;
  eduEmail?: string;
  city?: string;
  avatarUrl?: string;
  avatarColor?: string;
  password: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "otp" | "verify_student";
  pendingSignupData: PendingSignupData | null;
  savedProductIds: string[];
  products: ProductListing[];
  serviceRequests: ServiceQuoteRequest[];
  openAuthModal: (view?: "login" | "signup" | "otp" | "verify_student") => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: "login" | "signup" | "otp" | "verify_student") => void;
  loginWithEmailOrPhone: (identifier: string, password?: string, university?: string) => Promise<boolean>;
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  sendPhoneOtp: (phoneNumber: string, explicitSignupData?: PendingSignupData) => Promise<string>;
  verifyOtp: (code: string) => Promise<boolean>;
  verifyStudentBadge: (studentIdOrEduEmail: string) => Promise<boolean>;
  logout: () => void;
  setPendingSignupData: (data: PendingSignupData) => void;
  toggleSaveProduct: (productId: string) => void;
  addProduct: (product: Omit<ProductListing, "id" | "createdAt">) => Promise<ProductListing>;
  addProductListing: (product: Omit<ProductListing, "id" | "createdAt">) => Promise<ProductListing>;
  createServiceRequest: (request: Omit<ServiceQuoteRequest, "id" | "createdAt" | "status">) => Promise<ServiceQuoteRequest>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "otp" | "verify_student">("login");
  const [pendingSignupData, setPendingSignupData] = useState<PendingSignupData | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceQuoteRequest[]>([]);

  // On mount, load real user session if already signed in, and query live SQLite database
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem("techlo_saved_items");
      if (storedSaved) {
        setSavedProductIds(JSON.parse(storedSaved));
      }

      void (async () => {
        try {
          const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
          const sessionJson = await sessionRes.json();
          if (sessionRes.ok && sessionJson.success && sessionJson.data?.user) {
            setUser(sessionJson.data.user);
            localStorage.setItem("techlo_user_session", JSON.stringify(sessionJson.data.user));
          } else {
            setUser(null);
            localStorage.removeItem("techlo_user_session");
          }
        } finally {
          await refreshData();
        }
      })();
    } catch (e) {
      console.warn("Storage access error:", e);
    }
  }, []);

  const refreshData = async () => {
    try {
      const [prodRes, srvRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/services"),
      ]);

      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        }
      }

      if (srvRes.ok) {
        const srvJson = await srvRes.json();
        if (srvJson.success && Array.isArray(srvJson.data)) {
          setServiceRequests(srvJson.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch live database records:", err);
    }
  };

  const openAuthModal = (view: "login" | "signup" | "otp" | "verify_student" = "login") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmailOrPhone = async (
    identifier: string,
    password?: string,
    university?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, university }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data?.user) {
        const loggedInUser: UserProfile = json.data.user;
        setUser(loggedInUser);
        localStorage.setItem("techlo_user_session", JSON.stringify(loggedInUser));
        closeAuthModal();
        await refreshData();
        return true;
      }

      throw new Error(json.error || "Authentication failed");
    } catch (e: any) {
      console.error("Login error:", e);
      throw e;
    }
  };

  const loginWithGoogleCredential = async (credential: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const json = await res.json();
      const userPayload = json.data?.user || json.user;
      if (!res.ok || !json.success || !userPayload) {
        throw new Error(json.error || "Google sign-in failed");
      }

      const loggedInUser: UserProfile = userPayload;
      setUser(loggedInUser);
      localStorage.setItem("techlo_user_session", JSON.stringify(loggedInUser));
      closeAuthModal();
      await refreshData();
      return true;
    } catch (e: any) {
      console.error("Google login error:", e);
      return false;
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, explicitSignupData?: PendingSignupData): Promise<string> => {
    const dataToSend = explicitSignupData || pendingSignupData;
    if (dataToSend) {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        const json = await res.json();
        console.log("[AUTH CONTEXT] Signup dispatch response:", json);
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to dispatch verification code");
        }
        if (json.data?.otpCode) {
          return json.data.otpCode;
        }
      } catch (e: any) {
        console.error("[AUTH CONTEXT] Error calling /api/auth/signup:", e);
        throw e;
      }
    }

    return "";
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    const cleanCode = (code || "").toString().trim();
    const phoneNumber = pendingSignupData?.phoneNumber || user?.phoneNumber || "";
    const email = pendingSignupData?.email || user?.email || "";

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          email,
          otpCode: cleanCode,
        }),
      });

      const json = await res.json();
      console.log("[AUTH CONTEXT] Verify OTP response:", json);

      const verifiedUser: UserProfile | undefined = json.data?.user || json.user;
      if (res.ok && json.success && verifiedUser) {
        setUser(verifiedUser);
        localStorage.setItem("techlo_user_session", JSON.stringify(verifiedUser));
        closeAuthModal();
        await refreshData();
        return true;
      }

      if (json.error) {
        throw new Error(json.error);
      }
    } catch (e: any) {
      console.error("Verification error:", e);
      throw e;
    }

    return false;
  };

  const verifyStudentBadge = async (studentIdOrEduEmail: string): Promise<boolean> => {
    if (!user) return false;
    const response = await fetch("/api/auth/request-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIdOrEduEmail }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || "Verification request failed");
    const updated = { ...user, studentIdOrEduEmail, isVerifiedStudent: false };
    setUser(updated);
    localStorage.setItem("techlo_user_session", JSON.stringify(updated));
    return true;
  };

  const logout = () => {
    void fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem("techlo_user_session");
  };

  const toggleSaveProduct = (productId: string) => {
    let newSaved: string[];
    if (savedProductIds.includes(productId)) {
      newSaved = savedProductIds.filter((id) => id !== productId);
    } else {
      newSaved = [...savedProductIds, productId];
    }
    setSavedProductIds(newSaved);
    localStorage.setItem("techlo_saved_items", JSON.stringify(newSaved));
  };

  const addProduct = async (
    productData: Omit<ProductListing, "id" | "createdAt">
  ): Promise<ProductListing> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          await refreshData();
          return json.data;
        }
      }
    } catch (e) {
      console.error("Failed to post product:", e);
    }

    throw new Error("Failed to publish listing");
  };

  const createServiceRequest = async (
    requestData: Omit<ServiceQuoteRequest, "id" | "createdAt" | "status">
  ): Promise<ServiceQuoteRequest> => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          await refreshData();
          return json.data;
        }
      }
    } catch (e) {
      console.error("Failed to submit service request:", e);
    }

    throw new Error("Failed to submit service request");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalView,
        pendingSignupData,
        savedProductIds,
        products,
        serviceRequests,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        loginWithEmailOrPhone,
        loginWithGoogleCredential,
        sendPhoneOtp,
        verifyOtp,
        verifyStudentBadge,
        logout,
        setPendingSignupData,
        toggleSaveProduct,
        addProduct,
        addProductListing: addProduct,
        createServiceRequest,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
