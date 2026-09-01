export type ComponentCategory =
  | "microcontrollers"
  | "sensors"
  | "motors_actuators"
  | "power_bms"
  | "wireless_iot"
  | "displays"
  | "test_tools"
  | "passives_ics"
  | "robotics_chassis"
  | "development_boards";

export type HardwareCondition =
  | "brand_new" // Brand New in sealed / anti-static bag
  | "fyp_tested" // Tested & 100% working in a university FYP
  | "gently_used" // Minor use, pins intact
  | "desoldered_working" // Desoldered from a board, functional
  | "for_parts"; // Non-working or salvaged for components

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: string;
  campuses?: string[];
  programs: string[];
  logoBgColor: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  university: string;
  campus?: string;
  studentIdOrEduEmail?: string;
  isVerifiedStudent: boolean;
  city: string;
  avatarUrl?: string;
  joinedDate?: string;
  rating: number;
  dealsCompleted: number;
}

export interface ProductListing {
  id: string;
  title: string;
  category: ComponentCategory;
  condition: HardwareCondition;
  pricePkr: number;
  originalPricePkr?: number;
  isNegotiable: boolean;
  images: string[];
  description: string;
  specs: { [key: string]: string };
  seller: {
    id: string;
    name: string;
    email?: string;
    university: string;
    campus: string;
    city: string;
    avatarUrl: string;
    isVerifiedStudent: boolean;
    rating: number;
    phone: string;
  };
  quantityAvailable: number;
  status: "available" | "reserved" | "sold";
  createdAt: string;
  viewsCount: number;
  location: string;
}

export type EngineeringServiceType =
  | "pcb_design"
  | "pcb_fabrication"
  | "cad_3d_modeling"
  | "3d_printing"
  | "firmware_embedded";

export interface ServiceRequest {
  id: string;
  serviceType: EngineeringServiceType;
  title: string;
  description: string;
  clientName: string;
  clientUniversity: string;
  clientPhone: string;
  files: Array<{ name: string; size: string; type: string }>;
  estimatedCostPkr: number;
  status: "submitted" | "under_review" | "quoted" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  deadline?: string;
  customSpecs?: { [key: string]: string | number };
}

export type ServiceQuoteRequest = ServiceRequest;
