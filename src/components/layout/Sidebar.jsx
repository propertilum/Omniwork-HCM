import React from 'react';
import {
  PieChart, Camera, User, UserCheck, Users, CheckCircle,
  DollarSign, Building, Shield, MessageSquare, Bot, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';

function SidebarItem({ icon: Icon, label, active, onClick, badge, badgeColor = "cyan" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left cursor-pointer group ${
        active
          ? "bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-center space-x-2.5 min-w-0">
        <Icon className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-cyan-400 scale-105" : "text-slate-400 group-hover:text-slate-200"}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
          badgeColor === "emerald" 
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ activeTab, setActiveTab, onOpenAIChat }) {
  const { userProfile } = useAuth();
  const { isCheckedIn, leaves } = useHCM();

  const role = userProfile?.role || "Employee";
  const pendingLeavesCount = leaves.filter(l => l.status === "Pending").length;

  return (
    <aside className="hidden md:flex w-64 bg-[#0B0F17] border-r border-slate-800 flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1 overflow-y-auto text-xs">
        <SidebarItem
          icon={PieChart}
          label="Executive Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />

        <SidebarItem
          icon={Camera}
          label="Live Camera & GPS Punch"
          active={activeTab === "checkin"}
          onClick={() => setActiveTab("checkin")}
          badge={isCheckedIn ? "Active" : null}
          badgeColor="emerald"
        />

        <SidebarItem
          icon={User}
          label="Self-Service Profile Hub"
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />

        {(role === "Admin" || role === "HR") && (
          <>
            <div className="pt-4 pb-1 text-[10px] font-bold uppercase text-slate-500 px-3 tracking-wider font-mono">
              People Operations
            </div>
            <SidebarItem
              icon={UserCheck}
              label="Register Employee"
              active={activeTab === "registration"}
              onClick={() => setActiveTab("registration")}
            />
            <SidebarItem
              icon={Users}
              label="Employee Directory"
              active={activeTab === "employees"}
              onClick={() => setActiveTab("employees")}
            />
            <SidebarItem
              icon={CheckCircle}
              label="Leave Approval Inbox"
              active={activeTab === "leaves"}
              onClick={() => setActiveTab("leaves")}
              badge={pendingLeavesCount > 0 ? `${pendingLeavesCount} New` : null}
              badgeColor="amber"
            />
            <SidebarItem
              icon={DollarSign}
              label="Payroll Lite (M6)"
              active={activeTab === "payroll"}
              onClick={() => setActiveTab("payroll")}
            />
          </>
        )}

        {role === "Admin" && (
          <>
            <div className="pt-4 pb-1 text-[10px] font-bold uppercase text-slate-500 px-3 tracking-wider font-mono">
              Administration
            </div>
            <SidebarItem
              icon={Building}
              label="Organization Setup"
              active={activeTab === "setup"}
              onClick={() => setActiveTab("setup")}
            />
            <SidebarItem
              icon={Shield}
              label="Security Audit Log"
              active={activeTab === "audit"}
              onClick={() => setActiveTab("audit")}
            />
          </>
        )}

        <div className="pt-4 pb-1 text-[10px] font-bold uppercase text-slate-500 px-3 tracking-wider font-mono">
          Communications
        </div>
        <SidebarItem
          icon={MessageSquare}
          label="Announcements"
          active={activeTab === "comms"}
          onClick={() => setActiveTab("comms")}
        />
      </div>

      <div className="p-3 border-t border-slate-800 bg-[#080C14]">
        <button
          onClick={onOpenAIChat}
          className="w-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/40 p-2.5 rounded-lg flex items-center justify-between transition group text-xs font-medium cursor-pointer shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>AI Copilot (Gemini)</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </button>
      </div>
    </aside>
  );
}
