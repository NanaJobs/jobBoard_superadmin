import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { reportsApi, getMediaUrl } from "@/lib/api";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReports = () => {
    setLoading(true);
    const params = statusFilter === "all" ? {} : { status: statusFilter };
    reportsApi
      .getAdminReports(params)
      .then((res) => {
        if (res.results) setReports(res.results);
        else if (Array.isArray(res)) setReports(res);
        else if (res.data) setReports(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Content & Incident Reports
            </h2>
            <p className="text-sm text-muted-foreground">
              Review flagged jobs, spam accounts, and community violations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "resolved" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("resolved")}
            >
              Resolved
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="border-border/70 p-12 text-center text-xs text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
            Loading incident reports...
          </Card>
        ) : reports.length === 0 ? (
          <Card className="border-border/70 p-12 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">All Clear!</p>
            <p className="mt-1">No reports or moderation tickets found in this view.</p>
          </Card>
        ) : (
          reports.map((report) => {
            const isResolved = report.status === "resolved";
            return (
              <Card key={report.id} className="border-border/70 shadow-sm">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs font-bold">
                        {report.target_type || "Job"}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">{report.reason}</h4>
                      {isResolved ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] font-bold">
                          Resolved
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[11px] font-bold">
                          Pending Review
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>Reported by: <strong>{report.reporter?.email || "Anonymous user"}</strong></span>
                      <span>•</span>
                      <span>Date: {report.created_at ? new Date(report.created_at).toLocaleDateString() : "Recently"}</span>
                    </div>
                  </div>

                  {!isResolved && (
                    <div className="flex items-center gap-2 shrink-0">
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
                        Take Action
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
