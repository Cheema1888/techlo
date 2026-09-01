import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TECHLO Production Database...");

  // 1. Clean existing records
  await prisma.savedItem.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Verified Student Users
  const user1 = await prisma.user.create({
    data: {
      id: "u-101",
      email: "hamza.tariq@seecs.nust.edu.pk",
      fullName: "Hamza Tariq",
      phoneNumber: "+923005551234",
      isPhoneVerified: true,
      university: "National University of Sciences & Technology (NUST)",
      campus: "H-12 Islamabad (SEECS)",
      studentIdOrEduEmail: "hamza.tariq@seecs.nust.edu.pk",
      isVerifiedStudent: true,
      city: "Islamabad",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      dealsCompleted: 14,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "u-102",
      email: "ali.raza@lhr.nu.edu.pk",
      fullName: "Ali Raza Khan",
      phoneNumber: "+923214449876",
      isPhoneVerified: true,
      university: "FAST-NUCES Lahore",
      campus: "Faisal Town Campus",
      studentIdOrEduEmail: "ali.raza@lhr.nu.edu.pk",
      isVerifiedStudent: true,
      city: "Lahore",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      dealsCompleted: 9,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: "u-103",
      email: "zainab.fatima@giki.edu.pk",
      fullName: "Zainab Fatima",
      phoneNumber: "+923331112233",
      isPhoneVerified: true,
      university: "Ghulam Ishaq Khan Institute (GIKI)",
      campus: "Topi Main Campus",
      studentIdOrEduEmail: "zainab.fatima@giki.edu.pk",
      isVerifiedStudent: true,
      city: "Topi",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      rating: 4.8,
      dealsCompleted: 6,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      id: "u-104",
      email: "usman.ghani@uettaxila.edu.pk",
      fullName: "Usman Ghani",
      phoneNumber: "+923459998877",
      isPhoneVerified: true,
      university: "University of Engineering & Technology, Taxila",
      campus: "Main Campus Taxila",
      studentIdOrEduEmail: "usman.ghani@uettaxila.edu.pk",
      isVerifiedStudent: true,
      city: "Taxila",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      dealsCompleted: 11,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      id: "u-105",
      email: "bilal.mehmood@neduet.edu.pk",
      fullName: "Bilal Mehmood",
      phoneNumber: "+923002223344",
      isPhoneVerified: true,
      university: "NED University of Engineering & Technology",
      campus: "Main Campus, University Road",
      studentIdOrEduEmail: "bilal.mehmood@neduet.edu.pk",
      isVerifiedStudent: true,
      city: "Karachi",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      dealsCompleted: 18,
    },
  });

  // 3. Seed Hardware Listings
  const products = [
    {
      id: "tech-001",
      title: "Raspberry Pi 4 Model B (4GB RAM) + Aluminum Armor Heat Sink Case",
      category: "development_boards",
      condition: "fyp_tested",
      pricePkr: 14500,
      originalPricePkr: 22000,
      isNegotiable: true,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Used for 3 months in our AI Computer Vision FYP. 100% working condition, thoroughly stress-tested with dual display and camera interface. Includes dual fan passive/active aluminum armor heatsink case and 5V 3A Type-C power adapter.",
      specsJson: JSON.stringify({
        "RAM": "4GB LPDDR4-3200",
        "Processor": "Broadcom BCM2711, Quad-core Cortex-A72 @ 1.5GHz",
        "Condition": "Pristine, 0 overheating issues",
        "Includes": "Heatsink Case, 32GB SanDisk Ultra SD Card",
      }),
      quantityAvailable: 1,
      status: "available",
      location: "NUST H-12 Campus / Rawalpindi",
      city: "Islamabad",
      sellerId: user1.id,
      viewsCount: 148,
    },
    {
      id: "tech-002",
      title: "ESP32-CAM WiFi + Bluetooth Camera Module with OV2640 2MP + FTDI Programmer",
      category: "wireless_iot",
      condition: "brand_new",
      pricePkr: 1650,
      originalPricePkr: 2400,
      isNegotiable: false,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Brand new sealed in anti-static bag. Bought extra for IoT surveillance lab module. Comes with 2MP OV2640 camera lens and FT232RL FTDI USB-to-TTL programmer with jumper wires so you can flash code directly without any extra parts.",
      specsJson: JSON.stringify({
        "Chip": "ESP32-S dual-core 32-bit LX6",
        "Camera": "OV2640 2 Megapixel (Supports JPEG streaming)",
        "Flash": "Built-in bright LED flash light",
        "Wireless": "802.11 b/g/n Wi-Fi + BLE 4.2",
      }),
      quantityAvailable: 3,
      status: "available",
      location: "FAST Lahore / Faisal Town",
      city: "Lahore",
      sellerId: user2.id,
      viewsCount: 92,
    },
    {
      id: "tech-003",
      title: "STM32F401CCU6 BlackPill (ARM Cortex-M4 84MHz) + ST-Link V2 Debugger",
      category: "microcontrollers",
      condition: "brand_new",
      pricePkr: 2100,
      originalPricePkr: 3200,
      isNegotiable: true,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Original WeAct BlackPill STM32F401 board with pre-soldered precision pin headers. USB-C interface with DFU bootloader. Bundle includes mini ST-Link V2 programmer for Keil / STM32CubeIDE debugging.",
      specsJson: JSON.stringify({
        "Core": "ARM 32-bit Cortex-M4 with FPU @ 84MHz",
        "Flash / SRAM": "256 KB Flash, 64 KB SRAM",
        "USB": "Type-C connector with OTG support",
        "Debugger": "ST-Link V2 (SWD) with 4-pin cable",
      }),
      quantityAvailable: 2,
      status: "available",
      location: "GIKI Topi Campus / Swabi",
      city: "Topi",
      sellerId: user3.id,
      viewsCount: 210,
    },
    {
      id: "tech-004",
      title: "NEMA 17 Stepper Motor (High Torque 42Ncm) + TB6600 4A Stepper Driver",
      category: "motors_actuators",
      condition: "gently_used",
      pricePkr: 2850,
      originalPricePkr: 4500,
      isNegotiable: true,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Used for 2 weeks on a CNC plotter project. High torque 1.8 degree step angle. Includes high quality optocoupled TB6600 driver (supports microstepping up to 1/32 and 9-42V input). Works smoothly with Arduino CNC shield and GRBL.",
      specsJson: JSON.stringify({
        "Holding Torque": "42 N.cm (60 oz.in)",
        "Current": "1.5A per phase",
        "Driver": "TB6600 (Up to 4A peak, 32 microstep settings)",
        "Shaft": "5mm D-shaft with mounting bracket",
      }),
      quantityAvailable: 4,
      status: "available",
      location: "UET Taxila / Saddar Rawalpindi",
      city: "Taxila",
      sellerId: user4.id,
      viewsCount: 77,
    },
    {
      id: "tech-005",
      title: "3S 2200mAh 11.1V 35C LiPo Battery + IMAX B6 80W Digital Balance Charger",
      category: "power_bms",
      condition: "fyp_tested",
      pricePkr: 4900,
      originalPricePkr: 8200,
      isNegotiable: true,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1608613304899-ea8098577e38?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Used in our Autonomous Drone FYP. Only 8 charge-discharge cycles, zero puffing, internal cell resistance balanced perfectly (~3.85V storage charge currently maintained). Comes with IMAX B6 digital balance charger with 12V 5A power supply.",
      specsJson: JSON.stringify({
        "Capacity": "2200mAh 3S1P (11.1V)",
        "Discharge Rate": "35C Constant, 70C Burst (XT60 connector)",
        "Charger": "IMAX B6 80W Microprocessor Controlled",
        "Safety": "Comes with Fireproof LiPo Safe Guard Bag",
      }),
      quantityAvailable: 1,
      status: "available",
      location: "NED Karachi / University Road",
      city: "Karachi",
      sellerId: user5.id,
      viewsCount: 165,
    },
    {
      id: "tech-006",
      title: "USB Logic Analyzer 24MHz 8-Channel (Saleae Compatible) with Test Hooks",
      category: "test_tools",
      condition: "brand_new",
      pricePkr: 1450,
      originalPricePkr: 2200,
      isNegotiable: false,
      imagesJson: JSON.stringify([
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      ]),
      description:
        "Essential for hardware & embedded debugging! Decodes I2C, SPI, UART, CAN, 1-Wire protocol in real time. Works with PulseView / Sigrok on Windows, Mac, and Linux. Comes with mini USB cable and 10-pack gripper test clips.",
      specsJson: JSON.stringify({
        "Sampling Rate": "24 MHz Max",
        "Channels": "8 Channels logic capture",
        "Input Voltage": "0V to 5.5V (Supports 3.3V and 5V logic)",
        "Software": "Sigrok / PulseView / Saleae Logic 1.x compatible",
      }),
      quantityAvailable: 5,
      status: "available",
      location: "COMSATS Islamabad / Park Road",
      city: "Islamabad",
      sellerId: user1.id,
      viewsCount: 180,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // 4. Seed Sample Service Orders
  await prisma.serviceRequest.create({
    data: {
      id: "srv-001",
      serviceType: "pcb_design",
      title: "4-Layer IoT Gateway PCB Schematic & Layout with Impedance Control",
      description:
        "ESP32-S3 + SIM7600G-H LTE modem baseboard with isolated RS485 and wide input (9-36V) DC-DC buck converter. KiCad 8 source files and Gerber package delivered.",
      clientName: "Daniyal Ahmed",
      clientUniversity: "NUST SEECS",
      clientPhone: "+923001112233",
      filesJson: JSON.stringify([{ name: "schematic_draft_v2.pdf", size: "2.4 MB", type: "PDF" }]),
      estimatedCostPkr: 8500,
      status: "in_progress",
      deadline: "2026-09-10",
      userId: user1.id,
    },
  });

  await prisma.serviceRequest.create({
    data: {
      id: "srv-002",
      serviceType: "3d_printing",
      title: "Custom Weather-Proof Drone Gimbal & Flight Controller Enclosure",
      description:
        "Printed in Matte Black PETG at 0.16mm layer height with 40% gyroid infill and brass heat-set M3 threaded inserts.",
      clientName: "Kashif Nisar",
      clientUniversity: "Air University Islamabad",
      clientPhone: "+923451234567",
      filesJson: JSON.stringify([{ name: "drone_gimbal_v4.stl", size: "14.8 MB", type: "STL" }]),
      estimatedCostPkr: 3200,
      status: "completed",
      deadline: "2026-08-30",
      userId: user4.id,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
