import React, { useState } from 'react';
import {
  Users, Search, Filter, Plus, Eye, UserCheck, ShieldCheck,
  Building, Mail, Phone, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHCM } from '../../context/HCMContext';
import { INITIAL_DEPARTMENTS } from '../../config/constants';
import { formatPKR } from '../../utils/formatters';
import Badge from '../common/Badge';

export default function EmployeeDirectoryView({ onSelectEmployee360, onOpenRegister }) {
  const { userProfile } = useAuth();
  const { employees } = useHCM();

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const isHRorAdmin = userProfile?.role === "Admin" || userProfile?.role === "HR";

  const filtered = employees.filter(emp => {
    const matchesSearch = 
      (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.empId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.dept || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.dept === deptFilter;
    const matchesRole = roleFilter === "All" || emp.role === roleFilter;
    return matchesSearch && matchesDept && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* DIRECTORY HEADER */}
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Module 3 • Human Capital Directory</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Employee Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Total {employees.length} enrolled corporate personnel across {INITIAL_DEPARTMENTS.length} active business units.
          </p>
        </div>

        {isHRorAdmin && (
          <button
            onClick={onOpenRegister}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Employee</span>
          </button>
        )}
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-[#0D121F] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center gap-3 shadow-md">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID (e.g. OW-1001), email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="All">All Departments</option>
            {INITIAL_DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#090D16] border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
      </div>

      {/* EMPLOYEE CARDS GRID */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121F] border border-slate-800 rounded-xl text-slate-500 text-xs">
          No employee records match the specified search or filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(emp => (
            <div
              key={emp.id || emp.empId}
              className="bg-[#0D121F] border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-4 shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-base font-mono overflow-hidden shrink-0">
                      {emp.avatarUrl ? (
                        <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                      ) : (
                        (emp.name || 'E').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">{emp.name}</h3>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{emp.empId}</div>
                    </div>
                  </div>

                  <Badge variant={emp.role === "Admin" ? "purple" : emp.role === "HR" ? "emerald" : "default"} size="xs">
                    {emp.role}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{emp.dept}</span>
                    </span>
                    <span className="font-mono text-slate-300">{formatPKR(emp.basicSalary)} /mo</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Biometrics:</span>
                    {emp.faceEnrolled ? (
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Enrolled
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono">Pending Scan</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectEmployee360(emp)}
                className="w-full mt-2 py-2 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-medium rounded-lg text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full 360° Profile</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
