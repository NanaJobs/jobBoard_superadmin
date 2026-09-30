import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle2,
  Trash2,
  Shield,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    const roleParam = role === "All" ? "" : role.toLowerCase();
    adminApi
      .getUsers({ q: search, role: roleParam })
      .then((res) => {
        if (res.data) setUsers(res.data);
        else if (res.results) setUsers(res.results);
        else if (Array.isArray(res)) setUsers(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const handleToggleSuspend = async (user: any) => {
    const action = user.is_suspended ? "activate" : "suspend";
    setActionLoading(user.id);
    try {
      await adminApi.suspendUser(user.id, action);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.email}? This action cannot be undone.`)) return;
    setActionLoading(user.id);
    try {
      await adminApi.deleteUser(user.id);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await adminApi.updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update role");
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
              User Management
            </h2>
            <p className="text-sm text-muted-foreground">
              View, moderate, and manage roles and access for all platform accounts.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            {users.length} Users Found
          </Badge>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="applicant">Job Seeker</SelectItem>
                  <SelectItem value="company">Employer</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">User</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
                  <TableHead className="w-12 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                      Loading live user directory...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      No users match your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => {
                    const initials = (u.first_name?.[0] || "U") + (u.last_name?.[0] || "");
                    const isSuspended = u.is_suspended;
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar src={u.avatar} name={u.first_name || u.username} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {u.first_name} {u.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize font-semibold">
                            {u.role === "super_admin" ? "Super Admin" : u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isSuspended ? (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-bold">
                              Suspended
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Recently"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                disabled={actionLoading === u.id}
                              >
                                {actionLoading === u.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => handleToggleSuspend(u)}>
                                {isSuspended ? (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                                    Activate Account
                                  </>
                                ) : (
                                  <>
                                    <Ban className="mr-2 h-4 w-4 text-amber-500" />
                                    Suspend Account
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleRoleChange(u.id, u.role === "company" ? "applicant" : "company")}>
                                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                Change to {u.role === "company" ? "Applicant" : "Company"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(u)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
