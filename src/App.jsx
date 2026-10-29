import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HCMProvider, useHCM } from './context/HCMContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import MobileMoreSheet from './components/layout/MobileMoreSheet';

// View Modules
import AuthScreen from './components/auth/AuthScreen';
import DashboardView from './components/dashboard/DashboardView';
import CheckInHubView from './components/attendance/CheckInHubView';
import UserProfileHubView from './components/profile/UserProfileHubView';
import EmployeeDirectoryView from './components/employees/EmployeeDirectoryView';
import EmployeeRegistrationPage from './components/employees/EmployeeRegistrationPage';
import LeavesView from './components/leaves/LeavesView';
import PayrollView from './components/payroll/PayrollView';
import OrgSetupView from './components/setup/OrgSetupView';
import CommsView from './components/comms/CommsView';
import AuditLogView from './components/audit/AuditLogView';

// Modals & Drawers
import ArchitectureGuideModal from './components/modals/ArchitectureGuideModal';
import AIAssistantDrawer from './components/ai/AIAssistantDrawer';
import Employee360Modal from './components/employees/Employee360Modal';
import ApplyLeaveModal from './components/leaves/ApplyLeaveModal';
import PayslipModal from './components/payroll/PayslipModal';

function MainApp() {
  const { authUser, userProfile, authLoading } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Modals & Drawers
  const [showArchGuide, setShowArchGuide] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedEmp360, setSelectedEmp360] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [prefilledSmartLeave, setPrefilledSmartLeave] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-slate-400">
            Initializing OmniWork Enterprise Core...
          </div>
        </div>
      </div>
    );
  }

  // Authentication Guard
  if (!authUser || !userProfile) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col font-sans select-none pb-16 md:pb-0">
      {/* ENTERPRISE TOP NAVBAR */}
      <Navbar
        onOpenArchGuide={() => setShowArchGuide(true)}
        onNavigateProfile={() => setActiveTab("profile")}
      />

      {/* APP BODY LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAIChat={() => setShowAIChat(true)}
        />

        {/* MAIN WORKSPACE VIEW ROUTER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#070A0F]">
          {activeTab === "dashboard" && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenLeaveModal={() => setShowLeaveModal(true)}
              onOpenAIChat={() => setShowAIChat(true)}
            />
          )}

          {activeTab === "checkin" && (
            <CheckInHubView />
          )}

          {activeTab === "profile" && (
            <UserProfileHubView />
          )}

          {activeTab === "registration" && (userProfile.role === "Admin" || userProfile.role === "HR") && (
            <EmployeeRegistrationPage
              onDone={() => setActiveTab("employees")}
            />
          )}

          {activeTab === "employees" && (
            <EmployeeDirectoryView
              onSelectEmployee360={(emp) => setSelectedEmp360(emp)}
              onOpenRegister={() => setActiveTab("registration")}
            />
          )}

          {activeTab === "leaves" && (
            <LeavesView
              onOpenApplyModal={() => setShowLeaveModal(true)}
            />
          )}

          {activeTab === "payroll" && (userProfile.role === "Admin" || userProfile.role === "HR") && (
            <PayrollView
              onSelectPayslip={(record) => setSelectedPayslip(record)}
            />
          )}

          {activeTab === "setup" && userProfile.role === "Admin" && (
            <OrgSetupView />
          )}

          {activeTab === "comms" && (
            <CommsView />
          )}

          {activeTab === "audit" && userProfile.role === "Admin" && (
            <AuditLogView />
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleMoreSheet={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
        isMoreSheetOpen={isMobileMoreOpen}
      />

      {/* MOBILE EXPANDABLE MORE SHEET */}
      <MobileMoreSheet
        isOpen={isMobileMoreOpen}
        onClose={() => setIsMobileMoreOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAIChat={() => setShowAIChat(true)}
      />

      {/* OVERLAY MODALS & DRAWERS */}
      <AIAssistantDrawer
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onSmartLeaveParsed={(smartLeave) => {
          setPrefilledSmartLeave(smartLeave);
          setShowAIChat(false);
          setShowLeaveModal(true);
        }}
      />

      {selectedEmp360 && (
        <Employee360Modal
          emp={selectedEmp360}
          onClose={() => setSelectedEmp360(null)}
        />
      )}

      {showLeaveModal && (
        <ApplyLeaveModal
          onClose={() => {
            setShowLeaveModal(false);
            setPrefilledSmartLeave(null);
          }}
          prefilled={prefilledSmartLeave}
        />
      )}

      {selectedPayslip && (
        <PayslipModal
          record={selectedPayslip}
          companyName={selectedPayslip.companyName}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

      {showArchGuide && (
        <ArchitectureGuideModal
          onClose={() => setShowArchGuide(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HCMProviderWrapper />
    </AuthProvider>
  );
}

// Wrapper to pass userProfile into HCMProvider
function HCMProviderWrapper() {
  const { userProfile } = useAuth();
  return (
    <HCMProvider userProfile={userProfile}>
      <MainApp />
    </HCMProvider>
  );
}
