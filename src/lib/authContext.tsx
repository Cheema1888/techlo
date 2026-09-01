"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, ProductListing, ServiceRequest } from "./types";
import { MOCK_PRODUCTS, MOCK_SERVICES } from "./mockData";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalView: "login" | "signup" | "otp" | "verify_student";
  openAuthModal: (view?: "login" | "signup" | "otp" | "verify_student") => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: "login" | "signup" | "otp" | "verify_student") => void;
  
  // Auth Actions
  pendingSignupData: any;
  setPendingSignupData: (data: any) => void;
  generatedOtp: string;
  sendPhoneOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (enteredOtp: string) => boolean;
  loginWithEmailOrPhone: (identifier: string, pass: string) => boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  verifyStudentBadge: (eduEmailOrId: string) => void;

  // Marketplace & Orders State
  products: ProductListing[];
  userProducts: ProductListing[];
  savedProductIds: string[];
  toggleSaveProduct: (id: string) => void;
  addProductListing: (newProduct: Omit<ProductListing, "id" | "seller" | "createdAt" | "viewsCount" | "status">) => ProductListing;
  markProductStatus: (id: string, status: "available" | "reserved" | "sold") => void;

  // Services State
  serviceRequests: ServiceRequest[];
  createServiceRequest: (request: Omit<ServiceRequest, "id" | "createdAt" | "status">) => ServiceRequest;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: "u-current-01",
  fullName: "Muhammad Saad",
  email: "saad.eng@nust.edu.pk",
  phoneNumber: "+923009876543",
  isPhoneVerified: true,
  university: "National University of Sciences & Technology (NUST)",
  campus: "H-12 Islamabad (SEECS)",
  studentIdOrEduEmail: "saad.eng@nust.edu.pk",
  isVerifiedStudent: true,
  city: "Islamabad",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  joinedDate: "2026-05-15",
  rating: 4.95,
  dealsCompleted: 14,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "otp" | "verify_student">("login");
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>("742918");
  
  // Marketplace & Services state
  const [products, setProducts] = useState<ProductListing[]>(MOCK_PRODUCTS);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["tech-001", "tech-003"]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(MOCK_SERVICES);

  // Initialize from LocalStorage if present, else fallback
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("techlo_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Provide demo authenticated student user by default for rich first experience
        setUser(DEFAULT_USER);
        localStorage.setItem("techlo_user", JSON.stringify(DEFAULT_USER));
      }

      const localProducts = localStorage.getItem("techlo_products");
      if (localProducts) {
        setProducts(JSON.parse(localProducts));
      }

      const localSaved = localStorage.getItem("techlo_saved");
      if (localSaved) {
        setSavedProductIds(JSON.parse(localSaved));
      }

      const localServices = localStorage.getItem("techlo_services");
      if (localServices) {
        setServiceRequests(JSON.parse(localServices));
      }
    } catch (e) {
      console.warn("Storage loading fallback", e);
    }
  }, []);

  const openAuthModal = (view: "login" | "signup" | "otp" | "verify_student" = "login") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const sendPhoneOtp = async (phoneNumber: string): Promise<boolean> => {
    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    console.log(`[TECHLO SECURITY] SMS OTP sent to ${phoneNumber}: ${code}`);
    return true;
  };

  const verifyOtp = (enteredOtp: string): boolean => {
    // Check if entered matches generated code (or master demo code '123456')
    if (enteredOtp === generatedOtp || enteredOtp === "123456" || enteredOtp === "742918") {
      if (pendingSignupData) {
        const newUser: UserProfile = {
          id: `u-${Date.now()}`,
          fullName: pendingSignupData.fullName || "Student Maker",
          email: pendingSignupData.email || "user@techlo.pk",
          phoneNumber: pendingSignupData.phoneNumber || "+923000000000",
          isPhoneVerified: true,
          university: pendingSignupData.university || "NUST",
          campus: pendingSignupData.campus || "Main Campus",
          studentIdOrEduEmail: pendingSignupData.eduEmail || "",
          isVerifiedStudent: !!pendingSignupData.eduEmail,
          city: pendingSignupData.city || "Islamabad",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${pendingSignupData.fullName || "techlo"}`,
          joinedDate: new Date().toISOString().split("T")[0],
          rating: 5.0,
          dealsCompleted: 0,
        };
        setUser(newUser);
        localStorage.setItem("techlo_user", JSON.stringify(newUser));
        setPendingSignupData(null);
      } else if (user) {
        const updated = { ...user, isPhoneVerified: true };
        setUser(updated);
        localStorage.setItem("techlo_user", JSON.stringify(updated));
      }
      closeAuthModal();
      return true;
    }
    return false;
  };

  const loginWithEmailOrPhone = (identifier: string, _pass: string): boolean => {
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email: identifier.includes("@") ? identifier : DEFAULT_USER.email,
      phoneNumber: !identifier.includes("@") ? identifier : DEFAULT_USER.phoneNumber,
    };
    setUser(loggedUser);
    localStorage.setItem("techlo_user", JSON.stringify(loggedUser));
    closeAuthModal();
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("techlo_user");
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("techlo_user", JSON.stringify(updated));
  };

  const verifyStudentBadge = (eduEmailOrId: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      studentIdOrEduEmail: eduEmailOrId,
      isVerifiedStudent: true,
    };
    setUser(updated);
    localStorage.setItem("techlo_user", JSON.stringify(updated));
  };

  const toggleSaveProduct = (id: string) => {
    setSavedProductIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("techlo_saved", JSON.stringify(next));
      return next;
    });
  };

  const addProductListing = (
    newProductData: Omit<ProductListing, "id" | "seller" | "createdAt" | "viewsCount" | "status">
  ): ProductListing => {
    const newProduct: ProductListing = {
      ...newProductData,
      id: `tech-${Date.now()}`,
      seller: {
        id: user?.id || "u-guest",
        name: user?.fullName || "Verified Student",
        university: user?.university || "National University",
        campus: user?.campus || "Main Campus",
        city: user?.city || "Islamabad",
        avatarUrl: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isVerifiedStudent: user?.isVerifiedStudent ?? true,
        rating: user?.rating || 5.0,
        phone: user?.phoneNumber || "+923001234567",
      },
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      status: "available",
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("techlo_products", JSON.stringify(updated));
    return newProduct;
  };

  const markProductStatus = (id: string, status: "available" | "reserved" | "sold") => {
    const updated = products.map((p) => (p.id === id ? { ...p, status } : p));
    setProducts(updated);
    localStorage.setItem("techlo_products", JSON.stringify(updated));
  };

  const createServiceRequest = (
    requestData: Omit<ServiceRequest, "id" | "createdAt" | "status">
  ): ServiceRequest => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `srv-${Date.now()}`,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    const updated = [newRequest, ...serviceRequests];
    setServiceRequests(updated);
    localStorage.setItem("techlo_services", JSON.stringify(updated));
    return newRequest;
  };

  const userProducts = products.filter((p) => p.seller.id === user?.id || p.seller.phone === user?.phoneNumber);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        pendingSignupData,
        setPendingSignupData,
        generatedOtp,
        sendPhoneOtp,
        verifyOtp,
        loginWithEmailOrPhone,
        logout,
        updateUserProfile,
        verifyStudentBadge,
        products,
        userProducts,
        savedProductIds,
        toggleSaveProduct,
        addProductListing,
        markProductStatus,
        serviceRequests,
        createServiceRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
