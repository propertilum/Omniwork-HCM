import React from 'react';
import { X, Layers, ShieldCheck, Database, Cpu, Compass, Lock, Zap } from 'lucide-react';
import Badge from '../common/Badge';

export default function ArchitectureGuideModal({ onClose }) {
  const MODULES = [
    { id: "M1", title: "Authentication & Role-Based Access Control", desc: "Firebase Auth with email/password, custom tokens, and 3 scoped roles (Admin, HR, Employee)." },
    { id: "M2", title: "Organization Rules & Geofence Engine", desc: "Office coordinates, customizable geofence radius (meters), grace periods, and late penalty deduction formulas." },
    { id: "M3", title: "Human Capital Directory & Profile Hub", desc: "Self-service profile hub (Banking, Education, Assets, Biometrics) + HR Employee Directory with 360° view." },
    { id: "M4", title: "Live Webcam Biometrics & GPS Geofence Terminal", desc: "HTML5 Webcam media stream with face lock scanner + Haversine GPS radius distance checking." },
    { id: "M5", title: "Leave Entitlements & Absence Control", desc: "Annual, Casual, Sick, and Unpaid leave quota counters, overlap prevention, and HR approval/rejection workflows." },
    { id: "M6", title: "Automated Corporate Compensation (Payroll Lite)", desc: "1.5x Gross multiplier (Basic + Allowances: Housing 25%, Transport 15%, Medical 10%), tax slabs, late deduction penalties, and printable payslips." },
    { id: "M7", title: "Executive Analytics & Dashboard", desc: "High-level metrics, active headcount, attendance ratios, and real-time punch feeds." },
    { id: "M8", title: "Gemini AI HR Copilot", desc: "Natural language leave parser (auto-fills formal leave applications) and intelligent HR policy assistant." },
    { id: "M9", title: "Immutable Security Audit Trail", desc: "Chronological audit logging of all system transactions, biometric punches, and settings changes." },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-xs flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-600/20 border border-cyan-500/40 rounded-lg text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono">OmniWork HCM // System Architecture</h2>
              <div className="text-[10px] text-slate-400 font-mono">Component-Based Industrial Architecture</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-1 text-cyan-200">
            <span className="font-bold flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5" />
              <span>Cloud Infrastructure: Firebase Firestore & Authentication</span>
            </span>
            <p className="text-[11px] text-cyan-300/80">
              Connected to Firebase project <code className="bg-cyan-950 px-1 py-0.5 rounded text-cyan-200 font-mono">hcm--lite</code> with real-time listeners for instant synchronization across all connected clients.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-bold text-white uppercase text-[10px] tracking-wider font-mono">
              Nine Core Modules:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {MODULES.map(m => (
                <div key={m.id} className="p-3 bg-[#090D16] border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.title}</span>
                    <Badge variant="cyan" size="xs">{m.id}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
