import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthScreen() {
  const { login, signup, authError, setAuthError } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [emailInput, setEmailInput] = useState("admin@omniwork.io");
  const [passwordInput, setPasswordInput] = useState("OmniWork@2026");
  const [fullNameInput, setFullNameInput] = useState("");
  const [roleInput, setRoleInput] = useState("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authMode === "login") {
        await login(emailInput, passwordInput);
      } else {
        await signup(emailInput, passwordInput, fullNameInput, roleInput);
      }
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === "Admin") {
      setEmailInput("admin@omniwork.io");
      setPasswordInput("OmniWork@2026");
    } else if (role === "HR") {
      setEmailInput("hr@omniwork.io");
      setPasswordInput("OmniWork@2026");
    } else {
      setEmailInput("employee@omniwork.io");
      setPasswordInput("OmniWork@2026");
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#0D121F] border border-slate-800 p-8 rounded-xl shadow-2xl space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-cyan-400 font-bold shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono">OmniWork HCM</h1>
          <p className="text-xs text-slate-400">Industrial Executive Human Capital Management Suite</p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-[#090D16] border border-slate-800/80 p-2.5 rounded-lg">
          <div className="text-[10px] text-slate-400 font-mono uppercase mb-1.5 flex items-center gap-1">
            <Key className="w-3 h-3 text-cyan-400" />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoFill("Admin")}
              className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition font-mono"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("HR")}
              className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 transition font-mono"
            >
              HR Ops
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("Employee")}
              className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700 transition font-mono"
            >
              Employee
            </button>
          </div>
        </div>

        {authError && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === "signup" && (
            <>
              <div>
                <label className="block mb-1 font-medium text-slate-300">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Zaitoon Ashraf"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg focus:border-cyan-500 text-white outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-slate-300">Enterprise Role Scope</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg focus:border-cyan-500 text-white outline-none"
                >
                  <option value="Admin">Admin (Full System Access)</option>
                  <option value="HR">HR Operations</option>
                  <option value="Employee">Employee Self-Service</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 font-medium text-slate-300">Corporate Email</label>
            <input
              required
              type="email"
              placeholder="admin@omniwork.io"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg focus:border-cyan-500 text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-300">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg focus:border-cyan-500 text-white outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : authMode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Enterprise Portal</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete First-Run Enterprise Setup</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login");
              setAuthError("");
            }}
            className="text-cyan-400 hover:underline text-xs font-medium cursor-pointer"
          >
            {authMode === "login" ? "First-run setup? Register new Admin Account" : "Existing user? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
