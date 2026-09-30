import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { ParentsPage } from "@/components/dashboard/parents";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Parents — Scolaris" },
      { name: "description", content: "Gérez les responsables légaux : coordonnées, enfants rattachés, paiements et comptes." },
      { property: "og:title", content: "Parents — Scolaris" },
      { property: "og:description", content: "Annuaire des parents avec suivi des paiements et gestion des comptes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell>
      <ParentsPage />
      <Toaster />
    </DashboardShell>
  ),
});
