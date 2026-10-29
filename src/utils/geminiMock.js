/**
 * AI Assistant (Gemini) Natural Language & Policy Processor
 * Simulates intelligent NLP reasoning & HR copilot interactions
 */

export function parseSmartLeaveRequest(prompt) {
  const text = prompt.toLowerCase();
  let leaveType = "Casual";
  let days = 1;
  let reason = prompt;

  if (text.includes("sick") || text.includes("fever") || text.includes("doctor") || text.includes("hospital") || text.includes("medical")) {
    leaveType = "Sick";
  } else if (text.includes("vacation") || text.includes("annual") || text.includes("trip") || text.includes("travel")) {
    leaveType = "Annual";
  } else if (text.includes("urgent") || text.includes("personal") || text.includes("family")) {
    leaveType = "Casual";
  }

  // Extract number of days if specified
  const matchDays = text.match(/(\d+)\s*(day|days)/);
  if (matchDays && matchDays[1]) {
    days = parseInt(matchDays[1], 10);
  } else if (text.includes("tomorrow")) {
    days = 1;
  } else if (text.includes("week")) {
    days = 5;
  }

  // Start date calculation
  const today = new Date();
  let startDate = today.toISOString().slice(0, 10);
  if (text.includes("tomorrow")) {
    const tmrw = new Date(today);
    tmrw.setDate(tmrw.getDate() + 1);
    startDate = tmrw.toISOString().slice(0, 10);
  }

  const endD = new Date(startDate);
  endD.setDate(endD.getDate() + (days - 1));
  const endDate = endD.toISOString().slice(0, 10);

  return {
    leaveType,
    startDate,
    endDate,
    days,
    reason: prompt.trim()
  };
}

export function generateCopilotResponse(query, context = {}) {
  const q = query.toLowerCase();
  const { userProfile, settings } = context;

  if (q.includes("leave") && (q.includes("apply") || q.includes("need") || q.includes("sick") || q.includes("off") || q.includes("vacation"))) {
    const parsed = parseSmartLeaveRequest(query);
    return {
      text: `I've analyzed your leave request for **${parsed.days} day(s)** (${parsed.leaveType} Leave) starting **${parsed.startDate}** to **${parsed.endDate}**.\n\nClick the button below to review and submit your formal leave application.`,
      smartLeave: parsed
    };
  }

  if (q.includes("policy") || q.includes("late") || q.includes("grace") || q.includes("office hours")) {
    return {
      text: `### 📋 Official OmniWork Office Policy\n\n- **Shift Start:** ${settings?.officeStart || "09:00"} with a **${settings?.graceMinutes || 15}-minute grace window**.\n- **Late Penalty:** ${settings?.latePenaltyRule || "3 Lates = 0.5 Day Salary Deduction"}.\n- **Half Day Hours:** Minimum ${settings?.halfDayHours || 5} hours recorded.\n- **Geofence Check-in:** Required within ${settings?.radiusMeters || 150}m of office coordinates.`
    };
  }

  if (q.includes("salary") || q.includes("payroll") || q.includes("pay") || q.includes("allowance")) {
    return {
      text: `### 💼 Payroll Structure & Allowances\n\n- **Gross Salary Calculation:** Basic Salary + 50% Allowances (Housing 25%, Transport 15%, Medical 10%).\n- **Current Role:** ${userProfile?.role || "Employee"} in ${userProfile?.dept || "Department"}.\n- **Disbursement:** End of each month with automated PDF pay slips.`
    };
  }

  if (q.includes("quota") || q.includes("balance") || q.includes("how many leaves")) {
    return {
      text: `### 🌴 Standard Annual Leave Entitlement\n\n- **Annual Leave:** 14 Days / Year\n- **Casual Leave:** 10 Days / Year\n- **Sick / Medical Leave:** 8 Days / Year\n- **Unpaid Leave:** Subject to supervisor approval.`
    };
  }

  return {
    text: `Hello ${userProfile?.name || "there"}! I'm your OmniWork Gemini HR Copilot.\n\nYou can ask me to:\n- Apply for leave (e.g. *"I need 2 days sick leave starting tomorrow"*)\n- Review office policies, grace times, & late penalties\n- Check payroll rules & allowance breakdown\n- Verify leave quotas and attendance rules.`
  };
}
