import React, { useState } from 'react';
import {
  DollarSign, FileText, Download, CheckCircle, AlertTriangle,
  Users, Building, Eye, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { calculateEmployeePayroll, formatPKR } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function PayrollView({ onSelectPayslip }) {
  const { userProfile } = useAuth();
  const { settings, employees, attendance, leaves } = useHCM();
  const [searchTerm, setSearchTerm] = useState("");

  // Payroll summary stats
  let totalGross = 0;
  let totalNet = 0;
  let totalTaxes = 0;

  const payrollData = employees.map(emp => {
    // Count lates from attendance
    const empLates = attendance.filter(a => a.empId === emp.empId && a.status === "Late").length;
    // Count unpaid leaves
    const empUnpaid = leaves.filter(l => l.empId === emp.empId && l.leaveType === "Unpaid" && l.status === "Approved")
      .reduce((sum, cur) => sum + (cur.days || 1), 0);

    const calc = calculateEmployeePayroll(emp.basicSalary, empLates, empUnpaid);
    totalGross += calc.grossSalary;
    totalNet += calc.netSalary;
    totalTaxes += calc.incomeTax;

    return {
      emp,
      ...calc,
      latesCount: empLates,
      unpaidDays: empUnpaid,
    };
  });

  const filteredPayroll = payrollData.filter(p =>
    (p.emp.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.emp.empId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.emp.dept || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* HEADER */}
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Module 6 • Automated Corporate Compensation</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Enterprise Payroll Lite Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard 1.5x gross multiplier (Basic + 50% Allowances) with tax deductions and late arrival penalties.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Current Pay Cycle</span>
          <span className="text-xs font-mono font-bold text-white">October 2026 Fiscal Cycle</span>
        </div>
      </div>

      {/* PAYROLL KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Gross Pay Commitment</div>
          <div className="text-xl font-mono font-bold text-white">{formatPKR(totalGross)}</div>
          <div className="text-[10px] text-slate-500">Includes 25% HRA, 15% Conveyance, 10% Medical</div>
        </div>

        <div className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-mono uppercase text-emerald-400">Net Disbursement Pool</div>
          <div className="text-xl font-mono font-bold text-emerald-400">{formatPKR(totalNet)}</div>
          <div className="text-[10px] text-slate-500">Net direct bank wire total</div>
        </div>

        <div className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] font-mono uppercase text-purple-400">Total Statutory Tax Withheld</div>
          <div className="text-xl font-mono font-bold text-purple-300">{formatPKR(totalTaxes)}</div>
          <div className="text-[10px] text-slate-500">Calculated on corporate income brackets</div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-[#0D121F] border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#090D16] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {filteredPayroll.length} Active Records
        </span>
      </div>

      {/* PAYROLL SUMMARY TABLE */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-800">
            <thead className="bg-[#090D16] text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3 font-mono">Basic Pay</th>
                <th className="px-5 py-3 font-mono">Gross (1.5x)</th>
                <th className="px-5 py-3 font-mono">Deductions</th>
                <th className="px-5 py-3 font-mono">Net Salary</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPayroll.map(p => (
                <tr key={p.emp.id || p.emp.empId} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-3 font-semibold text-white">
                    <div>{p.emp.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{p.emp.empId}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{p.emp.dept}</td>
                  <td className="px-5 py-3 font-mono">{formatPKR(p.basicSalary)}</td>
                  <td className="px-5 py-3 font-mono font-semibold text-white">
                    {formatPKR(p.grossSalary)}
                  </td>
                  <td className="px-5 py-3 font-mono text-rose-400">
                    -{formatPKR(p.totalDeductions)}
                    {p.latesCount > 0 && (
                      <span className="text-[10px] text-amber-400 block">({p.latesCount} lates penalty)</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-emerald-400">
                    {formatPKR(p.netSalary)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onSelectPayslip({ ...p, companyName: settings.name })}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded text-xs transition cursor-pointer inline-flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Payslip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
