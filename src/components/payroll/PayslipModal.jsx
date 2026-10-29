import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, Building } from 'lucide-react';
import { formatPKR, formatDate } from '../../utils/formatters';

export default function PayslipModal({ record, onClose, companyName = "OmniWork Global Systems Inc." }) {
  if (!record) return null;

  const { emp, basicSalary, houseRent, transport, medical, grossSalary, incomeTax, lateDeductions, unpaidDeductions, totalDeductions, netSalary, taxRatePercentage } = record;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-xs flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            Executive Electronic Payslip // M6
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center space-x-1 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PAYSLIP DOCUMENT PREVIEW */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#090D16] border-b border-slate-800 text-slate-300 font-sans">
          {/* Corporate Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
            <div>
              <div className="text-base font-bold text-white uppercase tracking-tight font-mono">
                {companyName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                INDUSTRIAL HCM SUITE // AUTOMATED PAYROLL SETTLEMENT
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-1">
                Ref: PS-2026-10-{emp?.empId}
              </div>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-mono font-bold uppercase">
                Direct Deposit Verified
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Disbursement: Oct 31, 2026
              </div>
            </div>
          </div>

          {/* Employee & Bank Info */}
          <div className="grid grid-cols-2 gap-4 bg-[#0D121F] p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Employee Name:</span>
              <span className="text-white font-bold">{emp?.name}</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">{emp?.empId} • {emp?.dept}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Direct Deposit Bank:</span>
              <span className="text-white font-bold">{emp?.bankDetails?.bankName || "Standard Chartered"}</span>
              <span className="text-slate-400 block text-[10px] truncate mt-0.5">{emp?.bankDetails?.iban || "PK00SCBL000000000000"}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* Earnings */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0D121F]">
              <div className="p-2.5 bg-slate-800/60 font-bold text-white border-b border-slate-800 text-[11px]">
                Earnings (Gross Allowances)
              </div>
              <div className="p-3 space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Basic Pay:</span>
                  <span className="text-white">{formatPKR(basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent (25%):</span>
                  <span>{formatPKR(houseRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conveyance (15%):</span>
                  <span>{formatPKR(transport)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical (10%):</span>
                  <span>{formatPKR(medical)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-cyan-400">
                  <span>Gross Earnings:</span>
                  <span>{formatPKR(grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0D121F]">
              <div className="p-2.5 bg-slate-800/60 font-bold text-white border-b border-slate-800 text-[11px]">
                Withholdings & Deductions
              </div>
              <div className="p-3 space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Income Tax ({taxRatePercentage}%):</span>
                  <span>{formatPKR(incomeTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Late Punch Penalties:</span>
                  <span>{formatPKR(lateDeductions)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unpaid Leave:</span>
                  <span>{formatPKR(unpaidDeductions)}</span>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-between font-bold text-rose-400">
                  <span>Total Deductions:</span>
                  <span>-{formatPKR(totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NET SALARY CALLOUT */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                Net Take-Home Salary Payable
              </span>
              <span className="text-slate-400 text-[11px]">Credit to employee verified IBAN account</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {formatPKR(netSalary)}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-[#0D121F] flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Confidential & Encrypted Payroll Ledger
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
