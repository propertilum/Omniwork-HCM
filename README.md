# OmniWork Enterprise HCM — Component-Based React Architecture

An industrial-grade, component-based React application for Human Capital Management (HCM), built with **React 19**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Firebase Firestore / Authentication**.

---

## 🏗️ Architecture & Component Hierarchy

The application has been modularized from a monolithic structure into a clean, reusable component-based architecture:

```
src/
├── config/
│   ├── firebase.js          # Firebase Auth & Firestore client with artifact scoping
│   └── constants.js         # Default org settings, departments, leave quotas, initial seed data
├── context/
│   ├── AuthContext.jsx       # Authentication state, login, register, logout, profile sync
│   └── HCMContext.jsx        # Attendance, employees, leaves, settings, comms, audit logs
├── utils/
│   ├── geo.js               # Haversine formula for GPS geofence distance calculation
│   ├── formatters.js        # Timer (HH:MM:SS), currency (PKR), dates, and M6 payroll calculations
│   └── geminiMock.js        # AI Copilot engine: NLP leave parsing & HR policy reasoning
├── components/
│   ├── common/
│   │   ├── KpiCard.jsx      # Metrics overview cards with trends and badge colors
│   │   └── Badge.jsx        # Color-coded status badges (Present, Late, Approved, etc.)
│   ├── layout/
│   │   ├── Navbar.jsx       # Top enterprise navbar with scope, guide button, and profile menu
│   │   ├── Sidebar.jsx      # Desktop navigation with role-based visibility
│   │   ├── MobileNav.jsx    # Native-style bottom mobile navigation dock
│   │   └── MobileMoreSheet.jsx # Expandable drawer for modules on mobile
│   ├── auth/
│   │   └── AuthScreen.jsx   # Sign in & first-run enterprise setup with quick demo logins
│   ├── dashboard/
│   │   └── DashboardView.jsx # Executive dashboard with KPI metrics, session clock, and feeds
│   ├── attendance/
│   │   └── CheckInHubView.jsx # Live camera feed, face frame scanner, GPS Haversine verification
│   ├── profile/
│   │   └── UserProfileHubView.jsx # Self-service profile with banking, education, assets, & avatar camera
│   ├── employees/
│   │   ├── EmployeeDirectoryView.jsx   # Directory with search, department & role filters
│   │   ├── EmployeeRegistrationPage.jsx # Multi-step onboarding with face biometric capture
│   │   └── Employee360Modal.jsx        # Detailed 360-degree employee dossier modal
│   ├── leaves/
│   │   ├── LeavesView.jsx    # Leave quota cards, history table, and approve/reject workflows
│   │   └── ApplyLeaveModal.jsx # Absence application modal with AI pre-fill support
│   ├── payroll/
│   │   ├── PayrollView.jsx   # M6 payroll table (gross 1.5x basic, tax, late deduction calculations)
│   │   └── PayslipModal.jsx  # Printable/downloadable official employee payslip
│   ├── setup/
│   │   └── OrgSetupView.jsx  # Admin organization rules, office coordinates, and geofence radius
│   ├── comms/
│   │   └── CommsView.jsx     # Corporate notice board and announcement publisher
│   ├── audit/
│   │   └── AuditLogView.jsx  # Searchable security audit event trail
│   ├── ai/
│   │   └── AIAssistantDrawer.jsx # Gemini HR Copilot drawer with natural language leave parsing
│   └── modals/
│       └── ArchitectureGuideModal.jsx # Interactive system architecture & module guide
├── App.jsx                  # Main view router & overlay modal orchestrator
├── main.jsx                 # Application entry point
└── index.css                # Tailwind CSS styling and enterprise dark scrollbars
```

---

## ⚡ Core Features & Modules

1. **Module 1 (M1) — Auth & Access Control**:
   - Secure sign-in & first-run admin account registration.
   - Quick Demo accounts for Admin, HR, and Employee roles.
2. **Module 2 (M2) — Org Setup & Geofence**:
   - Global shift timing, grace minutes (15 min), and half-day thresholds.
   - Office GPS coordinate settings (`lat: 24.8607, lng: 67.0011`) and radius perimeter (`150m`).
3. **Module 3 (M3) — Directory & Self-Service Profile**:
   - Self-service hub: Personal Details, Banking (IBAN/SWIFT), Skills, and Assigned Hardware Assets.
   - Live Webcam portrait capture for profile pictures.
   - Employee registration with live facial biometric template generation.
4. **Module 4 (M4) — Optical Biometric & GPS Attendance Terminal**:
   - Real HTML5 webcam stream with live face bounding box and laser scan animation.
   - Device GPS retrieval with Haversine distance calculations against office coordinates.
   - Shift duration timer that increments every second when checked in.
5. **Module 5 (M5) — Leave Entitlements & Absence Control**:
   - Quotas for Annual (14d), Casual (10d), Sick (8d), and Unpaid leaves.
   - Status tracking (`Pending`, `Approved`, `Rejected`) with HR review buttons.
6. **Module 6 (M6) — Automated Compensation & Payslips**:
   - 1.5x Basic Pay multiplier (Basic + 25% HRA + 15% Conveyance + 10% Medical).
   - Late penalty calculations (every 3 lates = 0.5 day deduction).
   - Progressive income tax brackets.
   - Print/Save as PDF payslip modal with formal corporate layout.
7. **Module 7 (M7) — Executive Analytics & Real-Time Punch Stream**:
   - Headcount, present counts, approved absences, and gross payroll sums.
8. **Module 8 (M8) — Gemini AI HR Copilot**:
   - Interactive slide-over drawer assistant.
   - Natural language leave parsing: type *"I need 2 days sick leave starting tomorrow"* -> automatically configures and opens the leave application with 1 click.
9. **Module 9 (M9) — Immutable Security Audit Logs**:
   - Real-time event ledger tracking punches, profile edits, leaves, and org settings changes.

---

## 🚀 Running the Project

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
