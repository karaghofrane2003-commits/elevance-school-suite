import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { AbsencesPage } from "@/components/dashboard/absences";

export const Route = createFileRoute("/absences")({
  head: () => ({
    meta: [
      { title: "Absences — Scolaris" },
      { name: "description", content: "Suivi des absences et retards : saisie, justification, notification des parents et export." },
      { property: "og:title", content: "Absences — Scolaris" },
      { property: "og:description", content: "Gestion quotidienne des absences et retards des élèves." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DashboardShell>
      <AbsencesPage />
      <Toaster />
    </DashboardShell>
  ),
});
