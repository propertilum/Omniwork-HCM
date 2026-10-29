import React from 'react';

export default function Badge({ children, variant = "default", size = "sm" }) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
    emerald: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    amber: "bg-amber-950/60 text-amber-300 border-amber-800/60",
    rose: "bg-rose-950/60 text-rose-300 border-rose-800/60",
    purple: "bg-purple-950/60 text-purple-300 border-purple-800/60",
  };

  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2.5 py-0.5",
    md: "text-xs px-3 py-1 font-semibold",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded font-mono border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm}`}>
      {children}
    </span>
  );
}
