import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  Building2,
  FileText,
  BarChart3,
  Settings,
  ShieldAlert,
  Mail,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const navGroups = [
  {
    items: [{ label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Manage",
    items: [
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
      { label: "Categories", to: "/admin/categories", icon: FolderKanban },
      { label: "Companies", to: "/admin/companies", icon: Building2 },
      { label: "Applications", to: "/admin/applications", icon: FileText },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", to: "/admin/reports", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/admin/settings", icon: Settings },
      { label: "Security", to: "/admin/security", icon: ShieldAlert },
      { label: "Email Templates", to: "/admin/emails", icon: Mail },
    ],
  },
];

function isActive(pathname: string, to: string) {
  if (to === "/admin/dashboard") {
    return pathname === "/" || pathname === "/admin/dashboard";
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-white">Nana jobs</p>
          <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {group.title && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(pathname, item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/jobs": "Jobs",
  "/admin/categories": "Categories",
  "/admin/companies": "Companies",
  "/admin/applications": "Applications",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
  "/admin/security": "Security",
  "/admin/audit-log": "Audit Log",
  "/admin/emails": "Email Templates",
  "/admin/verification": "Verification Queue",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title =
    pageTitles[pathname] ??
    (pathname.startsWith("/admin/users/")
      ? "User Detail"
      : pathname.startsWith("/admin/jobs/")
        ? "Job Detail"
        : pathname.startsWith("/admin/companies/")
          ? "Company Detail"
          : "Admin");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : "Super Admin";
  const userInitials = user ? (user.first_name?.[0] || 'S') + (user.last_name?.[0] || 'A') : "SA";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent pathname={pathname} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-6 text-sidebar-foreground/70"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:bg-card/80 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="hidden text-lg font-semibold text-foreground sm:block">
            {title}
          </h1>

          <div className="relative ml-2 hidden max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, jobs, companies..."
              className="pl-9"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-colors hover:bg-muted">
                <UserAvatar src={(user as any)?.avatar} name={displayName} size="sm" className="h-7 w-7" />
                <span className="hidden text-sm font-medium sm:inline">
                  {displayName}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">Account settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/security">Security</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Badge
            variant="outline"
            className="mb-4 border-border font-normal text-muted-foreground sm:hidden"
          >
            {title}
          </Badge>
          {children}
        </main>
      </div>
    </div>
  );
}
