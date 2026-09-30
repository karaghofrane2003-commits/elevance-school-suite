import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Mail, Phone, Download, RotateCcw, ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Parent = {
  id: string; firstName: string; lastName: string; relation: "Père" | "Mère" | "Tuteur";
  email: string; phone: string; children: string; balance: number; blocked: boolean;
};

const seedNames = [
  ["Karim", "Benali", "Père", "Lina Benali (6e A)"], ["Sophie", "Martin", "Mère", "Lucas Martin (CM2)"],
  ["Nadia", "Cherif", "Mère", "Yanis Cherif (5e B)"], ["Thomas", "Rousseau", "Père", "Emma Rousseau (CM2)"],
  ["Claire", "Moreau", "Mère", "Hugo Moreau (4e B)"], ["Ahmed", "Haddad", "Père", "Sara Haddad (3e A)"],
  ["Julie", "Petit", "Mère", "Léo Petit (CE1)"], ["Marc", "Garnier", "Tuteur", "Inès Garnier (6e B)"],
  ["Fatima", "Zahra", "Mère", "Adam Zahra (5e A)"], ["Pierre", "Lefèvre", "Père", "Chloé Lefèvre (CP)"],
  ["Laura", "Fontaine", "Mère", "Noah Fontaine (4e A)"], ["Youssef", "Amrani", "Père", "Rayan Amrani (3e B)"],
  ["Élodie", "Blanc", "Mère", "Jade Blanc (CE2)"], ["David", "Roux", "Père", "Tom Roux (CM1)"],
] as const;

const seed: Parent[] = seedNames.map(([f, l, r, c], i) => ({
  id: `p${i}`, firstName: f, lastName: l, relation: r, children: c,
  email: `${f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}.${l.toLowerCase()}@mail.fr`,
  phone: `06 ${String(10 + i).padStart(2, "0")} 45 67 ${String(20 + i)}`,
  balance: i % 4 === 0 ? 350 : i % 5 === 0 ? 120 : 0, blocked: i === 7,
}));

const empty: Omit<Parent, "id"> = { firstName: "", lastName: "", relation: "Mère", email: "", phone: "", children: "", balance: 0, blocked: false };
const PAGE = 10;

