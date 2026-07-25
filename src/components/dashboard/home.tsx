import {
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
  Users2,
  UserSquare2,
  School,
  UserX,
  Megaphone,
  MessageSquare,
  TrendingUp,
  Plus,
  UserPlus,
  CalendarPlus,
  Download,
  FileText,
  MoreHorizontal,
  Paperclip,
  Check,
  X as XIcon,
  ArrowRight,
  Circle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ---------- Data ---------- */

const stats = [
  {
    label: "Élèves inscrits",
    value: "842",
    delta: "+3,2%",
    positive: true,
    icon: GraduationCap,
    accent: "primary",
    data: [8, 12, 10, 14, 18, 22, 26, 24, 28, 32, 30, 36],
  },
  {
    label: "Parents actifs",
    value: "1 264",
    delta: "+5,8%",
    positive: true,
    icon: Users2,
    accent: "primary",
    data: [22, 24, 20, 26, 28, 30, 34, 32, 36, 38, 40, 44],
  },
  {
    label: "Professeurs",
    value: "62",
    delta: "+1,6%",
    positive: true,
    icon: UserSquare2,
    accent: "primary",
    data: [12, 12, 13, 13, 14, 14, 14, 15, 15, 16, 16, 16],
  },
  {
    label: "Classes ouvertes",
    value: "34",
    delta: "0%",
    positive: true,
    icon: School,
    accent: "primary",
    data: [10, 10, 12, 12, 12, 14, 14, 14, 14, 14, 14, 14],
  },
  {
    label: "Absences aujourd'hui",
    value: "12",
    delta: "-8,3%",
    positive: true,
    icon: UserX,
    accent: "danger",
    data: [22, 18, 24, 20, 18, 16, 14, 15, 12, 14, 10, 12],
  },
  {
    label: "Annonces publiées",
    value: "18",
    delta: "+12%",
    positive: true,
    icon: Megaphone,
    accent: "warning",
    data: [4, 6, 5, 8, 10, 9, 12, 14, 12, 15, 16, 18],
  },
  {
    label: "Messages en attente",
    value: "5",
    delta: "-2",
    positive: true,
    icon: MessageSquare,
    accent: "primary",
    data: [8, 7, 9, 6, 8, 7, 6, 5, 7, 6, 5, 5],
  },
  {
    label: "Taux de présence",
    value: "96,4 %",
    delta: "+0,8%",
    positive: true,
    icon: TrendingUp,
    accent: "success",
    data: [92, 93, 94, 94, 95, 95, 95, 96, 96, 96, 96, 96],
  },
] as const;

const attendanceData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû"][i],
  presence: [94, 95, 93, 92, 95, 96, 96, 97, 96, 95, 94, 93][i],
  absence: [6, 5, 7, 8, 5, 4, 4, 3, 4, 5, 6, 7][i],
}));

const classData = [
  { name: "CP", students: 68 },
  { name: "CE1", students: 74 },
  { name: "CE2", students: 82 },
  { name: "CM1", students: 91 },
  { name: "CM2", students: 88 },
  { name: "6e", students: 96 },
  { name: "5e", students: 92 },
  { name: "4e", students: 87 },
  { name: "3e", students: 84 },
];

const activityData = [
  { name: "Lundi", parents: 320, professeurs: 45 },
  { name: "Mardi", parents: 410, professeurs: 52 },
  { name: "Mercredi", parents: 280, professeurs: 38 },
  { name: "Jeudi", parents: 460, professeurs: 58 },
  { name: "Vendredi", parents: 520, professeurs: 61 },
  { name: "Samedi", parents: 180, professeurs: 22 },
  { name: "Dimanche", parents: 120, professeurs: 14 },
];

const audienceData = [
  { name: "Parents", value: 1264, color: "oklch(0.564 0.213 261)" },
  { name: "Élèves", value: 842, color: "oklch(0.674 0.176 250)" },
  { name: "Professeurs", value: 62, color: "oklch(0.77 0.13 245)" },
];

const activityFeed = [
  {
    icon: UserPlus,
    color: "primary",
    title: "Nouvelle inscription",
    text: "Lina Martin — inscrite en classe de CE2",
    time: "il y a 4 min",
  },
  {
    icon: Megaphone,
    color: "warning",
    title: "Annonce publiée",
    text: "Réunion parents-professeurs le 12 novembre",
    time: "il y a 32 min",
  },
  {
    icon: UserX,
    color: "danger",
    title: "Absence signalée",
    text: "M. Bernard — Mathématiques (CM1)",
    time: "il y a 1 h",
  },
  {
    icon: MessageSquare,
    color: "primary",
    title: "Nouveau message",
    text: "Mme Petit a répondu à votre message",
    time: "il y a 2 h",
  },
  {
    icon: FileText,
    color: "success",
    title: "Bulletin validé",
    text: "Trimestre 1 — Classe de 4e A",
    time: "il y a 4 h",
  },
];

