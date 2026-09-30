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
  Building2,
  MapPin,
  Globe,
  Loader2,
} from "lucide-react";
import { adminApi, getMediaUrl } from "@/lib/api";

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCompanies = () => {
    setLoading(true);
    adminApi
      .getCompanies({ q: search })
      .then((res) => {
        if (res.results) setCompanies(res.results);
        else if (Array.isArray(res)) setCompanies(res);
        else if (res.data) setCompanies(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Companies Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage employer profiles, brand presence, and job listings.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {companies.length} Registered
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search company by name, location..."
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
                  <TableHead className="font-bold">Company</TableHead>
                  <TableHead className="font-bold">Headquarters</TableHead>
                  <TableHead className="font-bold">Website</TableHead>
                  <TableHead className="font-bold">Active Postings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading companies...
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      No companies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((c) => {
                    const initials = (c.company_name?.[0] || c.name?.[0] || "C").toUpperCase();
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CompanyLogo src={c.logo} name={c.company_name || c.name} size="md" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {c.company_name || c.name || "Company"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">{c.tagline || "Employer"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {c.headquarters || c.location || "Remote"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.website ? (
                            <a
                              href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold">
                            {c.active_jobs_count || c.job_count || 0} Jobs
                          </Badge>
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
