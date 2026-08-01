import { useMemo, useState } from "react";
import {
  UserSquare2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Phone,
  Download,
  KeyRound,
  Lock,
  Unlock,
  Clock,
  UserX,
  BookOpen,
  School,
  CalendarDays,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const SUBJECTS = [
  "Mathématiques",
  "Français",
  "Anglais",
  "Histoire-Géographie",
  "Physique-Chimie",
  "SVT",
  "Philosophie",
  "EPS",
  "Informatique",
  "Arts plastiques",
];

export const CLASS_NAMES = [
  "6ème A",
  "6ème B",
  "5ème A",
  "4ème B",
  "3ème A",
  "2nde C",
  "1ère S",
  "Terminale S",
];

type TStatus = "active" | "blocked" | "leave";

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  hours: number;
  maxHours: number;
  absences: number;
  status: TStatus;
  hiredAt: string;
  notes: string;
};

const statusLabels: Record<TStatus, string> = {
  active: "Actif",
  blocked: "Bloqué",
  leave: "En congé",
};

const statusDot: Record<TStatus, string> = {
  active: "bg-[var(--success)]",
  blocked: "bg-[var(--destructive)]",
  leave: "bg-[var(--warning)]",
};

const seed: Teacher[] = [
  ["Nadia", "Belkacem", ["Mathématiques"], ["6ème A", "5ème A", "3ème A"], 21, 2, "active"],
  ["Julien", "Roche", ["Français", "Philosophie"], ["2nde C", "1ère S"], 18, 0, "active"],
  ["Sarah", "Klein", ["Anglais"], ["6ème B", "4ème B", "3ème A", "2nde C"], 24, 5, "leave"],
  ["Marc", "Toussaint", ["Physique-Chimie", "SVT"], ["1ère S", "Terminale S"], 20, 1, "active"],
  ["Leïla", "Amrani", ["Histoire-Géographie"], ["5ème A", "4ème B"], 15, 3, "blocked"],
  ["Thomas", "Girard", ["EPS"], ["6ème A", "6ème B", "5ème A", "4ème B"], 22, 0, "active"],
  ["Claire", "Fontaine", ["Informatique", "Mathématiques"], ["3ème A", "Terminale S"], 16, 1, "active"],
].map((row, i) => {
  const [firstName, lastName, subjects, classes, hours, absences, status] = row as [
    string,
    string,
    string[],
    string[],
    number,
    number,
    TStatus,
  ];
  return {
    id: `t${i + 1}`,
    firstName,
    lastName,
    matricule: `PRF-2026-${String(i + 1).padStart(3, "0")}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@scolaris.fr`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    phone: `+33 6 ${10 + i} ${20 + i} ${30 + i} ${40 + i}`,
    subjects,
    classes,
    hours,
    maxHours: 24,
    absences,
    status,
    hiredAt: `20${15 + (i % 8)}-09-01`,
    notes: "",
  };
});

const emptyForm: Omit<Teacher, "id"> = {
  firstName: "",
  lastName: "",
  matricule: "",
  email: "",
  phone: "",
  subjects: [],
  classes: [],
  hours: 0,
  maxHours: 24,
  absences: 0,
  status: "active",
  hiredAt: new Date().toISOString().slice(0, 10),
  notes: "",
};

const fullName = (t: { firstName: string; lastName: string }) => `${t.firstName} ${t.lastName}`;
const initials = (t: { firstName: string; lastName: string }) =>
  `${t.firstName[0] ?? ""}${t.lastName[0] ?? ""}`.toUpperCase();

