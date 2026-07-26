import { useMemo, useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Paperclip,
  Pencil,
  Trash2,
  FileText,
  X,
  Upload,
  Send,
  Save,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Audience = "all" | "parents" | "teachers" | "students";
type Priority = "normal" | "important" | "urgent";
type Status = "draft" | "published";

type Attachment = { name: string; size: string };

type Announcement = {
  id: string;
  title: string;
  content: string;
  audience: Audience;
  priority: Priority;
  status: Status;
  publishedAt: string;
  attachments: Attachment[];
};

const audienceLabels: Record<Audience, string> = {
  all: "Tout l'établissement",
  parents: "Parents",
  teachers: "Professeurs",
  students: "Élèves",
};

const priorityLabels: Record<Priority, string> = {
  normal: "Normale",
  important: "Importante",
  urgent: "Urgente",
};

const priorityStyles: Record<Priority, string> = {
  normal: "border-border text-muted-foreground bg-muted/60",
  important:
    "border-[color-mix(in_oklab,var(--warning)_35%,transparent)] text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]",
  urgent:
    "border-[color-mix(in_oklab,var(--destructive)_35%,transparent)] text-[var(--destructive)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]",
};

const initialData: Announcement[] = [
  {
    id: "a1",
    title: "Réunion parents-professeurs du 2e trimestre",
    content:
      "Les entretiens individuels se tiendront le samedi 14 février de 9h à 13h. Merci de réserver votre créneau via l'espace parents avant le 7 février.",
    audience: "parents",
    priority: "important",
    status: "published",
    publishedAt: "2026-01-28",
    attachments: [{ name: "planning-entretiens.pdf", size: "248 Ko" }],
  },
  {
    id: "a2",
    title: "Fermeture exceptionnelle — intempéries",
    content:
      "En raison des alertes météorologiques, l'établissement restera fermé le lundi 2 février. Les cours reprendront normalement le mardi.",
    audience: "all",
    priority: "urgent",
    status: "published",
    publishedAt: "2026-01-31",
    attachments: [],
  },
  {
    id: "a3",
    title: "Nouvelles modalités de saisie des notes",
    content:
      "La saisie des évaluations passe au nouveau module. Un guide détaillé est joint à cette annonce.",
    audience: "teachers",
    priority: "normal",
    status: "published",
    publishedAt: "2026-01-20",
    attachments: [
      { name: "guide-saisie-notes.pdf", size: "1,2 Mo" },
      { name: "calendrier-evaluations.pdf", size: "96 Ko" },
    ],
  },
  {
    id: "a4",
    title: "Voyage scolaire en Italie — appel à inscription",
    content:
      "Brouillon en préparation : détails du voyage, tarifs et documents d'autorisation parentale.",
    audience: "students",
    priority: "normal",
    status: "draft",
    publishedAt: "2026-02-10",
    attachments: [],
  },
  {
    id: "a5",
    title: "Mise à jour du règlement intérieur",
    content:
      "Le règlement intérieur a été révisé par le conseil d'établissement. Merci d'en prendre connaissance.",
    audience: "all",
    priority: "important",
    status: "draft",
    publishedAt: "2026-02-05",
    attachments: [{ name: "reglement-interieur-2026.pdf", size: "512 Ko" }],
  },
];

const emptyDraft: Omit<Announcement, "id"> = {
  title: "",
  content: "",
  audience: "all",
  priority: "normal",
  status: "draft",
  publishedAt: new Date().toISOString().slice(0, 10),
  attachments: [],
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(initialData);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [audienceFilter, setAudienceFilter] = useState<"all" | Audience>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<Omit<Announcement, "id">>(emptyDraft);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Announcement | null>(null);

  const counts = useMemo(
    () => ({
      all: items.length,
      published: items.filter((i) => i.status === "published").length,
      draft: items.filter((i) => i.status === "draft").length,
    }),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (filter !== "all" && i.status !== filter) return false;
        if (audienceFilter !== "all" && i.audience !== audienceFilter) return false;
        if (query && !i.title.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [items, filter, audienceFilter, query],
  );

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyDraft, publishedAt: new Date().toISOString().slice(0, 10) });
    setOpen(true);
  }

  function openEdit(a: Announcement) {
    setEditing(a);
    const { id: _id, ...rest } = a;
    setForm({ ...rest, attachments: [...a.attachments] });
    setOpen(true);
  }

  function save(status: Status) {
    if (!form.title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    const payload = { ...form, status, title: form.title.trim() };
    if (editing) {
      setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...payload, id: editing.id } : i)));
      toast.success(status === "published" ? "Annonce publiée." : "Brouillon mis à jour.");
    } else {
      setItems((prev) => [{ ...payload, id: crypto.randomUUID() }, ...prev]);
      toast.success(status === "published" ? "Annonce publiée." : "Brouillon enregistré.");
    }
    setOpen(false);
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((f) => ({
      name: f.name,
      size: `${Math.max(1, Math.round(f.size / 1024))} Ko`,
    }));
    setForm((f) => ({ ...f, attachments: [...f.attachments, ...next] }));
  }

  function confirmDelete() {
    if (!toDelete) return;
    setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
    toast.success("Annonce supprimée.");
    setToDelete(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Megaphone className="h-3.5 w-3.5" /> Communication
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[28px]">Annonces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rédigez, publiez et gérez les communications de l'établissement.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nouvelle annonce
        </Button>
      </div>

      {/* Filters */}
      <div className="card-elegant p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
            {(["all", "published", "draft"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === key
                    ? "bg-card text-foreground shadow-[0_1px_2px_rgb(15_23_42_/_0.06)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {key === "all" ? "Toutes" : key === "published" ? "Publiées" : "Brouillons"}
                <span className="ml-1.5 text-[10px] text-muted-foreground">{counts[key]}</span>
              </button>
            ))}
          </div>

          <Select
            value={audienceFilter}
            onValueChange={(v) => setAudienceFilter(v as "all" | Audience)}
          >
            <SelectTrigger className="h-9 w-[190px] text-xs">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les audiences</SelectItem>
              <SelectItem value="parents">Parents</SelectItem>
              <SelectItem value="teachers">Professeurs</SelectItem>
              <SelectItem value="students">Élèves</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative ml-auto w-full sm:w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une annonce…"
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[280px] text-[11px] uppercase tracking-[0.08em]">
                  Annonce
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Audience</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Priorité</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Statut</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Publication</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.08em]">Pièces</TableHead>
                <TableHead className="w-[100px] text-right text-[11px] uppercase tracking-[0.08em]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="group">
                  <TableCell className="py-3">
                    <div className="font-semibold text-sm leading-tight">{a.title}</div>
                    <div className="mt-1 line-clamp-1 max-w-[420px] text-xs text-muted-foreground">
                      {a.content}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {audienceLabels[a.audience]}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                        priorityStyles[a.priority],
                      )}
                    >
                      {priorityLabels[a.priority]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          a.status === "published" ? "bg-[var(--success)]" : "bg-muted-foreground/50",
                        )}
                      />
                      {a.status === "published" ? "Publiée" : "Brouillon"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(a.publishedAt)}
                  </TableCell>
                  <TableCell>
                    {a.attachments.length ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5" />
                        {a.attachments.length}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(a)}
                        aria-label={`Modifier ${a.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setToDelete(a)}
                        aria-label={`Supprimer ${a.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] hover:text-[var(--destructive)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="mt-3 text-sm font-semibold">Aucune annonce</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ajustez vos filtres ou créez une nouvelle annonce.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'annonce" : "Nouvelle annonce"}</DialogTitle>
            <DialogDescription>
              Renseignez le contenu, l'audience et la date de publication.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={form.title}
                maxLength={140}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex. Réunion parents-professeurs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                rows={5}
                maxLength={2000}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Rédigez le message adressé à votre audience…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={form.audience}
                  onValueChange={(v) => setForm((f) => ({ ...f, audience: v as Audience }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="teachers">Professeurs</SelectItem>
                    <SelectItem value="students">Élèves</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Priority }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="important">Importante</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date de publication</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pièces jointes (PDF)</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                <Upload className="h-4 w-4" />
                Glissez un PDF ou cliquez pour parcourir
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>
              {form.attachments.length > 0 && (
                <ul className="space-y-1.5">
                  {form.attachments.map((att, idx) => (
                    <li
                      key={`${att.name}-${idx}`}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-xs font-medium">{att.name}</span>
                      <span className="text-[11px] text-muted-foreground">{att.size}</span>
                      <button
                        aria-label={`Retirer ${att.name}`}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            attachments: f.attachments.filter((_, i) => i !== idx),
                          }))
                        }
                        className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => save("draft")} className="gap-2">
              <Save className="h-4 w-4" /> Enregistrer le brouillon
            </Button>
            <Button onClick={() => save("published")} className="gap-2">
              <Send className="h-4 w-4" /> Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {toDelete?.title} » sera définitivement retirée. Cette action est irréversible.
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
