import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  TrendingUp,
  FileCheck,
  Building2,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { dashboardApi } from "@/lib/api";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = data?.user_metrics?.total_users || 0;
  const companyUsers = data?.user_metrics?.company_users || 0;
  const applicantUsers = data?.user_metrics?.applicant_users || 0;
  const activeJobs = data?.job_metrics?.active_jobs || 0;
  const totalApps = data?.application_metrics?.total_applications || 0;

  const userDistribution = [
    { name: "Candidates", value: applicantUsers },
    { name: "Employers", value: companyUsers },
  ];

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Deep Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive growth statistics, job fill rates, and candidate pipeline conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Total Platform Accounts</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{loading ? "..." : totalUsers}</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">↑ Active Ecosystem</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Live Job Postings</span>
              <Briefcase className="h-4 w-4 text-info" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{loading ? "..." : activeJobs}</p>
            <p className="text-xs text-blue-500 font-semibold mt-1">Published opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Job Applications</span>
              <FileCheck className="h-4 w-4 text-warning" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{loading ? "..." : totalApps}</p>
            <p className="text-xs text-amber-500 font-semibold mt-1">Candidates applied</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase">Active Companies</span>
              <Building2 className="h-4 w-4 text-success" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{loading ? "..." : companyUsers}</p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">Hiring organizations</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">User Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Platform Health Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm font-medium">Django REST API</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">Operational 🟢</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm font-medium">Database (PostgreSQL)</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">Healthy 🟢</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm font-medium">Media Storage</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">Active 🟢</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Verification Service</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">Enabled 🟢</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
