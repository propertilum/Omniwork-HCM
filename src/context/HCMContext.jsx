import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getPublicCol, 
  getPublicDoc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc 
} from "../config/firebase";
import { 
  DEFAULT_SETTINGS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ANNOUNCEMENTS 
} from "../config/constants";

const HCMContext = createContext(null);

export function HCMProvider({ children, userProfile }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState([]);

  // Check-In Active Session Timer State
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Firestore Real-time Subscriptions
  useEffect(() => {
    let unsubs = [];
    try {
      // 1. Settings
      const unsubSettings = onSnapshot(getPublicCol('settings'), (snap) => {
        if (!snap.empty) {
          const configDoc = snap.docs.find(d => d.id === 'config') || snap.docs[0];
          setSettings(prev => ({ ...prev, ...configDoc.data() }));
        }
      }, err => console.warn("Firestore settings listen warning:", err));
      unsubs.push(unsubSettings);

      // 2. Employees
      const unsubEmployees = onSnapshot(getPublicCol('employees'), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setEmployees(loaded);
        }
      }, err => console.warn("Firestore employees listen warning:", err));
      unsubs.push(unsubEmployees);

      // 3. Attendance
      const unsubAtt = onSnapshot(getPublicCol('attendance'), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setAttendance(loaded);
        }
      }, err => console.warn("Firestore attendance listen warning:", err));
      unsubs.push(unsubAtt);

      // 4. Leaves
      const unsubLeaves = onSnapshot(getPublicCol('leaves'), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setLeaves(loaded);
        }
      }, err => console.warn("Firestore leaves listen warning:", err));
      unsubs.push(unsubLeaves);

      // 5. Announcements
      const unsubAnn = onSnapshot(getPublicCol('announcements'), (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setAnnouncements(loaded);
        }
      }, err => console.warn("Firestore announcements listen warning:", err));
      unsubs.push(unsubAnn);

      // 6. Audit Logs
      const unsubAudit = onSnapshot(getPublicCol('audit_logs'), (snap) => {
        if (!snap.empty) {
          const logs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
          setAuditLogs(logs);
        }
      }, err => console.warn("Firestore audit_logs listen warning:", err));
      unsubs.push(unsubAudit);
    } catch (e) {
      console.warn("Real-time snapshot error:", e);
    }

    return () => {
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, []);

  // Timer Effect for active check-in
  useEffect(() => {
    let timer = null;
    if (isCheckedIn) {
      timer = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  // Audit Logger
  const addAudit = async (action, entity, details) => {
    const actor = userProfile ? `${userProfile.name} (${userProfile.role})` : "System Executive";
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newLog = {
      actor,
      action,
      entity,
      timestamp,
      details,
    };

    setAuditLogs(prev => [newLog, ...prev]);

    try {
      await addDoc(getPublicCol('audit_logs'), newLog);
    } catch (e) {
      console.warn("Audit log Firestore write warning:", e);
    }
  };

  // Register Employee
  const registerEmployee = async (newEmp) => {
    setEmployees(prev => [...prev.filter(e => e.id !== newEmp.id), newEmp]);
    try {
      await setDoc(getPublicDoc('employees', newEmp.id), newEmp);
    } catch (e) {
      console.warn("Register employee Firestore error:", e);
    }
    await addAudit("REGISTER_EMPLOYEE", `Employee ${newEmp.id}`, `Registered ${newEmp.name} with face biometrics`);
  };

  // Update Settings
  const saveSettings = async (newSet) => {
    setSettings(newSet);
    try {
      await setDoc(getPublicDoc('settings', 'config'), newSet);
    } catch (e) {
      console.warn("Save settings Firestore error:", e);
    }
    await addAudit("UPDATE_SETTINGS", "Org Rules", "Updated geofence & attendance rules");
  };

  // Apply Leave
  const applyLeave = async (newLeave) => {
    setLeaves(prev => [newLeave, ...prev]);
    try {
      await setDoc(getPublicDoc('leaves', newLeave.id), newLeave);
    } catch (e) {
      console.warn("Apply leave Firestore error:", e);
    }
    await addAudit("APPLY_LEAVE", `Leave ${newLeave.id}`, `Applied for ${newLeave.days} days ${newLeave.leaveType}`);
  };

  // Review Leave
  const updateLeaveStatus = async (leaveId, status, reviewNotes = "") => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status, reviewNotes } : l));
    try {
      await updateDoc(getPublicDoc('leaves', leaveId), { status, reviewNotes });
    } catch (e) {
      console.warn("Update leave Firestore error:", e);
    }
    await addAudit("REVIEW_LEAVE", `Leave ${leaveId}`, `Marked status as ${status}`);
  };

  // Check In
  const handleCheckIn = async (faceOk, locOk) => {
    if (!userProfile) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().slice(0, 10);
    let status = "Present";
    if (timeStr > settings.officeStart) status = "Late";

    const recordId = `${userProfile.empId}_${dateStr}`;
    const newRec = {
      id: recordId,
      empId: userProfile.empId,
      empName: userProfile.name,
      date: dateStr,
      checkIn: timeStr,
      checkOut: "-",
      status,
      hours: 0,
      locationVerified: locOk,
      faceVerified: faceOk,
    };

    setAttendance(prev => [newRec, ...prev.filter(r => r.id !== recordId)]);
    setIsCheckedIn(true);
    setElapsedSeconds(0);

    try {
      await setDoc(getPublicDoc('attendance', recordId), newRec);
    } catch (e) {
      console.warn("Check-in Firestore write error:", e);
    }

    await addAudit("CHECK_IN", `Attendance (${userProfile.empId})`, `Checked in via Webcam & GPS at ${timeStr} (Status: ${status})`);
  };

  // Check Out
  const handleCheckOut = async () => {
    if (!userProfile) return;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const dateStr = now.toISOString().slice(0, 10);
    const hours = parseFloat((elapsedSeconds / 3600).toFixed(1)) || 8.0;
    const recordId = `${userProfile.empId}_${dateStr}`;

    setAttendance(prev => prev.map(r => r.id === recordId ? { ...r, checkOut: timeStr, hours } : r));
    setIsCheckedIn(false);

    try {
      await updateDoc(getPublicDoc('attendance', recordId), {
        checkOut: timeStr,
        hours
      });
    } catch (e) {
      console.warn("Check-out Firestore write error:", e);
    }

    await addAudit("CHECK_OUT", `Attendance (${userProfile.empId})`, `Checked out at ${timeStr} with ${hours}h worked`);
  };

  // Announcements
  const postAnnouncement = async (newAnn) => {
    setAnnouncements(prev => [newAnn, ...prev]);
    try {
      await setDoc(getPublicDoc('announcements', newAnn.id), newAnn);
    } catch (e) {
      console.warn("Announcement Firestore write error:", e);
    }
    await addAudit("NEW_ANNOUNCEMENT", `Broadcast (${newAnn.id})`, `Published "${newAnn.title}"`);
  };

  return (
    <HCMContext.Provider
      value={{
        settings,
        employees,
        attendance,
        leaves,
        announcements,
        auditLogs,
        isCheckedIn,
        elapsedSeconds,
        addAudit,
        registerEmployee,
        saveSettings,
        applyLeave,
        updateLeaveStatus,
        handleCheckIn,
        handleCheckOut,
        postAnnouncement,
      }}
    >
      {children}
    </HCMContext.Provider>
  );
}

export function useHCM() {
  const context = useContext(HCMContext);
  if (!context) throw new Error("useHCM must be used within an HCMProvider");
  return context;
}
