/**
 * Format seconds to HH:MM:SS
 */
export function formatTimer(totalSeconds = 0) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format currency with PKR prefix
 */
export function formatPKR(num = 0) {
  return `PKR ${Number(num || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

/**
 * Format ISO date or date string
 */
export function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

/**
 * Enterprise Payroll Calculation Engine (Module 6)
 * - Basic Salary
 * - Allowances (Housing 25%, Transport 15%, Medical 10% = 50% extra -> Gross = 1.5x Basic)
 * - Late arrival deductions: every 3 lates = 0.5 day deduction
 * - Income Tax slabs (standard corporate bracket)
 */
export function calculateEmployeePayroll(basicSalary = 0, lateCount = 0, unpaidLeaveDays = 0) {
  const basic = Number(basicSalary) || 0;
  const houseRent = Math.round(basic * 0.25);
  const transport = Math.round(basic * 0.15);
  const medical = Math.round(basic * 0.10);
  const grossSalary = basic + houseRent + transport + medical; // 1.5x basic

  // Daily rate (based on 30 working days standard)
  const perDayRate = grossSalary / 30;

  // Late penalty (3 lates = 0.5 day deduction)
  const latePenaltiesDeductions = Math.floor(lateCount / 3) * (perDayRate * 0.5);

  // Unpaid leave deductions
  const unpaidLeaveDeductions = unpaidLeaveDays * perDayRate;

  // Income Tax calculation (Simplified standard slab for gross annualized)
  const annualGross = grossSalary * 12;
  let taxRate = 0.05;
  if (annualGross > 3600000) taxRate = 0.15;
  else if (annualGross > 2400000) taxRate = 0.10;
  else if (annualGross > 1200000) taxRate = 0.05;
  else taxRate = 0.02;

  const incomeTax = Math.round(grossSalary * taxRate);
  const totalDeductions = Math.round(incomeTax + latePenaltiesDeductions + unpaidLeaveDeductions);
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    basicSalary: basic,
    houseRent,
    transport,
    medical,
    grossSalary,
    incomeTax,
    lateDeductions: Math.round(latePenaltiesDeductions),
    unpaidDeductions: Math.round(unpaidLeaveDeductions),
    totalDeductions,
    netSalary,
    taxRatePercentage: (taxRate * 100).toFixed(0)
  };
}
