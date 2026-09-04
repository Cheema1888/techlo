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
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "otp" | "verify_student";
  generatedOtp: string | null;
  pendingSignupData: PendingSignupData | null;
  savedProductIds: string[];
  products: ProductListing[];
  serviceRequests: ServiceQuoteRequest[];
  openAuthModal: (view?: "login" | "signup" | "otp" | "verify_student") => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: "login" | "signup" | "otp" | "verify_student") => void;
  loginWithEmailOrPhone: (identifier: string, password?: string, university?: string) => Promise<boolean>;
  sendPhoneOtp: (phoneNumber: string) => Promise<string>;
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
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<PendingSignupData | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceQuoteRequest[]>([]);

  // On mount, load real user session if already signed in, and query live SQLite database
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("techlo_user_session");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedSaved = localStorage.getItem("techlo_saved_items");
      if (storedSaved) {
        setSavedProductIds(JSON.parse(storedSaved));
      }

      refreshData();
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

  const sendPhoneOtp = async (phoneNumber: string): Promise<string> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      if (pendingSignupData) {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingSignupData),
        });
        const json = await res.json();
        if (json.data?.otpCode) {
          setGeneratedOtp(json.data.otpCode);
        }
      }
    } catch (e) {
      console.error("SMS OTP dispatch error:", e);
    }

    return code;
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    const phoneNumber = pendingSignupData?.phoneNumber || user?.phoneNumber || "";
    const email = pendingSignupData?.email || user?.email || "";

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, email, otpCode: code }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data?.user) {
        const verifiedUser: UserProfile = json.data.user;
        setUser(verifiedUser);
        localStorage.setItem("techlo_user_session", JSON.stringify(verifiedUser));
        closeAuthModal();
        await refreshData();
        return true;
      }
    } catch (e) {
      console.error("Verification error:", e);
    }

    return false;
  };

  const verifyStudentBadge = async (studentIdOrEduEmail: string): Promise<boolean> => {
    if (!user) return false;
    const isEdu = studentIdOrEduEmail.toLowerCase().includes(".edu.pk") || studentIdOrEduEmail.length > 4;
    if (isEdu) {
      const updated = {
        ...user,
        isVerifiedStudent: true,
        eduEmail: studentIdOrEduEmail,
      };
      setUser(updated);
      localStorage.setItem("techlo_user_session", JSON.stringify(updated));
      return true;
    }
    return false;
  };

  const logout = () => {
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
          sellerId: user?.id,
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

    const fallback: ProductListing = {
      ...productData,
      id: "tech-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [fallback, ...prev]);
    return fallback;
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
          userId: user?.id,
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

    const fallback: ServiceQuoteRequest = {
      ...requestData,
      id: "SRV-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: "submitted",
    };
    setServiceRequests((prev) => [fallback, ...prev]);
    return fallback;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalView,
        generatedOtp,
        pendingSignupData,
        savedProductIds,
        products,
        serviceRequests,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        loginWithEmailOrPhone,
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
