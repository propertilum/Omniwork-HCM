import React from 'react';
import { PieChart, Camera, Calendar, User, Grid } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, onToggleMoreSheet, isMoreSheetOpen }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around text-[10px] font-medium text-slate-400 select-none">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex flex-col items-center space-y-1 transition ${activeTab === "dashboard" ? "text-cyan-400 font-bold" : "hover:text-slate-200"}`}
      >
        <PieChart className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab("checkin")}
        className={`flex flex-col items-center space-y-1 transition ${activeTab === "checkin" ? "text-cyan-400 font-bold" : "hover:text-slate-200"}`}
      >
        <Camera className="w-5 h-5" />
        <span>Check-In</span>
      </button>

      <button
        onClick={() => setActiveTab("leaves")}
        className={`flex flex-col items-center space-y-1 transition ${activeTab === "leaves" ? "text-cyan-400 font-bold" : "hover:text-slate-200"}`}
      >
        <Calendar className="w-5 h-5" />
        <span>Leaves</span>
      </button>

      <button
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center space-y-1 transition ${activeTab === "profile" ? "text-cyan-400 font-bold" : "hover:text-slate-200"}`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>

      <button
        onClick={onToggleMoreSheet}
        className={`flex flex-col items-center space-y-1 transition ${isMoreSheetOpen ? "text-cyan-400 font-bold" : "hover:text-slate-200"}`}
      >
        <Grid className="w-5 h-5" />
        <span>More</span>
      </button>
    </div>
  );
}
