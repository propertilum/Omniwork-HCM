import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { LEAVE_TYPES } from '../../config/constants';

export default function ApplyLeaveModal({ onClose, prefilled = null }) {
  const { userProfile } = useAuth();
  const { applyLeave } = useHCM();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [leaveType, setLeaveType] = useState("Casual");
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply prefilled data if passed from Gemini AI
  useEffect(() => {
    if (prefilled) {
      if (prefilled.leaveType) setLeaveType(prefilled.leaveType);
      if (prefilled.startDate) setStartDate(prefilled.startDate);
      if (prefilled.endDate) setEndDate(prefilled.endDate);
      if (prefilled.days) setDays(prefilled.days);
      if (prefilled.reason) setReason(prefilled.reason);
    }
  }, [prefilled]);

  // Recalculate days when dates change
  useEffect(() => {
    try {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(Math.max(1, isNaN(diffDays) ? 1 : diffDays));
    } catch {
      setDays(1);
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newLeave = {
      id: `LV-${Math.floor(10000 + Math.random() * 90000)}`,
      empId: userProfile?.empId || "OW-1001",
      empName: userProfile?.name || "Corporate User",
      leaveType,
      startDate,
      endDate,
      days,
      reason: reason || "Personal engagement",
      status: "Pending",
      appliedAt: new Date().toISOString(),
    };

    await applyLeave(newLeave);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-xs">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono">Formal Leave Application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {prefilled && (
          <div className="px-5 py-2.5 bg-cyan-950/40 border-b border-cyan-800/40 text-[11px] text-cyan-300 flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI Copilot auto-parsed and configured this leave request.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 text-slate-400 font-medium">Leave Category *</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
            >
              {LEAVE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label} ({t.quota === 99 ? 'Flexible' : `${t.quota}d quota`})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-400 font-medium">Start Date *</label>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-400 font-medium">End Date *</label>
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#090D16] border border-slate-800/80 rounded-lg flex items-center justify-between font-mono">
            <span className="text-slate-400">Total Working Days:</span>
            <span className="text-cyan-400 font-bold text-sm">{days} day(s)</span>
          </div>

          <div>
            <label className="block mb-1 text-slate-400 font-medium">Reason & Justification *</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the purpose for absence (e.g. personal, medical appointment, vacation)..."
              className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500 font-sans resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
