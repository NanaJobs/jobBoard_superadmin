import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Loader2,
} from "lucide-react";
import { reportsApi } from "@/lib/api";

export default function Security() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReports = () => {
    setLoading(true);
    reportsApi
      .getAdminReports()
      .then((res) => {
        if (res.results) setReports(res.results);
        else if (Array.isArray(res)) setReports(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string, action: string) => {
    setActionLoading(id);
    try {
      await reportsApi.resolveAdminReport(id, {
        status: "resolved",
        action_taken: action,
        admin_notes: `Resolved by Super Admin: ${action}`,
      });
      fetchReports();
    } catch (err: any) {
      alert(err.message || "Failed to resolve report");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Security & Moderation Console
        </h2>
        <p className="text-sm text-muted-foreground">
          Active audit trails, user complaints, flagged postings, and security operations.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Flagged Content & Incident Reports
            </CardTitle>
            <Badge variant="outline">{reports.length} Total Tickets</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                Loading security moderation tickets...
              </div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                No security incidents or flagged content reported. Platform is safe and healthy.
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-card"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{report.reason}</span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {report.target_type || "Content"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(report.id, "dismissed")}
                      disabled={actionLoading === report.id}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(report.id, "content_removed")}
                      disabled={actionLoading === report.id}
                      className="bg-destructive hover:bg-destructive/90 text-white"
                    >
                      Remove Content
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
