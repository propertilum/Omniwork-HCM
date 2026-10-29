import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, trend, color = "cyan" }) {
  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40",
    emerald: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    amber: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    purple: "text-purple-400 bg-purple-950/40 border-purple-800/40",
  };

  const badgeClass = colorMap[color] || colorMap.cyan;

  return (
    <div className="bg-[#0D121F] border border-slate-800/90 hover:border-slate-700/80 p-5 rounded-xl transition duration-150 shadow-md hover:shadow-cyan-950/10 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${badgeClass}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-white font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="text-emerald-400 font-semibold">{trend}</span>}
        </div>
      </div>
    </div>
  );
}
