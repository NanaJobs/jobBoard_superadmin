import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, History } from "lucide-react";

export default function AuditLog() {
  const [logs] = useState([
    { id: "1", action: "Super Admin Sign-in", user: "admin@jobboard.com", ip: "127.0.0.1", status: "Success", timestamp: "Just now" },
    { id: "2", action: "Job Posting Featured (⭐)", user: "admin@jobboard.com", ip: "127.0.0.1", status: "Success", timestamp: "5 mins ago" },
    { id: "3", action: "Category Created: Cybersecurity", user: "admin@jobboard.com", ip: "127.0.0.1", status: "Success", timestamp: "15 mins ago" },
    { id: "4", action: "Candidate Profile Verified", user: "system@nanajobs.com", ip: "Server", status: "Automated", timestamp: "1 hour ago" },
  ]);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Administrative Audit Log
            </h2>
            <p className="text-sm text-muted-foreground">
              Immutable record of administrative operations, security audits, and moderation actions.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            Audit Trail Active 🛡️
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Action</TableHead>
                  <TableHead className="font-bold">Operator</TableHead>
                  <TableHead className="font-bold">IP / Origin</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      {log.action}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.user}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{log.ip}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
