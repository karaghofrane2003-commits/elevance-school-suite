import { useMemo, useState } from "react";
import {
  School,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users2,
  UserPlus,
  UserMinus,
  Download,
  DoorOpen,
  UserSquare2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const LEVELS = ["Collège", "Lycée"];

const TEACHERS = [
  "Nadia Belkacem",
  "Julien Roche",
  "Sarah Klein",
  "Marc Toussaint",
  "Leïla Amrani",
  "Thomas Girard",
  "Claire Fontaine",
];

type Pupil = { id: string; name: string; classId: string | null };

type SchoolClass = {
  id: string;
  name: string;
  level: string;
  grade: string;
  mainTeacher: string;
  room: string;
  capacity: number;
  year: string;
};

const seedClasses: SchoolClass[] = [
  ["6ème A", "Collège", "6ème", "Nadia Belkacem", "B-102", 30],
  ["6ème B", "Collège", "6ème", "Thomas Girard", "B-104", 30],
  ["5ème A", "Collège", "5ème", "Leïla Amrani", "B-201", 28],
  ["4ème B", "Collège", "4ème", "Sarah Klein", "B-203", 28],
  ["3ème A", "Collège", "3ème", "Claire Fontaine", "C-101", 26],
  ["2nde C", "Lycée", "2nde", "Julien Roche", "C-204", 32],
  ["1ère S", "Lycée", "1ère", "Marc Toussaint", "C-301", 30],
  ["Terminale S", "Lycée", "Terminale", "Marc Toussaint", "C-305", 30],
].map((row, i) => {
  const [name, level, grade, mainTeacher, room, capacity] = row as [
    string,
    string,
    string,
    string,
    string,
    number,
  ];
  return { id: `c${i + 1}`, name, level, grade, mainTeacher, room, capacity, year: "2025 — 2026" };
});

const firstNames = [
  "Amina", "Lucas", "Inès", "Noah", "Sofia", "Youssef", "Camille", "Adam", "Léa", "Rayan",
  "Chloé", "Ilyes", "Manon", "Sami", "Jade", "Nour", "Elias", "Anaïs", "Zayn", "Louise",
  "Malik", "Emma", "Karim", "Alice", "Idris", "Zoé", "Omar", "Lina", "Hugo", "Yasmine",
  "Théo", "Salma", "Nathan", "Aya", "Ethan", "Maya", "Gabriel", "Sarah", "Mehdi", "Julia",
];
const lastNames = [
  "Bensalem", "Moreau", "Charef", "Petit", "Ricci", "Haddad", "Durand", "Lefèvre", "Nakache",
  "Sow", "Marchand", "Bouzid", "Perrin", "Reyes", "Costa", "Dupont", "Ferrand", "Okoye",
];

const seedPupils: Pupil[] = Array.from({ length: 88 }, (_, i) => {
  const assigned = i < 78;
  return {
    id: `p${i + 1}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`,
    classId: assigned ? `c${(i % 8) + 1}` : null,
  };
});

const emptyForm: Omit<SchoolClass, "id"> = {
  name: "",
  level: "Collège",
  grade: "6ème",
  mainTeacher: TEACHERS[0],
  room: "",
  capacity: 30,
  year: "2025 — 2026",
};

export function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>(seedClasses);
  const [pupils, setPupils] = useState<Pupil[]>(seedPupils);
  const [level, setLevel] = useState<"all" | string>("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "effectif" | "fill">("name");
  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [roster, setRoster] = useState<SchoolClass | null>(null);
  const [rosterQuery, setRosterQuery] = useState("");
  const [toDelete, setToDelete] = useState<SchoolClass | null>(null);

  const countOf = (id: string) => pupils.filter((p) => p.classId === id).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes
      .filter((c) => (level === "all" ? true : c.level === level))
      .filter((c) => (teacherFilter === "all" ? true : c.mainTeacher === teacherFilter))
      .filter((c) =>
        q ? [c.name, c.room, c.mainTeacher].join(" ").toLowerCase().includes(q) : true,
      )
      .sort((a, b) =>
        sortBy === "name"
          ? a.name.localeCompare(b.name)
          : sortBy === "effectif"
            ? countOf(b.id) - countOf(a.id)
            : countOf(b.id) / b.capacity - countOf(a.id) / a.capacity,
      );
  }, [classes, pupils, level, teacherFilter, query, sortBy]);

  const stats = useMemo(() => {
    const total = classes.length;
    const enrolled = pupils.filter((p) => p.classId).length;
    const unassigned = pupils.length - enrolled;
    const avg = total ? enrolled / total : 0;
    return { total, enrolled, unassigned, avg };
  }, [classes, pupils]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(c: SchoolClass) {
    setEditing(c);
    const { id: _id, ...rest } = c;
    setForm(rest);
    setOpen(true);
  }

  function save() {
    if (!form.name.trim()) {
      toast.error("Le nom de la classe est requis.");
      return;
    }
    if (editing) {
      setClasses((prev) => prev.map((c) => (c.id === editing.id ? { ...form, id: editing.id } : c)));
      toast.success("Classe mise à jour.");
    } else {
      setClasses((prev) => [{ ...form, id: `c${Date.now()}` }, ...prev]);
      toast.success("Classe créée.");
    }
    setOpen(false);
  }

  function confirmDelete() {
    if (!toDelete) return;
    setPupils((prev) =>
      prev.map((p) => (p.classId === toDelete.id ? { ...p, classId: null } : p)),
    );
    setClasses((prev) => prev.filter((c) => c.id !== toDelete.id));
    toast.success("Classe supprimée, les élèves sont désormais non affectés.");
    setToDelete(null);
  }

  function assign(pupilId: string, classId: string) {
    const cls = classes.find((c) => c.id === classId);
    if (cls && countOf(classId) >= cls.capacity) {
      toast.error("Capacité maximale atteinte pour cette classe.");
      return;
    }
    setPupils((prev) => prev.map((p) => (p.id === pupilId ? { ...p, classId } : p)));
  }

  function unassign(pupilId: string) {
    setPupils((prev) => prev.map((p) => (p.id === pupilId ? { ...p, classId: null } : p)));
  }

  function exportCsv() {
    const header = ["Classe", "Cycle", "Niveau", "Professeur principal", "Salle", "Effectif", "Capacité"];
    const rows = filtered.map((c) => [
      c.name,
      c.level,
      c.grade,
      c.mainTeacher,
      c.room,
      String(countOf(c.id)),
      String(c.capacity),
    ]);
    const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "classes.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV généré.");
  }

  const rosterMembers = roster
    ? pupils.filter(
        (p) =>
          p.classId === roster.id &&
          p.name.toLowerCase().includes(rosterQuery.trim().toLowerCase()),
      )
    : [];
  const rosterAvailable = roster
    ? pupils.filter(
        (p) =>
          p.classId === null &&
          p.name.toLowerCase().includes(rosterQuery.trim().toLowerCase()),
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <School className="h-3.5 w-3.5" /> Organisation pédagogique
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Création des classes, professeur principal, salles, effectifs et affectation des élèves.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Exporter
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Créer une classe
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={School} label="Classes ouvertes" value={String(stats.total)} />
        <StatCard icon={Users2} label="Élèves affectés" value={String(stats.enrolled)} />
        <StatCard icon={UserMinus} label="Non affectés" value={String(stats.unassigned)} />
        <StatCard icon={Layers} label="Effectif moyen" value={stats.avg.toFixed(1)} />
      </div>

      <div className="card-elegant p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={level} onValueChange={setLevel}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              {LEVELS.map((l) => (
                <TabsTrigger key={l} value={l}>
                  {l}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Select value={teacherFilter} onValueChange={setTeacherFilter}>
            <SelectTrigger className="h-9 w-[200px] text-xs">
              <SelectValue placeholder="Professeur principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les professeurs</SelectItem>
              {TEACHERS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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
              <SelectItem value="effectif">Trier : effectif</SelectItem>
              <SelectItem value="fill">Trier : remplissage</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative ml-auto w-full sm:w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Classe, salle, professeur…"
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
                <TableHead className="min-w-[180px] text-[11px] uppercase tracking-[0.08em]">
                  Classe
                </TableHead>
                <TableHead className="min-w-[200px] text-[11px] uppercase tracking-[0.08em]">
                  Professeur principal
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Salle</TableHead>
                <TableHead className="min-w-[180px] text-[11px] uppercase tracking-[0.08em]">
                  Effectif
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Année</TableHead>
                <TableHead className="w-[170px] text-right text-[11px] uppercase tracking-[0.08em]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const n = countOf(c.id);
                const pct = Math.min(100, (n / c.capacity) * 100);
                const full = n >= c.capacity;
                return (
                  <TableRow key={c.id} className="group">
                    <TableCell className="py-3">
                      <div className="text-sm font-semibold leading-tight">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.level} · {c.grade}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground">
                            {c.mainTeacher
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{c.mainTeacher}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{c.room || "—"}</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          full && "text-[var(--warning)]",
                        )}
                      >
                        {n} / {c.capacity} élèves
                      </div>
                      <Progress value={pct} className="mt-1.5 h-1.5 w-32" />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.year}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                        <IconBtn
                          label={`Gérer les élèves de ${c.name}`}
                          onClick={() => {
                            setRosterQuery("");
                            setRoster(c);
                          }}
                        >
                          <Users2 className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn label={`Modifier ${c.name}`} onClick={() => openEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn label={`Supprimer ${c.name}`} danger onClick={() => setToDelete(c)}>
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <School className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold">Aucune classe</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajustez vos filtres ou créez une nouvelle classe.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>
            {filtered.length} classe{filtered.length > 1 ? "s" : ""} sur {classes.length}
          </span>
          <span>{stats.unassigned} élève(s) en attente d'affectation</span>
        </div>
      </div>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la classe" : "Créer une classe"}</DialogTitle>
            <DialogDescription>
              Identification, cycle, professeur principal, salle et capacité d'accueil.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-1 sm:grid-cols-2">
            <Field label="Nom de la classe" id="c-name">
              <Input
                id="c-name"
                value={form.name}
                maxLength={40}
                placeholder="ex. 6ème A"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Cycle">
              <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Niveau" id="c-grade">
              <Input
                id="c-grade"
                value={form.grade}
                placeholder="ex. 6ème"
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
              />
            </Field>
            <Field label="Professeur principal">
              <Select
                value={form.mainTeacher}
                onValueChange={(v) => setForm((f) => ({ ...f, mainTeacher: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEACHERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Salle" id="c-room">
              <Input
                id="c-room"
                value={form.room}
                placeholder="ex. B-102"
                onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
              />
            </Field>
            <Field label="Capacité" id="c-cap">
              <Input
                id="c-cap"
                type="number"
                min={1}
                max={60}
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: Math.max(1, Number(e.target.value)) }))
                }
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={save}>{editing ? "Enregistrer" : "Créer la classe"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roster */}
      <Sheet open={!!roster} onOpenChange={(o) => !o && setRoster(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {roster && (
            <>
              <SheetHeader>
                <SheetTitle>Effectif — {roster.name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Élèves" value={String(countOf(roster.id))} />
                  <MiniStat label="Capacité" value={String(roster.capacity)} />
                  <MiniStat
                    label="Places"
                    value={String(Math.max(0, roster.capacity - countOf(roster.id)))}
                  />
                </div>

                <div className="space-y-3">
                  <Row icon={UserSquare2} label="Professeur principal" value={roster.mainTeacher} />
                  <Row icon={DoorOpen} label="Salle" value={roster.room || "—"} />
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={rosterQuery}
                    onChange={(e) => setRosterQuery(e.target.value)}
                    placeholder="Rechercher un élève…"
                    className="h-9 pl-9 text-xs"
                  />
                </div>

                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Élèves inscrits ({rosterMembers.length})
                  </div>
                  <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border p-1.5">
                    {rosterMembers.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      >
                        <span className="text-xs font-medium">{p.name}</span>
                        <button
                          aria-label={`Retirer ${p.name}`}
                          onClick={() => unassign(p.id)}
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] hover:text-[var(--destructive)]"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {rosterMembers.length === 0 && (
                      <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                        Aucun élève dans cette classe.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Élèves disponibles ({rosterAvailable.length})
                  </div>
                  <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border p-1.5">
                    {rosterAvailable.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      >
                        <span className="text-xs font-medium">{p.name}</span>
                        <button
                          aria-label={`Affecter ${p.name}`}
                          onClick={() => assign(p.id, roster.id)}
                          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {rosterAvailable.length === 0 && (
                      <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                        Aucun élève non affecté.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      const c = roster;
                      setRoster(null);
                      openEdit(c);
                    }}
                  >
                    Modifier la classe
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setRoster(null)}>
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
            <AlertDialogTitle>Supprimer cette classe ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.name} sera supprimée. Les {toDelete ? countOf(toDelete.id) : 0} élève(s)
              affectés repasseront en attente d'affectation.
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
  icon: typeof School;
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
  icon: typeof School;
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
