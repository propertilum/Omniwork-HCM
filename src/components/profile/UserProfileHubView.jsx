import React, { useState, useEffect, useRef } from 'react';
import {
  User, CreditCard, GraduationCap, Laptop, Camera,
  Check, AlertTriangle, ShieldCheck, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileHubView() {
  const { userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ ...userProfile });
  const [activeSubTab, setActiveSubTab] = useState("personal");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAvatarCam, setShowAvatarCam] = useState(false);
  const avatarVideoRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setFormData({ ...userProfile });
    }
  }, [userProfile]);

  const handleCaptureAvatar = async () => {
    try {
      setShowAvatarCam(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (avatarVideoRef.current) {
        avatarVideoRef.current.srcObject = stream;
      }
    } catch {
      alert("Camera unavailable for avatar snapshot. Canvas avatar will be rendered.");
    }
  };

  const handleSnapAvatar = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 52px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((formData.name || 'U').charAt(0).toUpperCase(), 64, 64);
      const dataUrl = canvas.toDataURL();
      setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
    }

    if (avatarVideoRef.current && avatarVideoRef.current.srcObject) {
      const tracks = avatarVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowAvatarCam(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs select-none">
      {/* PROFILE HEADER CARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0D121F] border border-slate-800 p-5 rounded-xl shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-500 overflow-hidden flex items-center justify-center text-cyan-400 font-bold text-xl shrink-0 group">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (formData.name || 'U').charAt(0).toUpperCase()
            )}
            <button
              type="button"
              onClick={handleCaptureAvatar}
              className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white cursor-pointer"
              title="Snapshot profile avatar"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{formData.name}</h2>
            <div className="text-slate-400 font-mono mt-0.5">
              {formData.empId} • {formData.dept} • {formData.role}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{formData.email}</div>
          </div>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold flex items-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Profile Saved to Cloud</span>
          </span>
        )}
      </div>

      {/* WEBCAM AVATAR SNAPSHOT OVERLAY */}
      {showAvatarCam && (
        <div className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl space-y-3 shadow-2xl">
          <div className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Capture Live Portrait Photo</span>
            <button
              onClick={() => {
                if (avatarVideoRef.current && avatarVideoRef.current.srcObject) {
                  avatarVideoRef.current.srcObject.getTracks().forEach(t => t.stop());
                }
                setShowAvatarCam(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="w-full h-52 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
            <video ref={avatarVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={handleSnapAvatar}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold cursor-pointer"
          >
            Take Snapshot & Update Avatar
          </button>
        </div>
      )}

      {/* SUB-TABS NAVIGATION */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
        {[
          { id: "personal", label: "Personal Details", icon: User },
          { id: "banking", label: "Banking & Salary", icon: CreditCard },
          { id: "education", label: "Education & Skills", icon: GraduationCap },
          { id: "assets", label: "Assigned Assets", icon: Laptop },
        ].map(st => (
          <button
            key={st.id}
            onClick={() => setActiveSubTab(st.id)}
            className={`px-3.5 py-2 rounded-t-lg font-semibold flex items-center space-x-2 transition cursor-pointer ${
              activeSubTab === st.id
                ? "bg-slate-800 text-cyan-400 border-t border-x border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <st.icon className="w-3.5 h-3.5" />
            <span>{st.label}</span>
          </button>
        ))}
      </div>

      {/* FORM CONTENTS */}
      <form onSubmit={handleSubmit} className="bg-[#0D121F] border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
        {activeSubTab === "personal" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-400">Full Official Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">CNIC / Passport Identification</label>
                <input
                  type="text"
                  value={formData.cnic || ''}
                  onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">Blood Group</label>
                <select
                  value={formData.bloodGroup || 'O+'}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Emergency Contact Person & Phone</label>
              <input
                type="text"
                value={formData.emergencyContact || ''}
                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                placeholder="Spouse / Parent Name and Emergency Phone Number"
              />
            </div>
          </div>
        )}

        {activeSubTab === "banking" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-400">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={e => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">Account Title</label>
                <input
                  type="text"
                  value={formData.bankDetails?.accountTitle || ''}
                  onChange={e => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, accountTitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">IBAN Number</label>
                <input
                  type="text"
                  value={formData.bankDetails?.iban || ''}
                  onChange={e => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, iban: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">SWIFT / BIC Code</label>
                <input
                  type="text"
                  value={formData.bankDetails?.swift || ''}
                  onChange={e => setFormData({
                    ...formData,
                    bankDetails: { ...formData.bankDetails, swift: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "education" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-slate-400">Technical Skills & Certifications (Comma separated)</label>
              <input
                type="text"
                value={(formData.skills || []).join(", ")}
                onChange={e => setFormData({
                  ...formData,
                  skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                })}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
                placeholder="React, TypeScript, HCM Systems, Docker"
              />
            </div>

            <div className="space-y-2 pt-2">
              <span className="font-semibold text-slate-300">Academic Background:</span>
              {(formData.education || []).map((edu, idx) => (
                <div key={idx} className="p-3 bg-[#090D16] border border-slate-800 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white">{edu.degree}</div>
                    <div className="text-slate-400 text-[11px]">{edu.institute}</div>
                  </div>
                  <span className="font-mono text-cyan-400 text-xs">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "assets" && (
          <div className="space-y-3">
            <span className="font-semibold text-slate-300">Corporate Equipment Assigned:</span>
            <div className="space-y-2">
              {(formData.assignedAssets || []).map((ast, idx) => (
                <div key={idx} className="p-3 bg-[#090D16] border border-slate-800 rounded-lg flex justify-between items-center font-mono">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">{ast.item}</span>
                  </div>
                  <span className="text-slate-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    SN: {ast.serial}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition shadow-md cursor-pointer mt-4"
        >
          Save Profile Details to Cloud
        </button>
      </form>
    </div>
  );
}
