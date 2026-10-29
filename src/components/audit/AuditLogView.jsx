import React, { useState } from 'react';
import { Shield, Search, Filter, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { useHCM } from '../../context/HCMContext';
import Badge from '../common/Badge';

export default function AuditLogView() {
  const { auditLogs } = useHCM();
  const [filterQuery, setFilterQuery] = useState("");

  const filteredLogs = auditLogs.filter(log =>
    (log.actor || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
    (log.action || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
    (log.entity || "").toLowerCase().includes(filterQuery.toLowerCase()) ||
    (log.details || "").toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* HEADER */}
      <div className="bg-[#0D121F] border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Module 9 • High-Assurance Security Audit Trail</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Immutable Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident system event register tracking administrative, biometric, and payroll actions.
          </p>
        </div>

        <Badge variant="cyan" size="md">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time Stream Active</span>
        </Badge>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-[#0D121F] border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action type, or entity..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#090D16] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {filteredLogs.length} Logged Events
        </span>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No audit logs match your query filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-800 font-mono">
              <thead className="bg-[#090D16] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Actor / Principal</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Entity</th>
                  <th className="px-4 py-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-800/20 transition">
                    <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-2.5 text-cyan-300 font-semibold whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-white border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                      {log.entity}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-[11px] font-sans">
                      {log.details}
                    </td>
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
