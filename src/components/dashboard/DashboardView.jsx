import React from 'react';
import {
  Users, UserCheck, Calendar, DollarSign, Camera, Clock,
  MapPin, Shield, Sparkles, ArrowRight, CheckCircle, AlertTriangle, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { formatTimer, formatPKR, formatDate } from '../../utils/formatters';
import KpiCard from '../common/KpiCard';
import Badge from '../common/Badge';

export default function DashboardView({ setActiveTab, onOpenLeaveModal, onOpenAIChat }) {
  const { userProfile } = useAuth();
  const { settings, employees, attendance, leaves, announcements, isCheckedIn, elapsedSeconds } = useHCM();

  // Metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.length;
  const lateCount = todayAttendance.filter(a => a.status === "Late").length;
  const onLeaveCount = leaves.filter(l => l.status === "Approved").length;

  const totalMonthlyGross = employees.reduce((acc, emp) => {
    const basic = Number(emp.basicSalary) || 200000;
    return acc + (basic * 1.5);
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* EXECUTIVE WELCOME BANNER */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{userProfile?.role || "Employee"} Portal Executive View</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Welcome back, {userProfile?.name || "Executive"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {settings.name} • Shift Start: {settings.officeStart} (Grace Window: {settings.graceMinutes}m)
          </p>
        </div>

        <div className="bg-[#070A0F] border border-slate-800 p-3.5 rounded-xl flex items-center space-x-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Live Shift Session</div>
            <div className="text-lg font-mono font-bold text-cyan-400">{formatTimer(elapsedSeconds)}</div>
          </div>
          <button
            onClick={() => setActiveTab("checkin")}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCheckedIn ? "Active Terminal" : "Punch In Now"}</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Headcount"
          value={employees.length}
          subtitle="Enrolled staff members"
          icon={Users}
          color="cyan"
          trend="+100% active"
        />
        <KpiCard
          title="Present Today"
          value={presentCount}
          subtitle={`${lateCount} marked as late`}
          icon={UserCheck}
          color="emerald"
        />
        <KpiCard
          title="On Approved Leave"
          value={onLeaveCount}
          subtitle="Active leave schedules"
          icon={Calendar}
          color="amber"
        />
        <KpiCard
          title="Est. Monthly Payroll"
          value={formatPKR(totalMonthlyGross)}
          subtitle="Gross sum (1.5x basic)"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* QUICK WORKSPACE ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab("checkin")}
          className="p-4 bg-[#0D121F] hover:bg-[#12192B] border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-start space-y-2 text-left transition group cursor-pointer shadow-sm"
        >
          <div className="p-2 bg-cyan-950/60 border border-cyan-800/60 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Punch Terminal</div>
            <div className="text-[11px] text-slate-400">Webcam & Geofence verify</div>
          </div>
        </button>

        <button
          onClick={onOpenLeaveModal}
          className="p-4 bg-[#0D121F] hover:bg-[#12192B] border border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col items-start space-y-2 text-left transition group cursor-pointer shadow-sm"
        >
          <div className="p-2 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Apply For Leave</div>
            <div className="text-[11px] text-slate-400">Casual, Sick & Annual quotas</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("employees")}
          className="p-4 bg-[#0D121F] hover:bg-[#12192B] border border-slate-800 hover:border-purple-500/50 rounded-xl flex flex-col items-start space-y-2 text-left transition group cursor-pointer shadow-sm"
        >
          <div className="p-2 bg-purple-950/60 border border-purple-800/60 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Employee Directory</div>
            <div className="text-[11px] text-slate-400">Browse corporate 360 profiles</div>
          </div>
        </button>

        <button
          onClick={onOpenAIChat}
          className="p-4 bg-[#0D121F] hover:bg-[#12192B] border border-slate-800 hover:border-amber-500/50 rounded-xl flex flex-col items-start space-y-2 text-left transition group cursor-pointer shadow-sm"
        >
          <div className="p-2 bg-amber-950/60 border border-amber-800/60 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Gemini Copilot</div>
            <div className="text-[11px] text-slate-400">Natural language HR assistant</div>
          </div>
        </button>
      </div>

      {/* RECENT ATTENDANCE FEED & ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Activity Feed */}
        <div className="lg:col-span-2 bg-[#0D121F] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Today's Real-time Punch Stream
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{formatDate(todayStr)}</span>
          </div>

          {attendance.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No punch records logged yet today. Use the Live Camera & GPS Punch to record first check-in!
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 overflow-hidden">
              {attendance.slice(0, 5).map((rec, i) => (
                <div key={rec.id || i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs font-mono">
                      {rec.empName ? rec.empName.charAt(0) : "E"}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{rec.empName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {rec.empId} • In: {rec.checkIn} • Out: {rec.checkOut || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {rec.locationVerified && (
                      <Badge variant="cyan" size="xs">
                        <MapPin className="w-2.5 h-2.5" /> GPS
                      </Badge>
                    )}
                    {rec.faceVerified && (
                      <Badge variant="emerald" size="xs">
                        <Camera className="w-2.5 h-2.5" /> Face
                      </Badge>
                    )}
                    <Badge variant={rec.status === "Present" ? "emerald" : "amber"} size="xs">
                      {rec.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Corporate Notice Board */}
        <div className="bg-[#0D121F] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Corporate Bulletins
                </h2>
              </div>
              <button
                onClick={() => setActiveTab("comms")}
                className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3 bg-[#090D16] border border-slate-800/80 rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 line-clamp-1">{ann.title}</span>
                    <Badge variant={ann.priority === "High" ? "rose" : "default"} size="xs">
                      {ann.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{ann.content}</p>
                  <div className="text-[10px] text-slate-500 font-mono">{ann.date} • {ann.author}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Org Rule Quick Widget */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="font-mono">Office Radius: {settings.radiusMeters}m</span>
            <span className="text-cyan-400 font-medium">GPS Geofence Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
