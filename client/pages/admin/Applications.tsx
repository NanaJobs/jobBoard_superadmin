import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  FileText,
  Building2,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { adminApi, getMediaUrl } from "@/lib/api";

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchApplications = () => {
    setLoading(true);
    const params = statusFilter === "all" ? {} : { status: statusFilter };
    adminApi
      .getApplications(params)
      .then((res) => {
        if (res.results) setApplications(res.results);
        else if (Array.isArray(res)) setApplications(res);
        else if (res.data) setApplications(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const filtered = applications.filter((app) => {
    const candidateName = `${app.applicant?.first_name || ''} ${app.applicant?.last_name || ''}`.toLowerCase();
    const candidateEmail = (app.applicant?.email || '').toLowerCase();
    const jobTitle = (app.job?.title || '').toLowerCase();
    const q = search.toLowerCase();
    return candidateName.includes(q) || candidateEmail.includes(q) || jobTitle.includes(q);
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Candidate Applications Pipeline
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse and review all job applications submitted across the platform.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {applications.length} Applications
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidate name or job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Candidate</TableHead>
                  <TableHead className="font-bold">Target Job & Company</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Applied Date</TableHead>
                  <TableHead className="w-20 text-right">Resume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading candidate applications...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      No applications found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app) => {
                    const applicant = app.applicant || {};
                    const job = app.job || {};
                    const initials = ((applicant.first_name?.[0] || 'A') + (applicant.last_name?.[0] || '')).toUpperCase();
                    const resumeUrl = app.resume_file || applicant.resume;
                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar src={applicant.avatar || (applicant as any).profile?.avatar || app.applicant_avatar} name={applicant.first_name || applicant.email} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {applicant.first_name} {applicant.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{applicant.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{job.title || "Job Posting"}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {job.company_name || job.company?.email || "Direct Employer"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize font-semibold">
                            {app.status?.replace("_", " ") || "applied"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Recently"}
                        </TableCell>
                        <TableCell className="text-right">
                          {resumeUrl ? (
                            <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs text-primary hover:text-primary">
                              <a href={getMediaUrl(resumeUrl)} target="_blank" rel="noreferrer">
                                <FileText className="h-3.5 w-3.5" />
                                Resume
                              </a>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
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