export function ParentsPage() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState("");
  const [rel, setRel] = useState("all");
  const [pay, setPay] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Parent | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Parent | null>(null);

  const filtered = useMemo(() => items.filter((p) =>
    (`${p.firstName} ${p.lastName} ${p.email} ${p.children}`.toLowerCase().includes(q.toLowerCase())) &&
    (rel === "all" || p.relation === rel) &&
    (pay === "all" || (pay === "due" ? p.balance > 0 : p.balance === 0))), [items, q, rel, pay]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Parent) => { setEditing(p); setForm(p); setOpen(true); };
  const save = () => {
    if (!form.firstName || !form.lastName || !form.email) return toast.error("Nom, prénom et email requis");
    if (editing) { setItems((s) => s.map((x) => (x.id === editing.id ? { ...form, id: x.id } : x))); toast.success("Parent modifié"); }
    else { setItems((s) => [{ ...form, id: crypto.randomUUID() }, ...s]); toast.success("Parent ajouté"); }
    setOpen(false);
  };
  const reset = () => { setQ(""); setRel("all"); setPay("all"); setPage(1); };
  const exportCsv = () => {
    const csv = ["Nom,Prénom,Lien,Email,Téléphone,Enfants,Solde",
      ...filtered.map((p) => [p.lastName, p.firstName, p.relation, p.email, p.phone, `"${p.children}"`, p.balance].join(","))].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "parents.csv"; a.click();
  };

  const kpis = [
    { label: "Total parents", value: items.length },
    { label: "Comptes actifs", value: items.filter((p) => !p.blocked).length },
    { label: "Paiements en attente", value: items.filter((p) => p.balance > 0).length },
    { label: "Solde dû total", value: `${items.reduce((a, p) => a + p.balance, 0)} €` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Communauté</div>
          <h1 className="text-2xl font-bold tracking-tight">Parents</h1>
          <p className="text-sm text-muted-foreground">Responsables légaux, coordonnées, enfants rattachés et paiements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Exporter</Button>
          <Button onClick={openNew}><Plus className="h-4 w-4" />Ajouter un parent</Button>
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
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher un parent ou un enfant..." className="pl-9" />
        </div>
        <Select value={rel} onValueChange={(v) => { setRel(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous les liens</SelectItem><SelectItem value="Père">Père</SelectItem><SelectItem value="Mère">Mère</SelectItem><SelectItem value="Tuteur">Tuteur</SelectItem></SelectContent>
        </Select>
        <Select value={pay} onValueChange={(v) => { setPay(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tous les paiements</SelectItem><SelectItem value="ok">À jour</SelectItem><SelectItem value="due">En attente</SelectItem></SelectContent>
        </Select>
        <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />Réinitialiser</Button>
      </div>

      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left px-4 py-3">Parent</th><th className="text-left px-4 py-3">Contact</th><th className="text-left px-4 py-3">Enfant(s)</th><th className="text-left px-4 py-3">Paiement</th><th className="text-left px-4 py-3">Compte</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs font-semibold">{p.firstName[0]}{p.lastName[0]}</AvatarFallback></Avatar>
                    <div><div className="font-semibold">{p.firstName} {p.lastName}</div><div className="text-xs text-muted-foreground">{p.relation}</div></div>
                  </div></td>
                  <td className="px-4 py-3 text-xs"><div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{p.email}</div><div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" />{p.phone}</div></td>
                  <td className="px-4 py-3">{p.children}</td>
                  <td className="px-4 py-3">{p.balance > 0
                    ? <span className="text-xs font-semibold text-danger">{p.balance} € dû</span>
                    : <span className="text-xs font-semibold text-success">À jour</span>}</td>
                  <td className="px-4 py-3"><span className={cn("text-xs font-medium px-2 py-0.5 rounded-md", p.blocked ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>{p.blocked ? "Bloqué" : "Actif"}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" title={p.blocked ? "Débloquer" : "Bloquer"} onClick={() => { setItems((s) => s.map((x) => x.id === p.id ? { ...x, blocked: !x.blocked } : x)); toast.success(p.blocked ? "Compte débloqué" : "Compte bloqué"); }}>
                      {p.blocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setToDelete(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Aucun parent trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} total={filtered.length} shown={rows.length} onPage={setPage} label="parents" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Modifier le parent" : "Ajouter un parent"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom"><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
            <Field label="Nom"><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            <Field label="Lien"><Select value={form.relation} onValueChange={(v) => setForm({ ...form, relation: v as Parent["relation"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Père">Père</SelectItem><SelectItem value="Mère">Mère</SelectItem><SelectItem value="Tuteur">Tuteur</SelectItem></SelectContent></Select></Field>
            <Field label="Téléphone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <div className="col-span-2"><Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field></div>
            <div className="col-span-2"><Field label="Enfant(s) rattaché(s)"><Input value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} placeholder="Ex : Lina Benali (6e A)" /></Field></div>
            <Field label="Solde dû (€)"><Input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: Number(e.target.value) || 0 })} /></Field>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button><Button onClick={save}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Supprimer ce parent ?</AlertDialogTitle>
            <AlertDialogDescription>{toDelete?.firstName} {toDelete?.lastName} sera définitivement supprimé.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setItems((s) => s.filter((x) => x.id !== toDelete?.id)); toast.success("Parent supprimé"); setToDelete(null); }}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

export function Pager({ page, pages, total, shown, onPage, label }: { page: number; pages: number; total: number; shown: number; onPage: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
      <span>Affichage de {shown} sur {total} {label}</span>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="h-8 w-8" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <Button key={n} size="sm" variant={n === page ? "default" : "ghost"} className="h-8 w-8 p-0" onClick={() => onPage(n)}>{n}</Button>
        ))}
        <Button size="icon" variant="ghost" className="h-8 w-8" disabled={page >= pages} onClick={() => onPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
