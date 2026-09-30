export interface StatCard {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  sub?: string;
}

export const platformStats: StatCard[] = [
  { label: "Total Users", value: "6,912", change: "12%", changeType: "up", sub: "this month" },
  { label: "Companies", value: "1,234", change: "8%", changeType: "up", sub: "this month" },
  { label: "Applicants", value: "5,678", change: "6%", changeType: "up", sub: "this month" },
  { label: "Active Jobs", value: "892", change: "5%", changeType: "up", sub: "this week" },
  { label: "Total Applications", value: "2,456", change: "18%", changeType: "up", sub: "this month" },
  { label: "Pending Actions", value: "23", changeType: "down", sub: "need review" },
];

export const userGrowthData = [
  { month: "Jan", users: 820 },
  { month: "Feb", users: 1180 },
  { month: "Mar", users: 1640 },
  { month: "Apr", users: 2210 },
  { month: "May", users: 2890 },
  { month: "Jun", users: 3560 },
  { month: "Jul", users: 4420 },
  { month: "Aug", users: 5610 },
  { month: "Sep", users: 6912 },
];

export const categoryDistribution = [
  { name: "Technology", value: 45 },
  { name: "Finance", value: 30 },
  { name: "Healthcare", value: 22 },
  { name: "Education", value: 15 },
  { name: "Retail", value: 12 },
];

export const pendingActions = [
  { id: 1, label: "2 jobs flagged", detail: "Review needed", type: "warning" as const },
  { id: 2, label: "5 companies pending verification", detail: "Awaiting documents", type: "info" as const },
  { id: 3, label: "Daily report ready", detail: "Sep 24 summary", type: "default" as const },
];

export const todayStats = {
  newUsers: 45,
  newJobs: 12,
};

export type UserRole = "Company" | "Applicant";
export type UserStatus = "Active" | "Suspended" | "Pending";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  lastActive: string;
  jobsPosted?: number;
  applications?: number;
}

const firstNames = [
  "Ava", "Liam", "Noah", "Emma", "Olivia", "Mason", "Sophia", "Ethan",
  "Isabella", "Lucas", "Mia", "Amara", "Kenji", "Priya", "Diego", "Fatima",
  "Hana", "Miguel", "Zara", "Samuel",
];
const lastNames = [
  "Carter", "Nguyen", "Patel", "Rossi", "Johansson", "Kim", "Silva", "Okoye",
  "Fischer", "Adeyemi", "Tanaka", "Novak", "Reyes", "Haddad", "Larsen",
];
const companies = [
  "Northwind Labs", "BrightPath Health", "Vertex Finance", "PixelForge Studio",
  "GreenLeaf Retail", "Skyline Logistics", "Atlas Education", "Nova Robotics",
];

function seededUser(i: number): AdminUser {
  const isCompany = i % 3 === 0;
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  const status: UserStatus =
    i % 11 === 0 ? "Suspended" : i % 7 === 0 ? "Pending" : "Active";
  return {
    id: `usr_${1000 + i}`,
    name: isCompany ? companies[i % companies.length] : `${first} ${last}`,
    email: isCompany
      ? `hr@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, "")}.com`
      : `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    role: isCompany ? "Company" : "Applicant",
    status,
    joined: `2025-${String((i % 9) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    lastActive: i % 2 === 0 ? "2 hours ago" : "3 days ago",
    jobsPosted: isCompany ? (i % 14) + 1 : undefined,
    applications: !isCompany ? (i % 22) + 1 : undefined,
  };
}

export const adminUsers: AdminUser[] = Array.from({ length: 42 }, (_, i) =>
  seededUser(i + 1),
);
