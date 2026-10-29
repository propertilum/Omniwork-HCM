import React from 'react';
import { Users, UserCheck, DollarSign, Building, Shield, MessageSquare, Bot, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileMoreSheet({ isOpen, onClose, onSelectTab, onOpenAIChat }) {
  const { userProfile } = useAuth();
  const role = userProfile?.role || "Employee";

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-14 z-50 bg-[#0D121F] border-t border-slate-800 p-4 rounded-t-xl space-y-3 shadow-2xl text-xs animate-in slide-in-from-bottom duration-200">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
          OmniWork System Modules
        </span>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => { onSelectTab("employees"); onClose(); }}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Directory</span>
        </button>

        {(role === "Admin" || role === "HR") && (
          <>
            <button
              onClick={() => { onSelectTab("registration"); onClose(); }}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Register Emp</span>
            </button>

            <button
              onClick={() => { onSelectTab("payroll"); onClose(); }}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Payroll Lite</span>
            </button>
          </>
        )}

        {role === "Admin" && (
          <>
            <button
              onClick={() => { onSelectTab("setup"); onClose(); }}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
            >
              <Building className="w-4 h-4 text-indigo-400" />
              <span>Org Setup</span>
            </button>

            <button
              onClick={() => { onSelectTab("audit"); onClose(); }}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Audit Logs</span>
            </button>
          </>
        )}

        <button
          onClick={() => { onSelectTab("comms"); onClose(); }}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center space-x-2 text-slate-200 hover:border-slate-700 transition"
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Comms</span>
        </button>

        <button
          onClick={() => { onOpenAIChat(); onClose(); }}
          className="p-2.5 bg-cyan-950/40 border border-cyan-800/60 rounded-lg flex items-center space-x-2 text-cyan-300 font-semibold col-span-2 hover:bg-cyan-900/40 transition"
        >
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>AI Gemini Copilot</span>
        </button>
      </div>
    </div>
  );
}
