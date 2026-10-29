import React, { useState } from 'react';
import {
  X, User, CreditCard, Laptop, GraduationCap, ShieldCheck,
  Calendar, Clock, Building, Mail, Phone, MapPin
} from 'lucide-react';
import { useHCM } from '../../context/HCMContext';
import { formatPKR, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function Employee360Modal({ emp, onClose }) {
  const { attendance, leaves } = useHCM();
  const [tab, setTab] = useState("overview");

  if (!emp) return null;

  const empAttendance = attendance.filter(a => a.empId === emp.empId);
  const empLeaves = leaves.filter(l => l.empId === emp.empId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-[#090D16]">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-cyan-500 overflow-hidden flex items-center justify-center font-bold text-cyan-400 text-xl font-mono shrink-0">
              {emp.avatarUrl ? (
                <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
              ) : (
                (emp.name || 'E').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">{emp.name}</h2>
                <Badge variant={emp.role === "Admin" ? "purple" : emp.role === "HR" ? "emerald" : "default"} size="xs">
                  {emp.role}
                </Badge>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {emp.empId} • {emp.dept} • Joined {formatDate(emp.joinDate || "2023-01-01")}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">{emp.email}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 px-5 bg-[#0A0E18] space-x-3 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "compensation", label: "Compensation & Bank" },
            { id: "assets", label: "Assets & Tech" },
            { id: "history", label: "Punches & Leaves" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2.5 font-semibold transition border-b-2 cursor-pointer ${
                tab === t.id
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-[#090D16] border border-slate-800 p-4 rounded-xl">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Mobile Contact</span>
                  <span className="text-white font-mono font-medium">{emp.phone || "Not set"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">CNIC Identification</span>
                  <span className="text-white font-mono font-medium">{emp.cnic || "Not set"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Blood Group</span>
                  <span className="text-white font-mono font-medium">{emp.bloodGroup || "O+"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Biometrics Verified</span>
                  <span className={`font-mono font-medium ${emp.faceEnrolled ? "text-emerald-400" : "text-amber-400"}`}>
                    {emp.faceEnrolled ? "Enrolled Face Scan" : "Pending Enrollment"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono mb-1">Emergency Contact</span>
                <div className="p-3 bg-[#090D16] border border-slate-800 rounded-lg text-slate-300">
                  {emp.emergencyContact || "No emergency contact specified."}
                </div>
              </div>
            </div>
          )}

          {tab === "compensation" && (
            <div className="space-y-4">
              <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monthly Basic Salary:</span>
                  <span className="text-white font-mono font-bold text-sm">{formatPKR(emp.basicSalary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Gross (with 50% Allowances):</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">
                    {formatPKR(Number(emp.basicSalary || 0) * 1.5)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl space-y-2">
                <div className="text-slate-300 font-semibold mb-1">Direct Deposit Account:</div>
                <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Bank Name</span>
                    <span>{emp.bankDetails?.bankName || "Standard Chartered"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Account Title</span>
                    <span>{emp.bankDetails?.accountTitle || emp.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block">IBAN</span>
                    <span>{emp.bankDetails?.iban || "PK00SCBL0000000000000000"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "assets" && (
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold block mb-2">Corporate Hardware:</span>
                <div className="space-y-2">
                  {(emp.assignedAssets || []).map((ast, idx) => (
                    <div key={idx} className="p-3 bg-[#090D16] border border-slate-800 rounded-lg flex justify-between items-center font-mono">
                      <div className="flex items-center space-x-2">
                        <Laptop className="w-4 h-4 text-cyan-400" />
                        <span className="text-white">{ast.item}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">SN: {ast.serial}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-2">Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(emp.skills || []).map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-cyan-300 rounded font-mono text-[11px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold block mb-2">Recent Attendance Logs:</span>
                {empAttendance.length === 0 ? (
                  <div className="p-4 bg-[#090D16] border border-slate-800 rounded-lg text-slate-500 text-center">
                    No punch history recorded for this employee yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-[#090D16]">
                    {empAttendance.slice(0, 5).map((att, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-300">{att.date}</span>
                        <span className="font-mono text-slate-400">In: {att.checkIn} | Out: {att.checkOut || "-"}</span>
                        <Badge variant={att.status === "Present" ? "emerald" : "amber"} size="xs">
                          {att.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
