import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { ClassesPage } from "@/components/dashboard/classes";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Classes — Scolaris" },
      {
        name: "description",
        content:
          "Créez et gérez les classes : professeur principal, salle, capacité, effectifs et affectation des élèves.",
      },
      { property: "og:title", content: "Classes — Scolaris" },
      {
        property: "og:description",
        content:
          "Organisation pédagogique complète : classes, professeurs principaux, effectifs et affectations d'élèves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardShell>
      <ClassesPage />
      <Toaster />
    </DashboardShell>
  );
}
