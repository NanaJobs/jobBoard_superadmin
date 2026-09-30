import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "@/components/CompanyLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Star,
  Trash2,
  Building2,
  MapPin,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    adminApi
      .getJobs({ q: search })
      .then((res) => {
        if (res.results) setJobs(res.results);
        else if (Array.isArray(res)) setJobs(res);
        else if (res.data) setJobs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const handleToggleFeature = async (job: any) => {
    setActionLoading(job.id);
    try {
      await adminApi.toggleFeatureJob(job.id);
      fetchJobs();
    } catch (err: any) {
      alert(err.message || "Failed to toggle featured status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (job: any) => {
    if (!window.confirm(`Are you sure you want to permanently delete the job "${job.title}"?`)) return;
    setActionLoading(job.id);
    try {
      await adminApi.deleteJob(job.id);
      fetchJobs();
    } catch (err: any) {
      alert(err.message || "Failed to delete job");
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
              Job Postings Moderation
            </h2>
            <p className="text-sm text-muted-foreground">
              Review, feature, promote, and moderate all platform job postings.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {jobs.length} Postings
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Job Title & Company</TableHead>
                  <TableHead className="font-bold">Location & Type</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Featured</TableHead>
                  <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading live job listings...
                    </TableCell>
                  </TableRow>
                ) : jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      No job postings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => {
                    const isFeatured = job.is_featured;
                    const companyName = job.company_name || job.company?.name || job.company?.email || "Direct Employer";
                    return (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CompanyLogo src={job.company?.logo || job.company_logo} name={companyName} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{job.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Building2 className="h-3 w-3" />
                                {companyName}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {job.location || "Remote"}
                            </span>
                            <span className="capitalize mt-0.5 block">{job.job_type?.replace("_", " ") || "Full-time"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {job.status || "published"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeature(job)}
                            disabled={actionLoading === job.id}
                            className={`h-7 px-2.5 rounded-lg text-xs font-semibold gap-1 ${
                              isFeatured
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Star className={`h-3.5 w-3.5 ${isFeatured ? "fill-amber-500" : ""}`} />
                            {isFeatured ? "Featured" : "Normal"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteJob(job)}
                            disabled={actionLoading === job.id}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
