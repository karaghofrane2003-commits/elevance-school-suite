import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Check, X, Download, RotateCcw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Field, Pager } from "./parents";

type Kind = "Absence" | "Retard";
type State = "Justifiée" | "Non justifiée" | "En attente";
type Absence = { id: string; student: string; className: string; date: string; period: string; kind: Kind; state: State; reason: string };

const students = [
  ["Lina Benali", "6e A"], ["Lucas Martin", "CM2"], ["Yanis Cherif", "5e B"], ["Emma Rousseau", "CM2"],
  ["Hugo Moreau", "4e B"], ["Sara Haddad", "3e A"], ["Léo Petit", "CE1"], ["Inès Garnier", "6e B"],
  ["Adam Zahra", "5e A"], ["Chloé Lefèvre", "CP"], ["Noah Fontaine", "4e A"], ["Rayan Amrani", "3e B"],
];
const classes = Array.from(new Set(students.map((s) => s[1])));
const periods = ["Journée", "Matin", "Après-midi", "08h–10h", "10h–12h", "14h–16h"];
const states: State[] = ["Justifiée", "Non justifiée", "En attente"];
const reasons = ["Maladie", "Rendez-vous médical", "Raison familiale", "", "Transport"];

const today = new Date().toISOString().slice(0, 10);
const day = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const seed: Absence[] = Array.from({ length: 24 }, (_, i) => {
  const [student, className] = students[i % students.length];
  return {
    id: `a${i}`, student, className, date: day(Math.floor(i / 4)), period: periods[i % periods.length],
    kind: i % 5 === 0 ? "Retard" : "Absence", state: states[i % 3], reason: reasons[i % reasons.length],
  };
});

const empty: Omit<Absence, "id"> = { student: students[0][0], className: students[0][1], date: today, period: "Journée", kind: "Absence", state: "En attente", reason: "" };
const PAGE = 10;

const stateStyle: Record<State, string> = {
  "Justifiée": "bg-success/10 text-success",
  "Non justifiée": "bg-danger/10 text-danger",
  "En attente": "bg-muted text-muted-foreground",
};

export function AbsencesPage() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [st, setSt] = useState("all");
  const [kind, setKind] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Absence | null>(null);
  const [form, setForm] = useState(empty);
  const [toDelete, setToDelete] = useState<Absence | null>(null);

  const filtered = useMemo(() => items.filter((a) =>
    a.student.toLowerCase().includes(q.toLowerCase()) && (cls === "all" || a.className === cls) &&
    (st === "all" || a.state === st) && (kind === "all" || a.kind === kind) && (!date || a.date === date))
    .sort((a, b) => b.date.localeCompare(a.date)), [items, q, cls, st, kind, date]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);
  const f = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };

  const setState = (a: Absence, s: State) => { setItems((x) => x.map((y) => (y.id === a.id ? { ...y, state: s } : y))); toast.success(`Marquée « ${s} »`); };
  const save = () => {
    if (editing) { setItems((s) => s.map((x) => (x.id === editing.id ? { ...form, id: x.id } : x))); toast.success("Absence modifiée"); }
    else { setItems((s) => [{ ...form, id: crypto.randomUUID() }, ...s]); toast.success("Absence enregistrée"); }
    setOpen(false);
  };
  const reset = () => { setQ(""); setCls("all"); setSt("all"); setKind("all"); setDate(""); setPage(1); };
  const exportCsv = () => {
    const csv = ["Élève,Classe,Date,Période,Type,Statut,Motif", ...filtered.map((a) => [a.student, a.className, a.date, a.period, a.kind, a.state, a.reason].join(","))].join("\n");
    const el = document.createElement("a"); el.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); el.download = "absences.csv"; el.click();
  };

  const kpis = [
    { label: "Absents aujourd'hui", value: items.filter((a) => a.date === today && a.kind === "Absence").length },
    { label: "Retards aujourd'hui", value: items.filter((a) => a.date === today && a.kind === "Retard").length },
    { label: "Non justifiées", value: items.filter((a) => a.state === "Non justifiée").length },
    { label: "En attente", value: items.filter((a) => a.state === "En attente").length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Vie scolaire</div>
          <h1 className="text-2xl font-bold tracking-tight">Absences & retards</h1>
          <p className="text-sm text-muted-foreground">Suivi quotidien, justification et notification des familles.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Exporter</Button>
          <Button onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus className="h-4 w-4" />Saisir une absence</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-elegant p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card-elegant p-3 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => f(setQ)(e.target.value)} placeholder="Rechercher un élève..." className="pl-9" />
        </div>
        <Input type="date" value={date} onChange={(e) => f(setDate)(e.target.value)} className="w-40" />
        <Select value={cls} onValueChange={f(setCls)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Toutes les classes</SelectItem>{classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={kind} onValueChange={f(setKind)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous types</SelectItem><SelectItem value="Absence">Absence</SelectItem><SelectItem value="Retard">Retard</SelectItem></SelectContent></Select>
        <Select value={st} onValueChange={f(setSt)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous statuts</SelectItem>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />Réinitialiser</Button>
      </div>

      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left px-4 py-3">Élève</th><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Période</th><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Motif</th><th className="text-left px-4 py-3">Statut</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] font-semibold">{a.student.split(" ").map((w) => w[0]).join("")}</AvatarFallback></Avatar>
                    <div><div className="font-semibold">{a.student}</div><div className="text-xs text-muted-foreground">{a.className}</div></div>
                  </div></td>
                  <td className="px-4 py-3 tabular-nums">{new Date(a.date).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">{a.period}</td>
                  <td className="px-4 py-3"><span className={cn("text-xs font-medium", a.kind === "Retard" ? "text-warning" : "")}>{a.kind}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{a.reason || "—"}</td>
                  <td className="px-4 py-3"><span className={cn("text-xs font-medium px-2 py-0.5 rounded-md", stateStyle[a.state])}>{a.state}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" title="Justifier" onClick={() => setState(a, "Justifiée")}><Check className="h-4 w-4 text-success" /></Button>
                    <Button size="icon" variant="ghost" title="Refuser" onClick={() => setState(a, "Non justifiée")}><X className="h-4 w-4 text-danger" /></Button>
                    <Button size="icon" variant="ghost" title="Notifier les parents" onClick={() => toast.success(`Parents de ${a.student} notifiés`)}><Bell className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setForm(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setToDelete(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Aucune absence trouvée.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} total={filtered.length} shown={rows.length} onPage={setPage} label="absences" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier l'absence" : "Saisir une absence"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Field label="Élève"><Select value={form.student} onValueChange={(v) => setForm({ ...form, student: v, className: students.find((s) => s[0] === v)?.[1] ?? "" })}>
              <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{students.map(([n, c]) => <SelectItem key={n} value={n}>{n} — {c}</SelectItem>)}</SelectContent></Select></Field></div>
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Période"><Select value={form.period} onValueChange={(v) => setForm({ ...form, period: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Type"><Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as Kind })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Absence">Absence</SelectItem><SelectItem value="Retard">Retard</SelectItem></SelectContent></Select></Field>
            <Field label="Statut"><Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v as State })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
            <div className="col-span-2"><Field label="Motif"><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} /></Field></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer cette absence ?</AlertDialogTitle>
            <AlertDialogDescription>L'enregistrement de {toDelete?.student} sera supprimé.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setItems((s) => s.filter((x) => x.id !== toDelete?.id)); toast.success("Absence supprimée"); setToDelete(null); }}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
