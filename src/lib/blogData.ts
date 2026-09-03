export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: "Hardware Guides" | "PCB Prototyping" | "Engineering Tips" | "FYP Success";
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  tags: string[];
  sections: {
    heading?: string;
    content: string[];
    callout?: {
      type: "tip" | "warning" | "note";
      text: string;
    };
    codeSnippet?: {
      language: string;
      code: string;
    };
  }[];
}

export const BLOG_CATEGORIES = [
  "All",
  "Hardware Guides",
  "PCB Prototyping",
  "Engineering Tips",
  "FYP Success",
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "complete-guide-sourcing-hardware-fyp-pakistan-2026",
    title: "Complete Guide to Sourcing Hardware & FYP Components in Pakistan (2026)",
    excerpt: "Where to buy genuine microcontrollers, sensors, and LiPo batteries in Pakistan without overpaying or waiting weeks for customs clearance.",
    category: "Hardware Guides",
    readTime: "6 min read",
    publishedAt: "September 3, 2026",
    author: {
      name: "Abdul Rehman Cheema",
      role: "Founder, TECHLO & arix",
      avatarInitials: "AC",
    },
    tags: ["ESP32", "FYP", "Hardware Sourcing", "Pakistan", "Sensors"],
    sections: [
      {
        heading: "The FYP Hardware Dilemma in Pakistan",
        content: [
          "Every year between September and February, thousands of engineering students across NUST, FAST, GIKI, UET, and NED face the exact same roadblock: sourcing reliable hardware components for their Final Year Projects (FYPs).",
          "International orders from AliExpress or DigiKey often take 4 to 8 weeks to clear Pakistani customs, and surprise regulatory duties can double the cost. Meanwhile, local retail shops in Hall Road (Lahore), College Road (Rawalpindi), or Saddar (Karachi) frequently stock obsolete revisions or clone ICs that fail during project evaluations.",
        ],
        callout: {
          type: "tip",
          text: "Always ask local sellers for high-resolution IC markings or test them on a breadboard before soldering. Genuine ESP32 modules feature crisp laser-engraved Espressif shields.",
        },
      },
      {
        heading: "1. The 3 Sourcing Channels: Pros & Cons",
        content: [
          "**Channel A: Campus Hardware Exchange (Fastest & Cheapest)**\nGraduating seniors often have unopened sensors, IMUs, buck converters, and development boards left over from completed FYPs. Buying verified components from students at your own campus saves 40% to 70% of the cost and takes zero shipping days.",
          "**Channel B: Domestic Online Distributors**\nWebsites like HallRoad.org or local robotics stores ship within 2 to 3 days via TCS or Leopard Courier. They are great for standard passives, breadboards, jumper wires, and common sensors (DHT22, MPU6050, Ultrasonic).",
          "**Channel C: Consolidated Direct Import**\nWhen you need specialized industrial sensors (such as LiDAR, thermal cameras, or high-discharge LiPo batteries), consolidate your orders with other FYP groups to share the international freight and customs handling fees.",
        ],
      },
      {
        heading: "2. Watch Out for LiPo Battery Regulations",
        content: [
          "Lithium Polymer (LiPo) batteries are classified as Dangerous Goods (DG) by international air freight carriers. Importing them individually from overseas is virtually impossible without hazardous materials declarations.",
          "For robotics and drone FYPs, source your 3S/4S LiPo packs and BMS boards locally or swap with drone club members at your university campus.",
        ],
        callout: {
          type: "warning",
          text: "Never charge bare LiPo cells without a dedicated Battery Management System (BMS) circuit. Over-discharge below 3.0V per cell permanently ruins the chemistry.",
        },
      },
      {
        heading: "3. How TECHLO Solves the Bottleneck",
        content: [
          "TECHLO connects verified engineering students across 20+ Pakistani university campuses. You can search directly by your university (e.g. NUST SEECS, FAST Islamabad, GIKI) to pick up hardware on campus within hours, pay via Cash on Delivery or digital transfer, and chat directly with student sellers.",
        ],
      },
    ],
  },
  {
    slug: "from-kicad-to-fabrication-custom-pcb-ordering-pakistan",
    title: "From KiCad to Fabrication: How to Order Custom PCBs in Pakistan",
    excerpt: "Step-by-step walkthrough to design, generate Gerber files, verify clearances, and batch fabricate double-layer PCBs without customs headaches.",
    category: "PCB Prototyping",
    readTime: "8 min read",
    publishedAt: "September 1, 2026",
    author: {
      name: "TECHLO Prototyping Lab",
      role: "Hardware Engineering Team",
      avatarInitials: "TL",
    },
    tags: ["KiCad", "Gerber Files", "PCB Fabrication", "JLCPCB", "Batch Fabrication"],
    sections: [
      {
        heading: "Moving Beyond Perfboards & Breadboards",
        content: [
          "Messy breadboards with rat-nest jumper wires are the number one cause of intermittent faults during external FYP jury evaluations. Transitioning your schematic to a professional double-sided printed circuit board (PCB) immediately boosts reliability, noise immunity, and presentation score.",
          "Modern open-source tools like KiCad 8 make professional board layout accessible to every student with zero licensing fees.",
        ],
      },
      {
        heading: "1. Golden Design Rules for Low-Cost Manufacturing",
        content: [
          "To keep your PCB fabrication within standard student pricing tiers, ensure your layout adheres to standard 2-layer parameters:",
          "• Minimum Trace Width / Clearance: **6 mil (0.1524 mm)**\n• Minimum Via Drill Size: **0.3 mm (via diameter 0.6 mm)**\n• Maximum Board Dimensions: **100 mm × 100 mm** (fits in standard lowest-tier pricing)\n• Surface Finish: **HASL with Lead or Lead-Free** (lowest cost and easiest for hand soldering)",
        ],
        callout: {
          type: "tip",
          text: "Always run KiCad's Design Rules Checker (DRC) with vendor-specified constraints before exporting Gerbers. Zero DRC errors means zero fabrication delays.",
        },
      },
      {
        heading: "2. Exporting Gerber RS-274X & Drill Files",
        content: [
          "Your fabrication house needs standard Gerber and Excellon drill files, not your `.kicad_pcb` source file. In KiCad:",
          "1. Go to **File → Fabrication Outputs → Gerbers (.gbr)**\n2. Select: Top/Bottom Copper (F.Cu, B.Cu), Solder Mask (F.Mask, B.Mask), Silkscreen (F.Silks, B.Silks), and Board Outline (Edge.Cuts)\n3. Click **Generate Drill Files (.drl)** and choose 2:4 decimal format, millimeters\n4. Compress all output files into a single `.zip` archive",
        ],
      },
      {
        heading: "3. Consolidated Batch Ordering via TECHLO",
        content: [
          "Ordering an individual 5-board prototype from international fabricators usually costs $2 for the boards, but $25 to $35 for DHL/FedEx shipping plus local customs clearance.",
          "TECHLO offers **Consolidated Batch Fabrication** for Pakistani universities. We pool board designs from multiple student FYP groups into a single consolidated bi-weekly panel shipment, dividing the freight cost and clearing customs locally so you get production-grade boards at student-friendly rates.",
        ],
      },
    ],
  },
  {
    slug: "3d-printing-fyp-enclosures-petg-pla-resin",
    title: "3D Printing for FYP Enclosures: PETG vs PLA vs Resin for IoT Devices",
    excerpt: "Which filament or resin should you choose for outdoor IoT enclosures, robotic chassis, and hand-held sensor casings in Pakistani weather?",
    category: "Engineering Tips",
    readTime: "5 min read",
    publishedAt: "August 28, 2026",
    author: {
      name: "Engr. Hamza Malik",
      role: "CAD & Rapid Prototyping Specialist",
      avatarInitials: "HM",
    },
    tags: ["3D Printing", "CAD Modeling", "PETG", "PLA", "Enclosures"],
    sections: [
      {
        heading: "Why Material Choice Dictates Enclosure Lifespan",
        content: [
          "Designing a sleek 3D enclosure in Fusion 360 or SolidWorks is only half the battle. If you print an agricultural IoT sensor enclosure or an automotive telemetry unit with the wrong material, Pakistani summer temperatures (40°C to 48°C) will cause it to warp and sag within 48 hours.",
        ],
      },
      {
        heading: "PLA: Perfect for Indoor Presentation Models",
        content: [
          "**Pros:** Ultra-easy to print, crisp surface detail, zero warping on unheated beds, wide color selection.\n**Cons:** Low glass transition temperature (~55°C). Brittle under mechanical shear stresses.\n**Best for:** Indoor desktop displays, FYP lab demos, and mockups.",
        ],
      },
      {
        heading: "PETG: The King for Real-World Field Hardware",
        content: [
          "**Pros:** Glass transition temp (~80°C), superior UV resistance, high layer adhesion, impact resistant, water repellent.\n**Cons:** Requires precise stringing retraction calibration and heated beds.\n**Best for:** Outdoor weather stations, industrial IoT enclosures, drone landing skids, and agricultural probes.",
        ],
        callout: {
          type: "tip",
          text: "Use threaded brass heat-set inserts (M3) instead of threading directly into plastic. Pressing an insert with a regular soldering iron gives high-torque mechanical screw fastenings that can be assembled and disassembled dozens of times.",
        },
      },
      {
        heading: "Resin (SLA/DLP): When Micro-Precision Matters",
        content: [
          "**Pros:** Near injection-molded smoothness, sub-50-micron tolerance, airtight seal channels.\n**Cons:** More expensive, sensitive to direct UV sunlight over prolonged periods.\n**Best for:** Medical prototypes, optical sensor mounts, custom button caps, and intricate gear teeth.",
        ],
      },
    ],
  },
  {
    slug: "why-hardware-circular-economy-matters-pakistan-universities",
    title: "Why a Student Hardware Circular Economy Matters in Pakistani Universities",
    excerpt: "Hostel drawers are filled with working sensors and dev boards. How inter-batch hardware recycling reduces FYP expenses and fosters campus innovation.",
    category: "FYP Success",
    readTime: "4 min read",
    publishedAt: "August 20, 2026",
    author: {
      name: "Abdul Rehman Cheema",
      role: "Founder, TECHLO & arix",
      avatarInitials: "AC",
    },
    tags: ["Circular Economy", "FYP Budget", "Student Community", "Sustainability"],
    sections: [
      {
        heading: "The 'Hostel Drawer Graveyard'",
        content: [
          "Walk into any senior hostel room after graduation week at NUST, FAST, or UET, and you'll find plastic organizers filled with working ESP32s, Raspberry Pis, motor drivers, GSM modules, and ultrasonic sensors. Once the final demonstration is graded, over 80% of these components gather dust or end up in landfills.",
          "Meanwhile, incoming 3rd and 4th-year students struggle with budget constraints, spending thousands of rupees ordering the exact same sensors from commercial vendors.",
        ],
      },
      {
        heading: "Slashing FYP Hardware Costs by 60%",
        content: [
          "When seniors list their hardware on TECHLO, two things happen:",
          "1. **The Seller Recovers Cash:** Graduating students recoup 40% to 60% of their FYP out-of-pocket investment before leaving campus.",
          "2. **The Buyer Saves Budget:** Junior students get pre-tested, working hardware at half the retail price, with zero shipping delay and in-person campus handoff.",
        ],
        callout: {
          type: "note",
          text: "Every component bought on campus keeps precious electronic equipment in use, prevents e-waste, and builds direct mentorship connections between senior and junior engineering batches.",
        },
      },
      {
        heading: "Join the Movement on TECHLO",
        content: [
          "Whether you have a spare stepper motor or are building an autonomous drone, list your components today on TECHLO. It takes less than 60 seconds to post an ad, upload photos, and connect with fellow student makers.",
        ],
      },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(currentSlug: string, category: string, limit: number = 2): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug && (p.category === category || true)).slice(0, limit);
}
