import { jsPDF } from "jspdf";

// Helper to load an image element and return base64 data URL
function loadImageAsDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateResumePdf(): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor: [number, number, number] = [9, 44, 36]; // #092c24 (Deep Emerald)
  const secondaryColor: [number, number, number] = [16, 185, 129]; // #10b981 (Emerald Green)
  const mintLight: [number, number, number] = [110, 231, 183]; // #6ee7b7 (Mint)
  const textDark: [number, number, number] = [30, 41, 59]; // #1e293b (Slate 800)
  const textMuted: [number, number, number] = [100, 116, 139]; // #64748b (Slate 500)
  const textSubtle: [number, number, number] = [71, 85, 105]; // #475569 (Slate 600)
  const bgCard: [number, number, number] = [248, 250, 252]; // #f8fafc (Slate 50)
  const borderLight: [number, number, number] = [226, 232, 240]; // #e2e8f0 (Slate 200)

  // Try to load user photo
  const photoDataUrl = await loadImageAsDataUrl("/porto.jpg");

  // =========================================================================
  // PAGE 1
  // =========================================================================

  // 1. TOP HEADER BANNER (Deep Emerald)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 48, "F");

  // Subtle accent line under header
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 48, pageWidth, 1.8, "F");

  // Avatar / Photo (Circular frame or neat square)
  const avatarX = margin + 2;
  const avatarY = 8;
  const avatarSize = 32;

  if (photoDataUrl) {
    try {
      doc.setDrawColor(...mintLight);
      doc.setLineWidth(0.8);
      doc.roundedRect(avatarX - 0.5, avatarY - 0.5, avatarSize + 1, avatarSize + 1, 2, 2, "S");
      doc.addImage(photoDataUrl, "JPEG", avatarX, avatarY, avatarSize, avatarSize);
    } catch {
      // fallback if image fail
    }
  }

  // Header Text
  const headerTextX = photoDataUrl ? avatarX + avatarSize + 6 : margin + 2;

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("ABDUL RAZAK, S.T.", headerTextX, 17);

  // Professional Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...mintLight);
  doc.text("FULL STACK SOFTWARE ENGINEER & NATIVE ANDROID DEVELOPER", headerTextX, 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 240, 235);
  doc.text("Enterprise Healthcare IT Systems Specialist • 8+ Years Professional Experience", headerTextX, 28);

  // Contact Info Row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 225, 218);
  doc.text("Email: elrazaq185@gmail.com  |  WhatsApp: +62 821-6944-1179  |  Kepulauan Riau, Indonesia", headerTextX, 35);
  doc.text("Freelance Portals: Fastwork Verified  •  Projects.co.id Verified Specialist", headerTextX, 40);

  let currentY = 56;

  // Helper function for section headings
  const drawSectionHeading = (title: string, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);

    // Decorative underline
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + 45, y + 2);

    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.3);
    doc.line(margin + 45, y + 2, margin + contentWidth, y + 2);

    return y + 7;
  };

  // 2. PROFESSIONAL SUMMARY
  currentY = drawSectionHeading("Professional Summary", currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  const summaryText =
    "Versatile Software Engineer and Systems Specialist with over 8 years of proven track record across full-stack web engineering, native Android development (Kotlin), and enterprise healthcare IT operations. Dedicated to architecting clean, resilient, and offline-first digital ecosystems, bridging modern web technologies with mission-critical enterprise infrastructure.";
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(splitSummary, margin, currentY);
  currentY += splitSummary.length * 4.4 + 4;

  // 3. CORE TECHNICAL ARSENAL (3 Columns)
  currentY = drawSectionHeading("Core Technical Arsenal & Domains", currentY);

  const colWidth = (contentWidth - 6) / 3;
  const colY = currentY;

  // Column 1: Native Mobile
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, colY, colWidth, 40, 2, 2, "FD");
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, colY, colWidth, 6, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("NATIVE ANDROID (KOTLIN)", margin + 3, colY + 4.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textSubtle);
  const mobileSkills = [
    "• Kotlin & Jetpack Compose",
    "• Room DB (Offline-First Sync)",
    "• MVVM & Clean Architecture",
    "• CameraX & QR Scanning",
    "• Geofencing GPS Anti-Mock",
    "• Retrofit, Coroutines & Flow",
    "• Thermal Bluetooth Printing",
  ];
  mobileSkills.forEach((skill, idx) => {
    doc.text(skill, margin + 3, colY + 11 + idx * 4);
  });

  // Column 2: Full Stack Web
  const col2X = margin + colWidth + 3;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(col2X, colY, colWidth, 40, 2, 2, "FD");
  doc.setFillColor(...primaryColor);
  doc.roundedRect(col2X, colY, colWidth, 6, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("FULL STACK WEB DEV", col2X + 3, colY + 4.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textSubtle);
  const webSkills = [
    "• Next.js & React 19 / 18",
    "• TypeScript & JavaScript (ES6+)",
    "• Tailwind CSS & Responsive UI",
    "• Node.js & RESTful APIs",
    "• PostgreSQL & Relational DBs",
    "• Zustand / Redux State Mgmt",
    "• Real-time WebSockets / Events",
  ];
  webSkills.forEach((skill, idx) => {
    doc.text(skill, col2X + 3, colY + 11 + idx * 4);
  });

  // Column 3: Enterprise IT & SIMRS
  const col3X = col2X + colWidth + 3;
  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(col3X, colY, colWidth, 40, 2, 2, "FD");
  doc.setFillColor(...primaryColor);
  doc.roundedRect(col3X, colY, colWidth, 6, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("ENTERPRISE IT & NETWORKS", col3X + 3, colY + 4.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textSubtle);
  const itSkills = [
    "• SIMRS Hospital Information",
    "• Network Routing & Mikrotik",
    "• Linux & Windows Server Admin",
    "• Medical Devices Hardware IT",
    "• VLAN & Network Segmentation",
    "• Data Backup & Disaster Recovery",
    "• High-Availability Infrastructure",
  ];
  itSkills.forEach((skill, idx) => {
    doc.text(skill, col3X + 3, colY + 11 + idx * 4);
  });

  currentY = colY + 45;

  // 4. PROFESSIONAL WORK EXPERIENCE
  currentY = drawSectionHeading("Professional Work Experience", currentY);

  // Job Helper
  const drawJob = (
    role: string,
    company: string,
    period: string,
    type: string,
    responsibilities: string[]
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...textDark);
    doc.text(role, margin, currentY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text(`${period} • ${type}`, margin + contentWidth, currentY, { align: "right" });

    currentY += 4.2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text(company, margin, currentY);

    currentY += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textSubtle);

    responsibilities.forEach((item) => {
      const splitItem = doc.splitTextToSize(`• ${item}`, contentWidth - 4);
      doc.text(splitItem, margin + 2, currentY);
      currentY += splitItem.length * 3.6;
    });

    currentY += 2.5;
  };

  // Job 1: RSUD Bintan
  drawJob(
    "Full Time IT Support & IT Infrastructure Specialist",
    "RSUD Bintan — Kabupaten Bintan, Kepulauan Riau",
    "2021 — PRESENT",
    "FULL TIME",
    [
      "Directing hospital-wide IT infrastructure, critical hospital local network architecture, and 24/7 server administration for uninterrupted clinical operations.",
      "Administering and maintaining core SIMRS (Sistem Informasi Manajemen Rumah Sakit) health database systems, emergency units, and electronic medical record workflows.",
      "Troubleshooting mission-critical medical computer peripherals, laboratory interfaces, and inter-departmental digital communication lines.",
    ]
  );

  // Job 2: Freelance Android Developer
  drawJob(
    "Freelance Android Developer",
    "Independent / Remote Client Projects",
    "2024 — PRESENT",
    "FREELANCE",
    [
      "Architecting native Android applications using Kotlin, Jetpack Compose, MVVM Clean Architecture, and Coroutines.",
      "Designing robust offline-first caching architectures via Room Database with automatic cloud background reconciliation.",
      "Implementing CameraX hardware integration, high-precision GPS geofencing with mock-location anti-fraud verification, and RESTful API sync.",
    ]
  );

  // Job 3: Biro Kesra
  drawJob(
    "Programmer & Systems Developer",
    "Biro Kesra Sekretariat Daerah Provinsi Kepulauan Riau",
    "2021 — 2025",
    "PART TIME",
    [
      "Engineered regional governmental public welfare and grant management web systems, digitizing bureaucratic documentation flows.",
      "Maintained institutional reporting databases and delivered stable cross-agency management dashboards.",
    ]
  );

  // Footer Page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text("Abdul Razak, S.T. — Curriculum Vitae", margin, pageHeight - 8);
  doc.text("Page 1 of 2", margin + contentWidth, pageHeight - 8, { align: "right" });

  // =========================================================================
  // PAGE 2
  // =========================================================================
  doc.addPage();

  // Top header mini bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 16, "F");
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 16, pageWidth, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("ABDUL RAZAK, S.T. — PROFESSIONAL PORTFOLIO & RESUME", margin, 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...mintLight);
  doc.text("elrazaq185@gmail.com  |  +62 821-6944-1179", margin + contentWidth, 10.5, { align: "right" });

  currentY = 24;

  // Continued Experience
  currentY = drawSectionHeading("Professional Work Experience (Continued)", currentY);

  // Job 4: Freelance Web Developer
  drawJob(
    "Freelance Full Stack Web Developer",
    "Independent / Diverse Commercial Clients",
    "2017 — PRESENT",
    "FREELANCE (8+ YEARS)",
    [
      "8+ years delivering bespoke full-stack web platforms, responsive corporate portals, high-converting landing pages, and administrative dashboards.",
      "Implementing modern React / Next.js server-side rendering, robust REST APIs, PostgreSQL / MySQL schema modeling, and secure authentication flows.",
      "Consistently achieving 95+ Google Lighthouse scores through optimized Core Web Vitals, asset minification, and responsive UX design.",
    ]
  );

  // 5. FEATURED PORTFOLIO PROJECTS
  currentY = drawSectionHeading("Featured Project Portfolio Highlights", currentY);

  const drawProject = (
    title: string,
    stack: string,
    desc: string,
    highlights: string[]
  ) => {
    doc.setFillColor(...bgCard);
    doc.setDrawColor(...borderLight);
    doc.roundedRect(margin, currentY, contentWidth, 23, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin + 3, currentY + 4.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...secondaryColor);
    doc.text(stack, margin + contentWidth - 3, currentY + 4.5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...textDark);
    doc.text(desc, margin + 3, currentY + 9);

    doc.setTextColor(...textSubtle);
    highlights.forEach((h, hIdx) => {
      doc.text(`• ${h}`, margin + 3, currentY + 13.5 + hIdx * 4);
    });

    currentY += 26;
  };

  // Project 1: Absensi Pegawai
  drawProject(
    "Integrated Employee Attendance System (Android Kotlin + Web Admin)",
    "Kotlin • CameraX • GPS Geofencing • Next.js • Tailwind",
    "Comprehensive dual-mode attendance ecosystem with fraud prevention & real-time analytics.",
    [
      "Native Android app with CameraX QR Scanner, anti-fake mock GPS validation, and offline-first Room database.",
      "Web Admin dashboard featuring interactive geofence map management, dynamic rotating QR generator, and PDF reports.",
    ]
  );

  // Project 2: Fleet Tracker & E-POS
  drawProject(
    "Smart Logistics Fleet Tracker & POS Platform",
    "Next.js • Leaflet GIS • Kotlin • Bluetooth ESC/POS • PostgreSQL",
    "Enterprise logistics telematics and retail transaction processing engine.",
    [
      "Real-time vehicle movement tracking with simulated telemetry, speed alerts, and route playback.",
      "Offline-first POS cart with direct thermal Bluetooth receipt printing and stock reconciliation.",
    ]
  );

  // Project 3: Smart TV Digital Signage
  drawProject(
    "Smart TV Digital Signage & Prayer Calculation System",
    "Next.js • Astronomical GPS Calculation • Offline Cache",
    "Enterprise digital signage for TV displays in community mosques and educational centers.",
    [
      "Automated astronomical prayer times calculation with high-precision GPS coordinate algorithms.",
      "Dynamic scrolling news ticker, offline fallback resilience, and orientation support.",
    ]
  );

  currentY += 2;

  // 6. EDUCATION BACKGROUND
  currentY = drawSectionHeading("Education Background", currentY);

  doc.setFillColor(...bgCard);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, currentY, contentWidth, 19, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...primaryColor);
  doc.text("Bachelor of Engineering in Informatics (S.T. / Sarjana Teknik Informatika)", margin + 3.5, currentY + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("UNDERGRADUATE DEGREE", margin + contentWidth - 3.5, currentY + 5, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text("Sekolah Tinggi Teknologi Indonesia (STTI Tanjungpinang)", margin + 3.5, currentY + 9.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textSubtle);
  doc.text(
    "Specialized in Software Engineering, Computer Networks, Applied Algorithms, and Enterprise Information Systems Modeling.",
    margin + 3.5,
    currentY + 14.5
  );

  currentY += 23;

  // 7. KEY VALUE PROPOSITIONS & METHODOLOGIES
  currentY = drawSectionHeading("Engineering Principles & Methodologies", currentY);

  const traits = [
    "Clean Architecture & SOLID Principles",
    "Offline-First Data Synchronization",
    "Mission-Critical Healthcare IT Reliability",
    "Enterprise Security & Access Control",
    "Cross-Functional Stakeholder Alignment",
    "Agile Iterative Delivery & Prototyping",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textDark);

  const traitColWidth = contentWidth / 2;
  traits.forEach((trait, i) => {
    const tx = margin + (i % 2) * traitColWidth;
    const ty = currentY + Math.floor(i / 2) * 4.5;
    doc.setFillColor(...secondaryColor);
    doc.circle(tx + 1, ty - 1, 0.9, "F");
    doc.text(trait, tx + 4, ty);
  });

  // Footer Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text("Abdul Razak, S.T. — Generated automatically from Interactive Portfolio", margin, pageHeight - 8);
  doc.text("Page 2 of 2", margin + contentWidth, pageHeight - 8, { align: "right" });

  // SAVE AND DOWNLOAD PDF
  doc.save("CV_Abdul_Razak_Software_Engineer.pdf");
}
