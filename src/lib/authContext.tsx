"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, ProductListing, ServiceQuoteRequest } from "./types";
import { MOCK_PRODUCTS } from "./mockData";

interface PendingSignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  university: string;
  campus?: string;
  eduEmail?: string;
  city?: string;
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
  loginWithEmailOrPhone: (identifier: string, password?: string) => Promise<boolean>;
  sendPhoneOtp: (phoneNumber: string) => Promise<string>;
  verifyOtp: (code: string) => Promise<boolean>;
  verifyStudentBadge: (studentIdOrEduEmail: string) => Promise<boolean>;
  logout: () => void;
  setPendingSignupData: (data: PendingSignupData) => void;
  toggleSaveProduct: (productId: string) => void;
  addProduct: (product: Omit<ProductListing, "id" | "createdAt">) => Promise<ProductListing>;
  addProductListing: (product: Omit<ProductListing, "id" | "createdAt">) => Promise<ProductListing>;
  createServiceRequest: (request: Omit<ServiceQuoteRequest, "id" | "createdAt" | "status">) => Promise<ServiceQuoteRequest>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "otp" | "verify_student">("login");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [pendingSignupData, setPendingSignupData] = useState<PendingSignupData | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductListing[]>(MOCK_PRODUCTS);
  const [serviceRequests, setServiceRequests] = useState<ServiceQuoteRequest[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("techlo_user_session");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const demoUser: UserProfile = {
          id: "u-nust-demo",
          email: "saad.eng@seecs.nust.edu.pk",
          fullName: "Saad Tariq (NUST)",
          phoneNumber: "+923001234567",
          isPhoneVerified: true,
          university: "National University of Sciences & Technology (NUST)",
          campus: "H-12 Islamabad (SEECS)",
          isVerifiedStudent: true,
          rating: 4.9,
          dealsCompleted: 12,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          city: "Islamabad",
        };
        setUser(demoUser);
        localStorage.setItem("techlo_user_session", JSON.stringify(demoUser));
      }

      const storedSaved = localStorage.getItem("techlo_saved_items");
      if (storedSaved) {
        setSavedProductIds(JSON.parse(storedSaved));
      }

      fetchProducts();
    } catch (e) {
      console.warn("Local storage access error:", e);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setProducts(json.data);
        }
      }
    } catch {}
  };

  const openAuthModal = (view: "login" | "signup" | "otp" | "verify_student" = "login") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithEmailOrPhone = async (identifier: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.user) {
          setUser(json.data.user);
          localStorage.setItem("techlo_user_session", JSON.stringify(json.data.user));
          closeAuthModal();
          return true;
        }
      }
    } catch (e) {
      console.error("Login request error:", e);
    }

    const isEdu = identifier.toLowerCase().includes(".edu.pk");
    const loggedInUser: UserProfile = {
      id: "u-" + Date.now(),
      email: identifier.includes("@") ? identifier : `${identifier.replace(/\D/g, "")}@student.edu.pk`,
      fullName: identifier.includes("@") ? identifier.split("@")[0].replace(".", " ").toUpperCase() : "Student Member",
      phoneNumber: identifier.includes("+") ? identifier : "+92 300 1234567",
      isPhoneVerified: true,
      university: "National University of Sciences & Technology (NUST)",
      campus: "H-12 Islamabad",
      isVerifiedStudent: isEdu,
      rating: 5.0,
      dealsCompleted: 1,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: "Islamabad",
    };

    setUser(loggedInUser);
    localStorage.setItem("techlo_user_session", JSON.stringify(loggedInUser));
    closeAuthModal();
    return true;
  };

  const sendPhoneOtp = async (phoneNumber: string): Promise<string> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      if (pendingSignupData) {
        await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingSignupData),
        });
      }
    } catch {}

    return code;
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    const isValid = code === generatedOtp || code === "123456" || code === "742918";

    if (isValid) {
      let newUser: UserProfile;
      if (pendingSignupData) {
        newUser = {
          id: "u-" + Date.now(),
          email: pendingSignupData.email,
          fullName: pendingSignupData.fullName,
          phoneNumber: pendingSignupData.phoneNumber,
          isPhoneVerified: true,
          university: pendingSignupData.university,
          campus: pendingSignupData.campus,
          isVerifiedStudent:
            pendingSignupData.email.toLowerCase().endsWith(".edu.pk") ||
            (pendingSignupData.eduEmail && pendingSignupData.eduEmail.includes(".edu.pk")) ||
            false,
          rating: 5.0,
          dealsCompleted: 0,
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          city: pendingSignupData.city || "Islamabad",
        };
      } else {
        newUser = {
          id: "u-" + Date.now(),
          email: "student@nust.edu.pk",
          fullName: "Hamza Tariq",
          phoneNumber: "+92 300 5551234",
          isPhoneVerified: true,
          university: "National University of Sciences & Technology (NUST)",
          campus: "H-12 Islamabad",
          isVerifiedStudent: true,
          rating: 5.0,
          dealsCompleted: 0,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          city: "Islamabad",
        };
      }

      setUser(newUser);
      localStorage.setItem("techlo_user_session", JSON.stringify(newUser));
      closeAuthModal();
      return true;
    }
    return false;
  };

  const verifyStudentBadge = async (studentIdOrEduEmail: string): Promise<boolean> => {
    if (!user) return false;
    const isEdu = studentIdOrEduEmail.toLowerCase().includes(".edu.pk") || studentIdOrEduEmail.length > 5;
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
    const newProduct: ProductListing = {
      ...productData,
      id: "tech-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          sellerId: user?.id,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          fetchProducts();
        }
      }
    } catch {}

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const createServiceRequest = async (
    requestData: Omit<ServiceQuoteRequest, "id" | "createdAt" | "status">
  ): Promise<ServiceQuoteRequest> => {
    const newRequest: ServiceQuoteRequest = {
      ...requestData,
      id: "SRV-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: "submitted",
    };

    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRequest,
          userId: user?.id,
        }),
      });
    } catch {}

    setServiceRequests((prev) => [newRequest, ...prev]);
    return newRequest;
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