export function TeachersPage() {
  const [items, setItems] = useState<Teacher[]>(seed);
  const [status, setStatus] = useState<"all" | TStatus>("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "hours" | "absences">("name");
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<Teacher | null>(null);
  const [toDelete, setToDelete] = useState<Teacher | null>(null);
  const [toReset, setToReset] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((t) => (status === "all" ? true : t.status === status))
      .filter((t) => (subjectFilter === "all" ? true : t.subjects.includes(subjectFilter)))
      .filter((t) => (classFilter === "all" ? true : t.classes.includes(classFilter)))
      .filter((t) =>
        q
          ? [fullName(t), t.matricule, t.email, t.subjects.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) =>
        sortBy === "name"
          ? fullName(a).localeCompare(fullName(b))
          : sortBy === "hours"
            ? b.hours - a.hours
            : b.absences - a.absences,
      );
  }, [items, status, subjectFilter, classFilter, query, sortBy]);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((t) => t.status === "active").length;
    const blocked = items.filter((t) => t.status === "blocked").length;
    const hours = total ? items.reduce((s, t) => s + t.hours, 0) / total : 0;
    return { total, active, blocked, hours };
  }, [items]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, matricule: `PRF-2026-${String(items.length + 1).padStart(3, "0")}` });
    setOpen(true);
  }

  function openEdit(t: Teacher) {
    setEditing(t);
    const { id: _id, ...rest } = t;
    setForm(rest);
    setOpen(true);
  }

  function save() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Le prénom et le nom sont requis.");
      return;
    }
    if (editing) {
      setItems((prev) => prev.map((t) => (t.id === editing.id ? { ...form, id: editing.id } : t)));
      toast.success("Professeur mis à jour.");
    } else {
      setItems((prev) => [{ ...form, id: `t${Date.now()}` }, ...prev]);
      toast.success("Professeur créé.");
    }
    setOpen(false);
  }

  function toggleBlock(t: Teacher) {
    const next: TStatus = t.status === "blocked" ? "active" : "blocked";
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    toast.success(next === "blocked" ? "Compte bloqué." : "Compte réactivé.");
  }

  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((t) => t.id !== toDelete.id));
    toast.success("Professeur supprimé.");
    setToDelete(null);
  }

  function confirmReset() {
    if (!toReset) return;
    toast.success(`Lien de réinitialisation envoyé à ${toReset.email}.`);
    setToReset(null);
  }

  function exportCsv() {
    const header = ["Matricule", "Nom", "Email", "Matières", "Classes", "Heures", "Absences", "Statut"];
    const rows = filtered.map((t) => [
      t.matricule,
      fullName(t),
      t.email,
      t.subjects.join(" / "),
      t.classes.join(" / "),
      `${t.hours}h`,
      String(t.absences),
      statusLabels[t.status],
    ]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "professeurs.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV généré.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <UserSquare2 className="h-3.5 w-3.5" /> Corps enseignant
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">Professeurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comptes, matières, classes affectées, charge horaire et absences.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Exporter
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Créer un professeur
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserSquare2} label="Professeurs" value={String(stats.total)} />
        <StatCard icon={Unlock} label="Comptes actifs" value={String(stats.active)} />
        <StatCard icon={Lock} label="Comptes bloqués" value={String(stats.blocked)} />
        <StatCard icon={Clock} label="Charge moyenne" value={`${stats.hours.toFixed(1)}h`} />
      </div>

      <div className="card-elegant p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={status} onValueChange={(v) => setStatus(v as "all" | TStatus)}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="leave">En congé</TabsTrigger>
              <TabsTrigger value="blocked">Bloqués</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-9 w-[170px] text-xs">
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {CLASS_NAMES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-9 w-[170px] text-xs">
              <SelectValue placeholder="Trier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Trier : nom</SelectItem>
              <SelectItem value="hours">Trier : charge horaire</SelectItem>
              <SelectItem value="absences">Trier : absences</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative ml-auto w-full sm:w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom, matricule, matière…"
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[240px] text-[11px] uppercase tracking-[0.08em]">
                  Professeur
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Matières</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Classes</TableHead>
                <TableHead className="min-w-[150px] text-[11px] uppercase tracking-[0.08em]">
                  Charge horaire
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Absences</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Compte</TableHead>
                <TableHead className="w-[190px] text-right text-[11px] uppercase tracking-[0.08em]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                          {initials(t)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-tight">
                          {fullName(t)}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">{t.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                      {t.subjects.length === 0 && (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.classes.slice(0, 3).map((c) => (
                        <Chip key={c}>{c}</Chip>
                      ))}
                      {t.classes.length > 3 && <Chip>+{t.classes.length - 3}</Chip>}
                      {t.classes.length === 0 && (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium tabular-nums">
                      {t.hours}h / {t.maxHours}h
                    </div>
                    <Progress value={(t.hours / t.maxHours) * 100} className="mt-1.5 h-1.5 w-28" />
                  </TableCell>
                  <TableCell className="text-xs font-medium tabular-nums">{t.absences}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[t.status])} />
                      {statusLabels[t.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <IconBtn label={`Voir ${fullName(t)}`} onClick={() => setDetail(t)}>
                        <Eye className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label={`Modifier ${fullName(t)}`} onClick={() => openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        label={`Réinitialiser le mot de passe de ${fullName(t)}`}
                        onClick={() => setToReset(t)}
                      >
                        <KeyRound className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        label={t.status === "blocked" ? "Débloquer" : "Bloquer"}
                        onClick={() => toggleBlock(t)}
                      >
                        {t.status === "blocked" ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </IconBtn>
                      <IconBtn label={`Supprimer ${fullName(t)}`} danger onClick={() => setToDelete(t)}>
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
                      <UserSquare2 className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold">Aucun professeur</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajustez vos filtres ou créez un nouveau compte enseignant.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            {filtered.length} professeur{filtered.length > 1 ? "s" : ""} sur {items.length}
          </span>
        </div>
      </div>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le professeur" : "Créer un professeur"}</DialogTitle>
            <DialogDescription>
              Identité, compte d'accès, matières enseignées et classes affectées.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-1">
            <Section title="Identité & compte">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Prénom" id="t-fn">
                  <Input
                    id="t-fn"
                    value={form.firstName}
                    maxLength={60}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                </Field>
                <Field label="Nom" id="t-ln">
                  <Input
                    id="t-ln"
                    value={form.lastName}
                    maxLength={60}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  />
                </Field>
                <Field label="Matricule" id="t-mat">
                  <Input
                    id="t-mat"
                    value={form.matricule}
                    onChange={(e) => setForm((f) => ({ ...f, matricule: e.target.value }))}
                  />
                </Field>
                <Field label="Email professionnel" id="t-em">
                  <Input
                    id="t-em"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Field>
                <Field label="Téléphone" id="t-ph">
                  <Input
                    id="t-ph"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </Field>
                <Field label="Date d'embauche" id="t-hd">
                  <Input
                    id="t-hd"
                    type="date"
                    value={form.hiredAt}
                    onChange={(e) => setForm((f) => ({ ...f, hiredAt: e.target.value }))}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Matières enseignées">
              <TogglePills
                options={SUBJECTS}
                selected={form.subjects}
                onToggle={(v) =>
                  setForm((f) => ({
                    ...f,
                    subjects: f.subjects.includes(v)
                      ? f.subjects.filter((x) => x !== v)
                      : [...f.subjects, v],
                  }))
                }
              />
            </Section>

            <Section title="Classes affectées">
              <TogglePills
                options={CLASS_NAMES}
                selected={form.classes}
                onToggle={(v) =>
                  setForm((f) => ({
                    ...f,
                    classes: f.classes.includes(v)
                      ? f.classes.filter((x) => x !== v)
                      : [...f.classes, v],
                  }))
                }
              />
            </Section>

            <Section title="Service">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Heures / semaine" id="t-h">
                  <Input
                    id="t-h"
                    type="number"
                    min={0}
                    max={40}
                    value={form.hours}
                    onChange={(e) => setForm((f) => ({ ...f, hours: Number(e.target.value) }))}
                  />
                </Field>
                <Field label="Maximum autorisé" id="t-mh">
                  <Input
                    id="t-mh"
                    type="number"
                    min={1}
                    max={40}
                    value={form.maxHours}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxHours: Math.max(1, Number(e.target.value)) }))
                    }
                  />
                </Field>
                <Field label="Statut du compte">
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v as TStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="leave">En congé</SelectItem>
                      <SelectItem value="blocked">Bloqué</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Notes internes" id="t-nt">
                  <Textarea
                    id="t-nt"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </Field>
              </div>
            </Section>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={save}>{editing ? "Enregistrer" : "Créer le compte"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>Fiche professeur</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
                      {initials(detail)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-lg font-bold leading-tight">{fullName(detail)}</div>
                    <div className="text-xs text-muted-foreground">{detail.matricule}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Heures" value={`${detail.hours}h`} />
                  <MiniStat label="Absences" value={String(detail.absences)} />
                  <MiniStat label="Compte" value={statusLabels[detail.status]} />
                </div>

                <div className="space-y-3">
                  <Row icon={Mail} label="Email" value={detail.email} />
                  <Row icon={Phone} label="Téléphone" value={detail.phone} />
                  <Row icon={BookOpen} label="Matières" value={detail.subjects.join(", ") || "—"} />
                  <Row icon={School} label="Classes" value={detail.classes.join(", ") || "—"} />
                  <Row icon={CalendarDays} label="Embauché le" value={detail.hiredAt} />
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Charge horaire
                  </div>
                  <Progress
                    value={(detail.hours / detail.maxHours) * 100}
                    className="mt-2 h-2"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {detail.hours}h utilisées sur {detail.maxHours}h autorisées
                  </div>
                </div>

                {detail.notes && (
                  <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    {detail.notes}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      const t = detail;
                      setDetail(null);
                      openEdit(t);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button variant="outline" onClick={() => setToReset(detail)} className="gap-2">
                    <KeyRound className="h-4 w-4" /> Mot de passe
                  </Button>
                  <Button
                    variant="outline"
                    className="col-span-2 gap-2"
                    onClick={() => toggleBlock(detail)}
                  >
                    {detail.status === "blocked" ? (
                      <>
                        <Unlock className="h-4 w-4" /> Débloquer le compte
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Bloquer le compte
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toReset} onOpenChange={(o) => !o && setToReset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le mot de passe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Un lien sécurisé sera envoyé à {toReset?.email}. Le mot de passe actuel restera
              valide jusqu'à la première connexion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>Envoyer le lien</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce professeur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de {toDelete ? fullName(toDelete) : ""} et ses affectations seront
              définitivement supprimés.
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

function TogglePills({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              on
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserSquare2;
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
      title={label}
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

function Field({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) {
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
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

export { UserX };
