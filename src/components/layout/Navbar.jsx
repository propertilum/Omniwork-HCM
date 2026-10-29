import React from 'react';
import { Zap, HelpCircle, LogOut as LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenArchGuide, onNavigateProfile }) {
  const { userProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-cyan-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-white text-sm font-mono">OmniWork HCM</span>
        </div>
        {userProfile && (
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-slate-800/80 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
            Industrial Executive • Scope: {userProfile.role}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onOpenArchGuide}
          className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer"
          title="View System Architecture & Modules"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">System Guide</span>
        </button>

        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

        {userProfile && (
          <button
            onClick={onNavigateProfile}
            className="flex items-center space-x-2.5 text-left p-1 rounded hover:bg-slate-800/60 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-cyan-400 font-bold text-xs">
              {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userProfile.name ? userProfile.name.charAt(0) : "U"
              )}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-200 leading-none">{userProfile.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{userProfile.empId}</div>
            </div>
          </button>
        )}

        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded border border-slate-700 transition cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
