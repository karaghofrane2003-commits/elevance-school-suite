import { useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  LayoutDashboard,
  Users,
  Users2,
  UserSquare2,
  School,
  Megaphone,
  CalendarDays,
  UserX,
  MessageSquare,
  BarChart3,
  History,
  Settings,
  Search,
  Plus,
  MessageCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type NavItem = { label: string; icon: typeof LayoutDashboard; badge?: string; active?: boolean };

const navMain: NavItem[] = [
  { label: "Tableau de bord", icon: LayoutDashboard, active: true },
  { label: "Élèves", icon: GraduationCap, badge: "842" },
  { label: "Parents", icon: Users2 },
  { label: "Professeurs", icon: UserSquare2 },
  { label: "Classes", icon: School },
  { label: "Annonces", icon: Megaphone, badge: "3" },
  { label: "Calendrier", icon: CalendarDays },
  { label: "Absences", icon: UserX, badge: "12" },
  { label: "Messages", icon: MessageSquare, badge: "5" },
];

const navSecondary: NavItem[] = [
  { label: "Rapports & Export", icon: BarChart3 },
  { label: "Historique", icon: History },
  { label: "Paramètres", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar - desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col border-r border-border bg-sidebar transition-[width] duration-300",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-sidebar border-r border-border flex flex-col animate-slide-in-right">
            <SidebarContent collapsed={false} onToggle={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]",
        )}
      >
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 h-[68px] px-4 border-b border-sidebar-border shrink-0",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.674_0.176_250)] text-primary-foreground shadow-[0_6px_20px_-6px_rgb(37_99_235_/_0.6)]">
          <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold tracking-tight truncate">Scolaris</div>
            <div className="text-[11px] text-muted-foreground font-medium truncate">
              École Sainte-Marie
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            aria-label="Réduire la barre latérale"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <NavGroup label="Espace de travail" collapsed={collapsed} items={navMain} />
        <NavGroup label="Outils" collapsed={collapsed} items={navSecondary} />
      </nav>

      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-3 mb-3 grid h-9 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          aria-label="Déployer la barre latérale"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}

      {/* Profile */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent transition-colors cursor-pointer",
            collapsed && "justify-center",
          )}
        >
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[oklch(0.674_0.176_250)] text-primary-foreground text-xs font-semibold">
              MD
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">Marie Dubois</div>
                <div className="text-[11px] text-muted-foreground truncate">Directrice</div>
              </div>
              <button
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function NavGroup({
  label,
  items,
  collapsed,
}: {
  label: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
          {label}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <button
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  item.active
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                )}
                <Icon className={cn("h-[18px] w-[18px] shrink-0", item.active && "text-primary")} strokeWidth={item.active ? 2.4 : 2} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                          item.active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 h-[68px] border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Ouvrir le menu"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Espace de travail</span>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">Tableau de bord</span>
        </div>

        {/* Search */}
        <div className="ml-auto md:ml-6 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un élève, une classe..."
              className="pl-9 pr-16 h-10 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-border rounded-xl"
            />
            <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Year selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-accent transition-colors text-sm font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              2025 — 2026
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Année scolaire</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>2025 — 2026 (actuelle)</DropdownMenuItem>
            <DropdownMenuItem>2024 — 2025</DropdownMenuItem>
            <DropdownMenuItem>2023 — 2024</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="hidden md:block h-6" />

        {/* Quick action */}
        <Button
          size="sm"
          className="hidden sm:inline-flex h-10 rounded-xl gap-1.5 shadow-[0_4px_14px_-4px_rgb(37_99_235_/_0.4)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nouveau
        </Button>

        <IconAction badge="5">
          <MessageCircle className="h-[18px] w-[18px]" />
        </IconAction>
        <IconAction badge="3" pulse>
          <Bell className="h-[18px] w-[18px]" />
        </IconAction>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-primary to-[oklch(0.674_0.176_250)] text-primary-foreground text-xs font-semibold">
                  MD
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-semibold">Marie Dubois</div>
              <div className="text-xs text-muted-foreground font-normal">
                marie.dubois@scolaris.fr
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mon profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Aide & support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function IconAction({
  children,
  badge,
  pulse,
}: {
  children: ReactNode;
  badge?: string;
  pulse?: boolean;
}) {
  return (
    <button className="relative grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
      {children}
      {badge && (
        <>
          {pulse && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-ping opacity-60" />
          )}
          <Badge
            variant="destructive"
            className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[9px] font-bold rounded-full grid place-items-center"
          >
            {badge}
          </Badge>
        </>
      )}
    </button>
  );
}

export { Sparkles };