const announcements = [
  {
    title: "Réunion parents-professeurs",
    audience: "Parents CE1 → CM2",
    date: "12 nov. 2025",
    priority: "Haute" as const,
    attachment: true,
  },
  {
    title: "Sortie pédagogique au Louvre",
    audience: "Classes de 5e",
    date: "18 nov. 2025",
    priority: "Normale" as const,
    attachment: true,
  },
  {
    title: "Fermeture exceptionnelle vendredi",
    audience: "Tout l'établissement",
    date: "22 nov. 2025",
    priority: "Urgente" as const,
    attachment: false,
  },
  {
    title: "Résultats du conseil de classe",
    audience: "Parents 3e",
    date: "24 nov. 2025",
    priority: "Normale" as const,
    attachment: true,
  },
];

const absenceRequests = [
  {
    name: "Sophie Laurent",
    role: "Prof. de Français",
    dates: "5 → 7 nov.",
    reason: "Congé maladie",
    initials: "SL",
  },
  {
    name: "Julien Moreau",
    role: "Prof. d'Histoire",
    dates: "12 nov.",
    reason: "Formation",
    initials: "JM",
  },
  {
    name: "Camille Roche",
    role: "Prof. d'Anglais",
    dates: "18 → 19 nov.",
    reason: "Personnel",
    initials: "CR",
  },
];

const quickActions = [
  { label: "Ajouter un élève", icon: GraduationCap, color: "primary" },
  { label: "Ajouter un parent", icon: Users2, color: "primary" },
  { label: "Ajouter un professeur", icon: UserSquare2, color: "primary" },
  { label: "Créer une annonce", icon: Megaphone, color: "warning" },
  { label: "Créer une classe", icon: School, color: "primary" },
  { label: "Programmer un événement", icon: CalendarPlus, color: "primary" },
  { label: "Exporter les données", icon: Download, color: "success" },
];

/* ---------- Root ---------- */

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 lg:space-y-8">
      <PageHeader />

      <section
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Indicateurs clés"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card-elegant p-6">
          <ChartHeader
            title="Taux de présence mensuel"
            subtitle="Évolution de la présence sur l'année scolaire"
            right={
              <div className="flex items-center gap-4 text-xs">
                <LegendDot color="oklch(0.564 0.213 261)" label="Présence" />
                <LegendDot color="oklch(0.7 0.153 163)" label="Objectif" />
              </div>
            }
          />
          <div className="h-[280px] mt-4">
            <ResponsiveContainer>
              <AreaChart data={attendanceData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-presence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.564 0.213 261)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.564 0.213 261)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(0.923 0.013 250)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 12 }}
                  domain={[80, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<ChartTooltip suffix="%" />} />
                <Area
                  type="monotone"
                  dataKey="presence"
                  stroke="oklch(0.564 0.213 261)"
                  strokeWidth={2.5}
                  fill="url(#grad-presence)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elegant p-6">
          <ChartHeader
            title="Répartition de la communauté"
            subtitle="Élèves, parents, professeurs"
          />
          <div className="h-[220px] mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={audienceData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {audienceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {audienceData.map((a) => {
              const total = audienceData.reduce((s, i) => s + i.value, 0);
              const pct = ((a.value / total) * 100).toFixed(1);
              return (
                <div key={a.name} className="flex items-center gap-3 text-sm">
                  <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                  <span className="flex-1 text-muted-foreground">{a.name}</span>
                  <span className="font-semibold">{a.value.toLocaleString("fr-FR")}</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card-elegant p-6">
          <ChartHeader title="Élèves par classe" subtitle="Répartition actuelle" />
          <div className="h-[240px] mt-4">
            <ResponsiveContainer>
              <BarChart data={classData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="oklch(0.923 0.013 250)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "oklch(0.968 0.011 247)" }} />
                <Bar dataKey="students" fill="oklch(0.564 0.213 261)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elegant p-6 lg:col-span-2">
          <ChartHeader
            title="Activité de la communauté"
            subtitle="Connexions parents et professeurs cette semaine"
            right={
              <div className="flex items-center gap-4 text-xs">
                <LegendDot color="oklch(0.564 0.213 261)" label="Parents" />
                <LegendDot color="oklch(0.7 0.153 163)" label="Professeurs" />
              </div>
            }
          />
          <div className="h-[240px] mt-4">
            <ResponsiveContainer>
              <LineChart data={activityData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="oklch(0.923 0.013 250)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "oklch(0.556 0.033 257)", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="parents"
                  stroke="oklch(0.564 0.213 261)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "oklch(0.564 0.213 261)", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="professeurs"
                  stroke="oklch(0.7 0.153 163)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "oklch(0.7 0.153 163)", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ActivityFeed />
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <AbsenceRequests />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnnouncementsTable />
        </div>
        <MiniCalendar />
      </section>
    </div>
  );
}

/* ---------- Page header ---------- */

function PageHeader() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-3">
          <Sparkles className="h-3 w-3 text-primary" />
          Vue d'ensemble en temps réel
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-[-0.02em] text-foreground">
          Bonjour Marie, bienvenue <span className="inline-block">👋</span>
        </h1>
        <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground max-w-2xl">
          Voici un aperçu de votre établissement aujourd'hui —{" "}
          <span className="text-foreground font-medium">mardi 4 novembre 2025</span>.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" className="h-10 rounded-xl gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter</span>
        </Button>
        <Button className="h-10 rounded-xl gap-1.5 shadow-[0_4px_14px_-4px_rgb(37_99_235_/_0.4)]">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Créer
        </Button>
      </div>
    </div>
  );
}

