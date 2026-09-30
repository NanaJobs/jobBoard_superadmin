import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
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
  ShieldCheck,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function Verification() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getCompanies()
      .then((res) => {
        if (res.results) setCompanies(res.results);
        else if (Array.isArray(res)) setCompanies(res);
        else if (res.data) setCompanies(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Employer Verification Queue
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage employer trust badges and company validation records.
            </p>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-bold">
            Email Verification Enforced 🔒
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Company</TableHead>
                  <TableHead className="font-bold">Email Status</TableHead>
                  <TableHead className="font-bold">Trust Badge</TableHead>
                  <TableHead className="font-bold">Website</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading verification queue...
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                      No verification requests pending.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((c) => {
                    const initials = (c.company_name?.[0] || "C").toUpperCase();
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CompanyLogo src={c.logo} name={c.company_name || c.name} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{c.company_name || c.name || "Company"}</p>
                              <p className="text-xs text-muted-foreground">{c.tagline || "Employer"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                            Verified via Email
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-500 border-blue-500/30 font-bold">
                            Platform Verified
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.website ? (
                            <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Website
                            </a>
                          ) : "—"}
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
