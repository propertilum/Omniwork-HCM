import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  getPublicDoc, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken,
  getDoc,
  setDoc
} from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children, onAddAudit }) {
  const [authUser, setAuthUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check for custom token if available
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        }
      } catch (err) {
        console.warn("Auth token initialization warning:", err);
      }
    };
    initAuth();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        try {
          const userDocRef = getPublicDoc('users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            const fallbackProfile = {
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || "Executive User",
              email: user.email || "admin@omniwork.io",
              role: "Admin",
              empId: `OW-${Math.floor(1000 + Math.random() * 9000)}`,
              dept: "Engineering",
              basicSalary: 280000,
              faceEnrolled: false,
              phone: "+92 300 1234567",
              cnic: "42101-9876543-1",
              bloodGroup: "O+",
              emergencyContact: "Farhan Ahmed (+92 321 9998877)",
              bankDetails: {
                bankName: "Standard Chartered Bank",
                accountTitle: "Executive Salary Account",
                iban: "PK36SCBL0000001122334455",
                swift: "SCBLPKKA"
              },
              education: [
                { degree: "BS Computer Science", institute: "FAST-NUCES", year: "2020" }
              ],
              skills: ["React", "Cloud Architecture", "HCM Systems", "Node.js"],
              assignedAssets: [
                { item: "MacBook Pro M3 Max 16\"", serial: "OW-MBP-9021" },
                { item: "Security Token YubiKey 5", serial: "OW-YK-1102" }
              ]
            };
            await setDoc(userDocRef, fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        } catch (e) {
          console.error("Firestore user profile fetch error:", e);
          // Fallback user profile in case of network restriction
          setUserProfile({
            uid: user.uid,
            name: user.email?.split('@')[0] || "Executive Admin",
            email: user.email,
            role: "Admin",
            empId: "OW-1001",
            dept: "Engineering",
            basicSalary: 280000,
            faceEnrolled: true,
            phone: "+92 300 1234567",
            cnic: "42101-9876543-1",
            bloodGroup: "O+",
            emergencyContact: "Emergency Desk (+92 321 9998877)",
            bankDetails: {
              bankName: "Standard Chartered Bank",
              accountTitle: "Executive Salary Account",
              iban: "PK36SCBL0000001122334455",
              swift: "SCBLPKKA"
            },
            skills: ["React", "Cloud Architecture", "HCM Systems"],
            assignedAssets: [
              { item: "MacBook Pro M3 Max 16\"", serial: "OW-MBP-9021" }
            ],
            education: [
              { degree: "BS Computer Science", institute: "FAST-NUCES", year: "2020" }
            ]
          });
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
      throw err;
    }
  };

  const signup = async (email, password, fullName, role) => {
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const newProf = {
        uid: cred.user.uid,
        name: fullName || email.split('@')[0],
        email: email,
        role: role || "Admin",
        empId: `OW-${Math.floor(1000 + Math.random() * 9000)}`,
        dept: "Engineering",
        basicSalary: 240000,
        faceEnrolled: false,
        phone: "+92 300 0000000",
        cnic: "42101-0000000-1",
        bloodGroup: "A+",
        emergencyContact: "Family Contact (+92 321 0000000)",
        bankDetails: {
          bankName: "Habib Bank Ltd",
          accountTitle: fullName,
          iban: "PK00HABB000012345678",
          swift: "HABBPKKA"
        },
        education: [
          { degree: "Undergraduate Degree", institute: "University", year: "2022" }
        ],
        skills: ["HCM Operations", "Management"],
        assignedAssets: [
          { item: "Workstation Pro Laptop", serial: "OW-WS-1010" }
        ]
      };

      try {
        await setDoc(getPublicDoc('users', cred.user.uid), newProf);
        await setDoc(getPublicDoc('employees', newProf.empId), {
          ...newProf,
          status: "Active",
          joinDate: new Date().toISOString().slice(0, 10),
        });
      } catch (err) {
        console.warn("Firestore sync warning on signup:", err);
      }
      setUserProfile(newProf);
      if (onAddAudit) {
        onAddAudit("SIGNUP", `User (${newProf.empId})`, `New user registered with role ${role}`);
      }
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (updated) => {
    setUserProfile(updated);
    if (authUser) {
      try {
        await setDoc(getPublicDoc('users', authUser.uid), updated, { merge: true });
        if (onAddAudit) {
          onAddAudit("UPDATE_PROFILE", `User (${updated.empId})`, "Saved personal self-service profile details");
        }
      } catch (e) {
        console.error("Failed to update profile to Firestore:", e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        userProfile,
        authLoading,
        authError,
        setAuthError,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
