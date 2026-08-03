import { useMemo, useState } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Download,
  Users2,
  UserCheck,
  UserPlus,
  UserX,
  Wallet,
  Percent,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,

} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Gender = "F" | "M";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  gender: Gender;
  birthDate: string;
  className: string;
  level: string;
  enrolledAt: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  attendance: number;
  average: number;
  feesPaid: boolean;
  absentToday: boolean;
  schoolYear: string;
  notes: string;
};

const classes = [
  "CP A",
  "CE1 A",
  "CM2 B",
  "6ème A",
  "6ème B",
  "5ème A",
  "4ème B",
  "3ème A",
  "2nde C",
  "1ère S",
  "Terminale S",
];
const levels = ["Primaire", "Collège", "Lycée"];
const schoolYears = ["2025-2026", "2024-2025", "2023-2024"];
const currentSchoolYear = schoolYears[0];

const seed: Student[] = [
  ["Amina", "Bensalem", "6ème A", "Collège", 0.97, 15.8, true, "F"],
  ["Lucas", "Moreau", "5ème A", "Collège", 0.91, 13.2, true, "M"],
  ["Inès", "Charef", "CM2 B", "Primaire", 0.74, 10.4, false, "F"],
  ["Noah", "Petit", "2nde C", "Lycée", 0.95, 14.6, true, "M"],
  ["Sofia", "Ricci", "1ère S", "Lycée", 0.88, 16.9, false, "F"],
  ["Youssef", "Haddad", "Terminale S", "Lycée", 0.99, 17.4, true, "M"],
  ["Camille", "Durand", "CP A", "Primaire", 0.83, 12.1, true, "F"],
  ["Adam", "Lefèvre", "6ème B", "Collège", 0.93, 14.0, false, "M"],
  ["Léa", "Fontaine", "CE1 A", "Primaire", 0.96, 15.1, true, "F"],
  ["Rayan", "Ziani", "CM1 A", "Primaire", 0.89, 12.8, false, "M"],
  ["Chloé", "Marchand", "5ème B", "Collège", 0.92, 16.2, true, "F"],
  ["Ismaël", "Traoré", "4ème A", "Collège", 0.78, 11.6, false, "M"],
  ["Manon", "Girard", "3ème A", "Collège", 0.94, 14.9, true, "F"],
  ["Elias", "Nadir", "2nde C", "Lycée", 0.85, 13.4, true, "M"],
  ["Jade", "Rousseau", "1ère S", "Lycée", 0.9, 15.5, false, "F"],
  ["Mehdi", "Ouali", "Terminale S", "Lycée", 0.98, 17.9, true, "M"],
  ["Nina", "Perrot", "CP A", "Primaire", 0.87, 13.0, true, "F"],
  ["Gabriel", "Faure", "CE1 A", "Primaire", 0.91, 14.2, false, "M"],
  ["Sarah", "Belhadj", "6ème B", "Collège", 0.95, 16.4, true, "F"],
  ["Tom", "Leroy", "4ème A", "Collège", 0.8, 12.3, false, "M"],
  ["Yasmine", "Kaci", "3ème A", "Collège", 0.93, 15.7, true, "F"],
  ["Hugo", "Barbier", "2nde C", "Lycée", 0.76, 10.9, false, "M"],
  ["Lina", "Amrani", "1ère S", "Lycée", 0.97, 18.1, true, "F"],
  ["Nathan", "Colin", "Terminale S", "Lycée", 0.88, 13.8, true, "M"],
  ["Éva", "Mercier", "CM2 B", "Primaire", 0.92, 14.5, false, "F"],
  ["Samir", "Boukhari", "CM1 A", "Primaire", 0.94, 15.3, true, "M"],
].map((row, i) => {
  const [firstName, lastName, className, level, attendance, average, feesPaid, gender] = row as [
    string,
    string,
    string,
    string,
    number,
    number,
    boolean,
    Gender,
  ];
  return {
    id: `s${i + 1}`,
    firstName,
    lastName,
    matricule: `ELV-2026-${String(i + 1).padStart(3, "0")}`,
    gender,
    birthDate: `20${10 + (i % 5)}-0${(i % 9) + 1}-1${i % 9}`,
    className,
    level,
    enrolledAt: `${schoolYears[i % 7 === 3 ? 1 : i % 11 === 5 ? 2 : 0].slice(0, 4)}-09-01`,
    schoolYear: schoolYears[i % 7 === 3 ? 1 : i % 11 === 5 ? 2 : 0],
    guardianName: `M./Mme ${lastName}`,
    guardianPhone: `+33 6 12 34 5${i} ${10 + i}`,
    guardianEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}@famille.fr`,
    address: `${10 + i} rue des Écoles, Paris`,
    attendance,
    average,
    feesPaid,
    absentToday: i % 4 === 2,
    notes: "",
  } satisfies Student;
});

const emptyForm: Omit<Student, "id"> = {
  firstName: "",
  lastName: "",
  matricule: "",
  gender: "F",
  birthDate: "",
  className: classes[0],
  level: levels[0],
  enrolledAt: new Date().toISOString().slice(0, 10),
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  address: "",
  attendance: 1,
  average: 0,
  feesPaid: false,
  absentToday: false,
  schoolYear: currentSchoolYear,
  notes: "",
};

const initials = (s: Student) => `${s.firstName[0] ?? ""}${s.lastName[0] ?? ""}`.toUpperCase();
const fullName = (s: Student) => `${s.firstName} ${s.lastName}`;

export function StudentsPage() {
  const [items, setItems] = useState<Student[]>(seed);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>(currentSchoolYear);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "average" | "attendance">("name");
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(emptyForm);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Student | null>(null);
  const [toDelete, setToDelete] = useState<Student | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const att = total ? items.reduce((a, s) => a + s.attendance, 0) / total : 0;
    const avg = total ? items.reduce((a, s) => a + s.average, 0) / total : 0;
    const newcomers = items.filter((s) => s.schoolYear === currentSchoolYear).length;
    const absentToday = items.filter((s) => s.absentToday).length;
    const pendingFees = items.filter((s) => !s.feesPaid).length;
    return { total, att, avg, newcomers, absentToday, pendingFees };
  }, [items]);

  const filtered = useMemo(() => {
    const list = items.filter((s) => {
      if (classFilter !== "all" && s.className !== classFilter) return false;
      if (levelFilter !== "all" && s.level !== levelFilter) return false;
      if (yearFilter !== "all" && s.schoolYear !== yearFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !fullName(s).toLowerCase().includes(q) &&
          !s.matricule.toLowerCase().includes(q) &&
          !s.guardianName.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "average") return b.average - a.average;
      if (sortBy === "attendance") return b.attendance - a.attendance;
      return fullName(a).localeCompare(fullName(b));
    });
  }, [items, classFilter, levelFilter, yearFilter, query, sortBy]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function resetFilters() {
    setYearFilter(currentSchoolYear);
    setLevelFilter("all");
    setClassFilter("all");
    setSortBy("name");
    setQuery("");
    setPage(1);
  }


  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, matricule: `ELV-2026-${String(items.length + 1).padStart(3, "0")}` });
    setOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    const { id: _id, ...rest } = s;
    setForm(rest);
    setOpen(true);
  }

  function save() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Le nom et le prénom sont obligatoires.");
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((s) => (s.id === editing.id ? { ...form, id: editing.id } : s)));
      toast.success("Fiche élève mise à jour.");
    } else {
      setItems((prev) => [{ ...form, id: crypto.randomUUID() }, ...prev]);
      toast.success("Élève inscrit.");
    }
    setOpen(false);
  }

  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((s) => s.id !== toDelete.id));
    toast.success("Élève supprimé.");
    setToDelete(null);
  }

  function exportCsv() {
    const header = ["Matricule", "Nom", "Classe", "Cycle", "Assiduité", "Moyenne", "Scolarité"];
    const rows = filtered.map((s) => [
      s.matricule,
      fullName(s),
      s.className,
      s.level,
      `${Math.round(s.attendance * 100)}%`,
      s.average.toFixed(1),
      s.feesPaid ? "Payée" : "En attente",
    ]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "eleves.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV généré.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" /> Scolarité
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">Élèves</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dossiers complets : identité, classe, responsables, assiduité et résultats.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Exporter
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Inscrire un élève
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users2} label="Total élèves" value={String(stats.total)} />
        <StatCard icon={UserPlus} label="Nouveaux inscrits" value={String(stats.newcomers)} />
        <StatCard icon={UserX} label="Absents aujourd'hui" value={String(stats.absentToday)} />
        <StatCard icon={Wallet} label="Paiements en attente" value={String(stats.pendingFees)} />
        <StatCard
          icon={Percent}
          label="Assiduité moyenne"
          value={`${Math.round(stats.att * 100)}%`}
        />
        <StatCard icon={UserCheck} label="Moyenne générale" value={`${stats.avg.toFixed(1)}/20`} />
      </div>

      {/* Filters */}
      <div className="card-elegant p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={yearFilter}
            onValueChange={(v) => {
              setYearFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[170px] text-xs">
              <SelectValue placeholder="Année scolaire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {schoolYears.map((y) => (
                <SelectItem key={y} value={y}>
                  Année {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={levelFilter}
            onValueChange={(v) => {
              setLevelFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue placeholder="Cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les cycles</SelectItem>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={classFilter}
            onValueChange={(v) => {
              setClassFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] text-xs">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="Trier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Trier : nom</SelectItem>
              <SelectItem value="average">Trier : moyenne</SelectItem>
              <SelectItem value="attendance">Trier : assiduité</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-9 gap-2 px-3 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
          </Button>

          <div className="relative ml-auto w-full sm:w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Nom, matricule, responsable…"
              className="h-9 pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              aria-label="Vue liste"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={cn(
                "grid h-7 w-8 place-items-center rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Vue grille"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              className={cn(
                "grid h-7 w-8 place-items-center rounded-lg transition-colors",
                viewMode === "grid"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>


      {/* Table */}
      <div className="card-elegant overflow-hidden">
        {viewMode === "list" ? (
        <div className="overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[240px] text-[11px] uppercase tracking-[0.08em]">Élève</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Classe</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Responsable</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Assiduité</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Moyenne</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Scolarité</TableHead>
                
                <TableHead className="w-[130px] text-right text-[11px] uppercase tracking-[0.08em]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((s) => (
                <TableRow key={s.id} className="group">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                          {initials(s)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-tight">{fullName(s)}</div>
                        <div className="text-[11px] text-muted-foreground">{s.matricule}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{s.className}</div>
                    <div className="text-[11px] text-muted-foreground">{s.level}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{s.guardianName}</div>
                    <div className="text-[11px] text-muted-foreground">{s.guardianPhone}</div>
                  </TableCell>
                  <TableCell className="text-xs font-medium tabular-nums">
                    {Math.round(s.attendance * 100)}%
                  </TableCell>
                  <TableCell className="text-xs font-medium tabular-nums">
                    {s.average.toFixed(1)}/20
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                        s.feesPaid
                          ? "border-border bg-muted/60 text-muted-foreground"
                          : "border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-[var(--warning)]",
                      )}
                    >
                      {s.feesPaid ? "Payée" : "En attente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <IconBtn label={`Voir ${fullName(s)}`} onClick={() => setDetail(s)}>
                        <Eye className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label={`Modifier ${fullName(s)}`} onClick={() => openEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        label={`Supprimer ${fullName(s)}`}
                        danger
                        onClick={() => setToDelete(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold">Aucun élève</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajustez vos filtres ou inscrivez un nouvel élève.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((s) => (
              <div key={s.id} className="card-hover rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                      {initials(s)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold leading-tight">{fullName(s)}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {s.matricule} · {s.className}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                      s.feesPaid
                        ? "border-border bg-muted/60 text-muted-foreground"
                        : "border-[color-mix(in_oklab,var(--warning)_35%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-[var(--warning)]",
                    )}
                  >
                    {s.feesPaid ? "Payée" : "En attente"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Assiduité</div>
                    <div className="font-semibold tabular-nums">{Math.round(s.attendance * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Moyenne</div>
                    <div className="font-semibold tabular-nums">{s.average.toFixed(1)}/20</div>
                  </div>
                </div>
                <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
                  {s.guardianName} · {s.guardianPhone}
                </div>
                <div className="mt-3 flex justify-end gap-1">
                  <IconBtn label={`Voir ${fullName(s)}`} onClick={() => setDetail(s)}>
                    <Eye className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label={`Modifier ${fullName(s)}`} onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label={`Supprimer ${fullName(s)}`} danger onClick={() => setToDelete(s)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">Aucun élève</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ajustez vos filtres ou inscrivez un nouvel élève.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            Affichage de <strong className="text-foreground">{paginated.length}</strong> sur{" "}
            <strong className="text-foreground">{filtered.length}</strong> élève
            {filtered.length > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Page précédente"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8 text-xs"
                aria-label={`Page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Page suivante"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la fiche élève" : "Inscrire un élève"}</DialogTitle>
            <DialogDescription>
              Identité, affectation scolaire et coordonnées du responsable légal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-1">
            <Section title="Identité">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" id="fn">
                  <Input
                    id="fn"
                    value={form.firstName}
                    maxLength={60}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                </Field>
                <Field label="Nom" id="ln">
                  <Input
                    id="ln"
                    value={form.lastName}
                    maxLength={60}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </Field>
                <Field label="Matricule" id="mat">
                  <Input
                    id="mat"
                    value={form.matricule}
                    onChange={(e) => setForm((f) => ({ ...f, matricule: e.target.value }))}
                  />
                </Field>
                <Field label="Date de naissance" id="bd">
                  <Input
                    id="bd"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                  />
                </Field>
                <Field label="Genre">
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm((f) => ({ ...f, gender: v as Gender }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">Fille</SelectItem>
                      <SelectItem value="M">Garçon</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date d'inscription" id="en">
                  <Input
                    id="en"
                    type="date"
                    value={form.enrolledAt}
                    onChange={(e) => setForm((f) => ({ ...f, enrolledAt: e.target.value }))}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Scolarité">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Cycle">
                  <Select
                    value={form.level}
                    onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Classe">
                  <Select
                    value={form.className}
                    onValueChange={(v) => setForm((f) => ({ ...f, className: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Assiduité (%)" id="att">
                  <Input
                    id="att"
                    type="number"
                    min={0}
                    max={100}
                    value={Math.round(form.attendance * 100)}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, attendance: Number(e.target.value) / 100 }))
                    }
                  />
                </Field>
                <Field label="Moyenne /20" id="avg">
                  <Input
                    id="avg"
                    type="number"
                    step="0.1"
                    min={0}
                    max={20}
                    value={form.average}
                    onChange={(e) => setForm((f) => ({ ...f, average: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Scolarité">
                  <Select
                    value={form.feesPaid ? "paid" : "pending"}
                    onValueChange={(v) => setForm((f) => ({ ...f, feesPaid: v === "paid" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Payée</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            <Section title="Responsable légal">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom du responsable" id="gn">
                  <Input
                    id="gn"
                    value={form.guardianName}
                    onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))}
                  />
                </Field>
                <Field label="Téléphone" id="gp">
                  <Input
                    id="gp"
                    value={form.guardianPhone}
                    onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
                  />
                </Field>
                <Field label="Email" id="ge">
                  <Input
                    id="ge"
                    type="email"
                    value={form.guardianEmail}
                    onChange={(e) => setForm((f) => ({ ...f, guardianEmail: e.target.value }))}
                  />
                </Field>
                <Field label="Adresse" id="ad">
                  <Input
                    id="ad"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Notes internes" id="nt">
                  <Textarea
                    id="nt"
                    rows={3}
                    maxLength={1000}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Observations, aménagements, informations médicales…"
                  />
                </Field>
              </div>
            </Section>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={save}>{editing ? "Enregistrer" : "Inscrire"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail drawer */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-[440px]">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>Fiche élève</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {initials(detail)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-base font-bold">{fullName(detail)}</div>
                    <div className="text-xs text-muted-foreground">
                      {detail.matricule} · {detail.className}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Assiduité" value={`${Math.round(detail.attendance * 100)}%`} />
                  <MiniStat label="Moyenne" value={`${detail.average.toFixed(1)}`} />
                  <MiniStat label="Scolarité" value={detail.feesPaid ? "Payée" : "En attente"} />
                </div>

                <div className="space-y-3">
                  <Row icon={Users2} label="Responsable" value={detail.guardianName} />
                  <Row icon={Phone} label="Téléphone" value={detail.guardianPhone} />
                  <Row icon={Mail} label="Email" value={detail.guardianEmail} />
                  <Row icon={MapPin} label="Adresse" value={detail.address} />
                  <Row icon={CalendarDays} label="Naissance" value={detail.birthDate} />
                  <Row icon={CalendarDays} label="Inscrit le" value={detail.enrolledAt} />
                </div>

                {detail.notes && (
                  <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    {detail.notes}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const s = detail;
                      setDetail(null);
                      openEdit(s);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setDetail(null)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élève ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le dossier de {toDelete ? fullName(toDelete) : ""} sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users2;
  label: string;
  value: string;
}) {
  return (
    <div className="card-elegant card-hover p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">{value}</div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors",
        danger
          ? "hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] hover:text-[var(--destructive)]"
          : "hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
