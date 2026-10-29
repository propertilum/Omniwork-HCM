import React, { useState } from 'react';
import {
  Calendar, Plus, CheckCircle, XCircle, Clock, Check, X,
  Filter, AlertTriangle, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { LEAVE_TYPES } from '../../config/constants';
import { formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function LeavesView({ onOpenApplyModal }) {
  const { userProfile } = useAuth();
  const { leaves, updateLeaveStatus } = useHCM();
  const [filterStatus, setFilterStatus] = useState("All");

  const isHRorAdmin = userProfile?.role === "Admin" || userProfile?.role === "HR";

  // Filter leaves
  const displayedLeaves = leaves.filter(l => {
    // If regular employee, only show their leaves unless viewing as HR/Admin
    if (!isHRorAdmin && l.empId !== userProfile?.empId) return false;
    if (filterStatus !== "All" && l.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* HEADER */}
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Module 5 • Leave Entitlements & Absence Control</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Leave Management Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            {isHRorAdmin ? "Executive review inbox for employee absence requests & entitlement quotas." : "Self-service absence filing and quota tracker."}
          </p>
        </div>

        <button
          onClick={onOpenApplyModal}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply For Leave</span>
        </button>
      </div>

      {/* LEAVE QUOTA CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {LEAVE_TYPES.map(type => (
          <div key={type.id} className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {type.label}
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {type.quota === 99 ? "Flexible" : `${type.quota} Days`}
            </div>
            <div className="text-[10px] text-slate-500">Per fiscal year allocation</div>
          </div>
        ))}
      </div>

      {/* FILTER BUTTONS */}
      <div className="bg-[#0D121F] border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {["All", "Pending", "Approved", "Rejected"].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                filterStatus === st
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          Showing {displayedLeaves.length} record(s)
        </span>
      </div>

      {/* LEAVES TABLE */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {displayedLeaves.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No leave requests found for the selected view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-[#090D16] text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Applicant Employee</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Date Window</th>
                  <th className="px-5 py-3">Reason / Justification</th>
                  <th className="px-5 py-3">Status</th>
                  {isHRorAdmin && <th className="px-5 py-3 text-right">Approval Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {displayedLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-3 font-semibold text-white">
                      <div>{l.empName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{l.empId}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-cyan-400">{l.leaveType}</span>
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold">
                      {l.days} {l.days === 1 ? "day" : "days"}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400">
                      {formatDate(l.startDate)} → {formatDate(l.endDate)}
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-slate-400" title={l.reason}>
                      {l.reason}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={
                          l.status === "Approved" ? "emerald" :
                          l.status === "Rejected" ? "rose" : "amber"
                        }
                        size="xs"
                      >
                        {l.status}
                      </Badge>
                    </td>

                    {isHRorAdmin && (
                      <td className="px-5 py-3 text-right">
                        {l.status === "Pending" ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => updateLeaveStatus(l.id, "Approved", "Approved by Executive HR")}
                              className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 rounded flex items-center space-x-1 cursor-pointer transition text-[11px]"
                              title="Approve leave"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(l.id, "Rejected", "Denied due to scheduling")}
                              className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-700/60 rounded flex items-center space-x-1 cursor-pointer transition text-[11px]"
                              title="Reject leave"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
