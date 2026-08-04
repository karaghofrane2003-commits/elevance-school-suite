import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — Scolaris" },
      {
        name: "description",
        content:
          "Connectez-vous à Scolaris pour accéder au tableau de bord de gestion de votre établissement scolaire.",
      },
      { property: "og:title", content: "Connexion — Scolaris" },
      {
        property: "og:description",
        content: "Accès sécurisé à l'espace de gestion scolaire Scolaris.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("marie.dubois@scolaris.fr");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen grid place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.674_0.176_250)] text-primary-foreground">
            <GraduationCap className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">Scolaris</div>
            <div className="text-[11px] text-muted-foreground font-medium">École Sainte-Marie</div>
          </div>
        </div>

        <h1 className="mt-6 text-xl font-bold tracking-tight">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous avez été déconnecté. Reconnectez-vous pour continuer.
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/" });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full gap-1.5">
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
        </form>
      </div>
    </main>
  );
}