/* ---------- Stat card ---------- */

function StatCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  accent,
  data,
}: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: LucideIcon;
  accent: string;
  data: readonly number[];
}) {
  const accentColor =
    accent === "danger"
      ? "oklch(0.637 0.213 25)"
      : accent === "warning"
        ? "oklch(0.771 0.16 70)"
        : accent === "success"
          ? "oklch(0.7 0.153 163)"
          : "oklch(0.564 0.213 261)";

  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className="card-elegant card-hover p-5 group">
      <div className="flex items-start justify-between">
        <div
          className="grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:scale-105"
          style={{
            background: `color-mix(in oklab, ${accentColor} 10%, transparent)`,
            color: accentColor,
          }}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            positive ? "text-success" : "text-danger",
          )}
          style={{
            background: positive
              ? "color-mix(in oklab, oklch(0.7 0.153 163) 12%, transparent)"
              : "color-mix(in oklab, oklch(0.637 0.213 25) 12%, transparent)",
          }}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[26px] font-bold tracking-[-0.02em] leading-none">{value}</div>
          <div className="mt-2 text-[13px] text-muted-foreground truncate">{label}</div>
        </div>
        <div className="h-10 w-20 shrink-0 opacity-90">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.8}
                fill={`url(#spark-${label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------- Chart helpers ---------- */

function ChartHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold tracking-tight truncate">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; payload?: { name?: string } }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-elevated text-xs">
      <div className="font-semibold text-foreground mb-1">
        {label ?? payload[0].payload?.name}
      </div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name} :</span>
          <span className="font-semibold text-foreground">
            {p.value.toLocaleString("fr-FR")}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Activity feed ---------- */

function ActivityFeed() {
  const colors: Record<string, string> = {
    primary: "oklch(0.564 0.213 261)",
    warning: "oklch(0.771 0.16 70)",
    danger: "oklch(0.637 0.213 25)",
    success: "oklch(0.7 0.153 163)",
  };
  return (
    <div className="card-elegant p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Activité récente</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Les derniers événements</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
          Tout voir <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <ol className="relative space-y-5">
        <span className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
        {activityFeed.map((a) => {
          const Icon = a.icon;
          const c = colors[a.color];
          return (
            <li key={a.title} className="relative flex gap-3">
              <div
                className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card"
                style={{ color: c }}
              >
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold truncate">{a.title}</div>
                </div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{a.text}</div>
                <div className="text-[11px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {a.time}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Quick actions ---------- */

function QuickActions() {
  const colors: Record<string, string> = {
    primary: "oklch(0.564 0.213 261)",
    warning: "oklch(0.771 0.16 70)",
    success: "oklch(0.7 0.153 163)",
  };
  return (
    <div className="card-elegant p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Actions rapides</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Les tâches quotidiennes, en un clic
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          const c = colors[a.color];
          return (
            <button
              key={a.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/30 hover:shadow-elevated transition-all"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:scale-105"
                style={{
                  background: `color-mix(in oklab, ${c} 12%, transparent)`,
                  color: c,
                }}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <div className="mt-3 text-[13px] font-semibold leading-tight">{a.label}</div>
              <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Absence requests ---------- */

function AbsenceRequests() {
  return (
    <div className="card-elegant p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">
            Demandes d'absence en attente
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {absenceRequests.length} professeurs en attente de validation
          </p>
        </div>
        <Badge className="bg-warning/10 text-warning hover:bg-warning/10 border-0 font-semibold">
          {absenceRequests.length} en attente
        </Badge>
      </div>
      <div className="space-y-2">
        {absenceRequests.map((r) => (
          <div
            key={r.name}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors"
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/5 text-primary text-xs font-semibold">
                {r.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold truncate">{r.name}</div>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="text-xs text-muted-foreground truncate">{r.role}</div>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-foreground/70 font-medium">{r.dates}</span>
                <span>•</span>
                <span>{r.reason}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                className="hidden sm:inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-medium hover:bg-muted transition-colors"
                title="Assigner un remplaçant"
              >
                Remplacer
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg text-danger hover:bg-danger/10 transition-colors"
                aria-label="Rejeter"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg bg-success text-white hover:opacity-90 transition-opacity"
                aria-label="Approuver"
              >
                <Check className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Announcements table ---------- */

function AnnouncementsTable() {
  const priorityStyles: Record<string, string> = {
    Urgente: "bg-danger/10 text-danger",
    Haute: "bg-warning/10 text-warning",
    Normale: "bg-primary/10 text-primary",
  };
  return (
    <div className="card-elegant overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-6 pb-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight">Annonces récentes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Publications et communications</p>
        </div>
        <Button size="sm" variant="outline" className="h-9 rounded-xl gap-1.5 shrink-0">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nouvelle annonce</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-y border-border bg-muted/30">
              <th className="px-6 py-2.5 font-semibold">Titre</th>
              <th className="px-6 py-2.5 font-semibold">Audience</th>
              <th className="px-6 py-2.5 font-semibold">Publication</th>
              <th className="px-6 py-2.5 font-semibold">Priorité</th>
              <th className="px-6 py-2.5 font-semibold w-8" />
            </tr>
          </thead>
          <tbody>
            {announcements.map((a, i) => (
              <tr
                key={a.title}
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  i !== announcements.length - 1 && "border-b border-border",
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{a.title}</span>
                    {a.attachment && (
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{a.audience}</td>
                <td className="px-6 py-4 text-muted-foreground">{a.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                      priorityStyles[a.priority],
                    )}
                  >
                    <Circle className="h-1.5 w-1.5 fill-current" strokeWidth={0} />
                    {a.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Mini calendar ---------- */

function MiniCalendar() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  // November 2025 starts on Saturday (day 6). Use offset 5 for Monday-start grid.
  const firstOffset = 5;
  const daysInMonth = 30;
  const today = 4;
  const events: Record<number, { label: string; color: string }> = {
    5: { label: "Réunion", color: "primary" },
    12: { label: "Conseil", color: "warning" },
    18: { label: "Sortie 5e", color: "primary" },
    22: { label: "Fermé", color: "danger" },
    28: { label: "Vacances", color: "success" },
  };
  const colors: Record<string, string> = {
    primary: "oklch(0.564 0.213 261)",
    warning: "oklch(0.771 0.16 70)",
    danger: "oklch(0.637 0.213 25)",
    success: "oklch(0.7 0.153 163)",
  };
  const cells: (number | null)[] = [
    ...Array(firstOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="card-elegant p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Novembre 2025</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Événements à venir</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {days.map((d, i) => (
          <div
            key={i}
            className="text-[10px] font-semibold uppercase text-muted-foreground/70 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const evt = events[day];
          const isToday = day === today;
          return (
            <button
              key={idx}
              className={cn(
                "relative aspect-square rounded-lg text-xs font-medium grid place-items-center transition-colors",
                isToday
                  ? "bg-primary text-primary-foreground font-bold"
                  : "hover:bg-muted text-foreground",
              )}
            >
              {day}
              {evt && !isToday && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                  style={{ background: colors[evt.color] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-5 border-t border-border space-y-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          À venir
        </div>
        {Object.entries(events)
          .slice(0, 3)
          .map(([day, evt]) => (
            <div key={day} className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-bold leading-none flex-col">
                <span className="text-[9px] text-muted-foreground font-medium">NOV</span>
                <span>{day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{evt.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {day === "5"
                    ? "Réunion pédagogique équipe"
                    : day === "12"
                      ? "Conseil de classe — 4e A"
                      : "Sortie au Louvre — 5e"}
                </div>
              </div>
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: colors[evt.color] }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
