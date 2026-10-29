export const DEFAULT_SETTINGS = {
  name: "OmniWork Global Systems Inc.",
  officeStart: "09:00",
  graceMinutes: 15,
  halfDayHours: 5,
  weekendDays: ["Saturday", "Sunday"],
  lat: 24.8607,
  lng: 67.0011,
  radiusMeters: 150,
  latePenaltyRule: "3 Lates = 0.5 Day Salary Deduction",
};

export const INITIAL_DEPARTMENTS = [
  "Engineering",
  "Product & Design",
  "Human Resources",
  "Finance & Payroll",
  "Operations & IT",
  "Marketing & Growth"
];

export const LEAVE_TYPES = [
  { id: "Annual", label: "Annual Leave", quota: 14, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "Casual", label: "Casual Leave", quota: 10, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "Sick", label: "Medical / Sick Leave", quota: 8, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "Unpaid", label: "Unpaid Leave (Loss of Pay)", quota: 99, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" }
];

export const INITIAL_EMPLOYEES = [
  {
    id: "OW-1001",
    empId: "OW-1001",
    name: "Zaitoon Ashraf",
    email: "zaitoon.ashraf@omniwork.io",
    role: "Admin",
    dept: "Engineering",
    basicSalary: 320000,
    status: "Active",
    joinDate: "2023-01-15",
    phone: "+92 300 8765432",
    cnic: "42101-1234567-1",
    bloodGroup: "O+",
    emergencyContact: "Tariq Ashraf (+92 321 4455667)",
    faceEnrolled: true,
    skills: ["React", "Cloud Architecture", "HCM Systems", "Node.js", "Kubernetes"],
    assignedAssets: [
      { item: "MacBook Pro M3 Max 16\"", serial: "OW-MBP-9021" },
      { item: "Dell UltraSharp 32\" 4K", serial: "OW-MON-4412" },
      { item: "Security Token YubiKey 5", serial: "OW-YK-1102" }
    ],
    bankDetails: {
      bankName: "Standard Chartered Bank",
      accountTitle: "Zaitoon Ashraf",
      iban: "PK36SCBL0000001122334455",
      swift: "SCBLPKKA"
    },
    education: [
      { degree: "MS Computer Science", institute: "LUMS", year: "2022" },
      { degree: "BS Software Engineering", institute: "FAST-NUCES", year: "2019" }
    ]
  },
  {
    id: "OW-1002",
    empId: "OW-1002",
    name: "Ayesha Tariq",
    email: "ayesha.t@omniwork.io",
    role: "HR",
    dept: "Human Resources",
    basicSalary: 210000,
    status: "Active",
    joinDate: "2023-03-01",
    phone: "+92 312 9988776",
    cnic: "42201-9876543-2",
    bloodGroup: "A+",
    emergencyContact: "Rashid Minhas (+92 333 1122334)",
    faceEnrolled: true,
    skills: ["Talent Acquisition", "HR Operations", "Compensation & Benefits"],
    assignedAssets: [
      { item: "ThinkPad X1 Carbon Gen 11", serial: "OW-TP-5521" }
    ],
    bankDetails: {
      bankName: "Habib Bank Ltd (HBL)",
      accountTitle: "Ayesha Tariq",
      iban: "PK82HABB0000998877665544",
      swift: "HABBPKKA"
    },
    education: [
      { degree: "MBA Human Resource Management", institute: "IBA Karachi", year: "2021" }
    ]
  },
  {
    id: "OW-1003",
    empId: "OW-1003",
    name: "Bilal Mansoor",
    email: "bilal.m@omniwork.io",
    role: "Employee",
    dept: "Product & Design",
    basicSalary: 250000,
    status: "Active",
    joinDate: "2023-06-10",
    phone: "+92 345 5566778",
    cnic: "42301-4455667-3",
    bloodGroup: "B+",
    emergencyContact: "Sadia Mansoor (+92 301 7788990)",
    faceEnrolled: false,
    skills: ["Product Design", "Figma", "Design Systems", "User Research"],
    assignedAssets: [
      { item: "MacBook Air M2 15\"", serial: "OW-MBA-7711" }
    ],
    bankDetails: {
      bankName: "Meezan Bank Ltd",
      accountTitle: "Bilal Mansoor",
      iban: "PK44MEZN0000123498765432",
      swift: "MEZNPKKA"
    },
    education: [
      { degree: "Bachelors in Communication Design", institute: "Indus Valley School", year: "2020" }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ANN-1",
    title: "Quarterly Town Hall & System Upgrade v2.0",
    category: "Corporate",
    priority: "High",
    date: "Today, 10:00 AM",
    author: "Executive Leadership",
    content: "We are pleased to introduce the OmniWork Industrial HCM suite v2.0 featuring automated geofenced biometric check-in, real-time leaves synchronization, and integrated payroll calculations."
  },
  {
    id: "ANN-2",
    title: "Annual Performance Appraisal Cycle Launch",
    category: "HR Notice",
    priority: "Medium",
    date: "Yesterday",
    author: "HR Operations",
    content: "Self-assessment forms are now accessible through your Employee Portal. Please submit prior to the end of this fiscal cycle."
  }
];
