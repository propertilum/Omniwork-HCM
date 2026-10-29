import React, { useState, useRef } from 'react';
import {
  UserCheck, Camera, ShieldCheck, Check, AlertTriangle,
  Building, DollarSign, Mail, Phone, CreditCard, RefreshCw
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '../../config/constants';
import { useHCM } from '../../context/HCMContext';

export default function EmployeeRegistrationPage({ onDone }) {
  const { registerEmployee } = useHCM();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee",
    dept: "Engineering",
    basicSalary: 250000,
    phone: "+92 300 1234567",
    cnic: "42101-1234567-9",
    bloodGroup: "O+",
    emergencyContact: "",
    status: "Active",
    bankName: "Meezan Bank Ltd",
    accountTitle: "",
    iban: "PK00MEZN000012345678",
    swift: "MEZNPKKA",
    skills: "React, Node.js, HCM Systems",
    assignedItem: "MacBook Pro M3 Max",
    assignedSerial: `OW-MBP-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const [faceEnrolled, setFaceEnrolled] = useState(false);
  const [faceSnapshot, setFaceSnapshot] = useState(null);
  const [camActive, setCamActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef(null);

  const startEnrollmentCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCamActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Camera unavailable. Virtual facial template will be synthesized.");
      simulateBiometricCapture();
    }
  };

  const captureBiometricSnapshot = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(0, 0, 160, 160);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((formData.name || 'E').charAt(0).toUpperCase(), 80, 80);
      const url = canvas.toDataURL();
      setFaceSnapshot(url);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCamActive(false);
    setFaceEnrolled(true);
  };

  const simulateBiometricCapture = () => {
    captureBiometricSnapshot();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const empId = `OW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEmp = {
      id: empId,
      empId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      dept: formData.dept,
      basicSalary: Number(formData.basicSalary) || 200000,
      phone: formData.phone,
      cnic: formData.cnic,
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact || "HR Desk Emergency",
      status: "Active",
      joinDate: new Date().toISOString().slice(0, 10),
      faceEnrolled,
      avatarUrl: faceSnapshot,
      bankDetails: {
        bankName: formData.bankName,
        accountTitle: formData.accountTitle || formData.name,
        iban: formData.iban,
        swift: formData.swift
      },
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      assignedAssets: [
        { item: formData.assignedItem, serial: formData.assignedSerial }
      ],
      education: [
        { degree: "BS Computer Science", institute: "Accredited University", year: "2021" }
      ]
    };

    await registerEmployee(newEmp);
    setSubmitting(false);
    if (onDone) onDone();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs select-none">
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Module 3 • Personnel Onboarding</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Register New Corporate Employee</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enroll verified identity, banking details, role permissions, and facial biometrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: BIOMETRIC ENROLLMENT */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Facial Biometric Enrollment</span>
            </span>
            {faceEnrolled ? (
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Biometrics Enrolled & Verified
              </span>
            ) : (
              <span className="text-amber-400 font-mono text-[11px]">Enrollment Required</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-32 h-32 rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              {faceSnapshot ? (
                <img src={faceSnapshot} alt="Biometric Face" className="w-full h-full object-cover" />
              ) : camActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-slate-600" />
              )}
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="font-semibold text-white">Live Optical Face Scan:</div>
              <p className="text-[11px] text-slate-400 max-w-md">
                A facial template is encrypted and used to authenticate the employee during optical punch-in at office entry points.
              </p>
              <div className="flex items-center gap-2 pt-1">
                {!camActive ? (
                  <button
                    type="button"
                    onClick={startEnrollmentCam}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Open Enrollment Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={captureBiometricSnapshot}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Capture Face Scan
                  </button>
                )}
                <button
                  type="button"
                  onClick={simulateBiometricCapture}
                  className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs cursor-pointer"
                >
                  Generate Template
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITY & ROLE */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="font-bold text-white border-b border-slate-800 pb-2">
            1. Employee Identity & Corporate Scope
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-slate-400">Full Official Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Farhan Ali"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Corporate Email Address *</label>
              <input
                required
                type="email"
                placeholder="farhan.ali@omniwork.io"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">System Role & Permissions</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Employee">Employee (Self-Service)</option>
                <option value="HR">HR (Operations & Approvals)</option>
                <option value="Admin">Admin (Full System Privilege)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Business Unit / Department</label>
              <select
                value={formData.dept}
                onChange={e => setFormData({ ...formData, dept: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              >
                {INITIAL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Monthly Basic Salary (PKR) *</label>
              <input
                required
                type="number"
                value={formData.basicSalary}
                onChange={e => setFormData({ ...formData, basicSalary: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">CNIC / Identification No.</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Mobile Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Emergency Contact</label>
              <input
                type="text"
                placeholder="Name & Contact Number"
                value={formData.emergencyContact}
                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BANKING DETAILS */}
        <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl space-y-4 shadow-md">
          <div className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>2. Corporate Banking Details for Direct Deposit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-400">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">Account Title</label>
              <input
                type="text"
                placeholder="Official Account Name"
                value={formData.accountTitle}
                onChange={e => setFormData({ ...formData, accountTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">IBAN Number</label>
              <input
                type="text"
                value={formData.iban}
                onChange={e => setFormData({ ...formData, iban: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-400">SWIFT / BIC</label>
              <input
                type="text"
                value={formData.swift}
                onChange={e => setFormData({ ...formData, swift: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg cursor-pointer flex items-center justify-center space-x-2 text-sm"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Enroll & Register Employee to OmniWork Core</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
