import { useState } from "react";
import { Mail, Phone, MapPin, Shield, Save, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ProfilePage() {
  const [form, setForm] = useState({
    firstName: "Marie",
    lastName: "Dubois",
    email: "marie.dubois@scolaris.fr",
    phone: "+33 6 12 45 78 90",
    role: "Directrice",
    address: "12 rue des Lilas, 75011 Paris",
    bio: "Directrice de l'École Sainte-Marie depuis 2018. En charge du pilotage pédagogique et administratif.",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Compte
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Mon profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vos informations personnelles et les paramètres de votre compte administrateur.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar className="h-20 w-20 ring-4 ring-background">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[oklch(0.674_0.176_250)] text-primary-foreground text-xl font-bold">
              {form.firstName[0]}
              {form.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold truncate">
                {form.firstName} {form.lastName}
              </h2>
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                {form.role}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {form.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {form.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {form.address}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Fonction</Label>
            <Input id="role" value={form.role} onChange={(e) => set("role", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Présentation</Label>
            <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button className="gap-1.5" onClick={() => toast.success("Profil mis à jour")}>
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.success("Lien de changement de mot de passe envoyé à " + form.email)}
          >
            <KeyRound className="h-4 w-4" />
            Changer le mot de passe
          </Button>
        </div>
      </div>
    </div>
  );
}
