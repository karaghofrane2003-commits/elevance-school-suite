import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { AnnouncementsPage } from "@/components/dashboard/announcements";

export const Route = createFileRoute("/annonces")({
  head: () => ({
    meta: [
      { title: "Annonces — Scolaris" },
      {
        name: "description",
        content:
          "Créez, publiez et gérez les annonces de votre établissement : audience ciblée, pièces jointes PDF, priorité et brouillons.",
      },
      { property: "og:title", content: "Annonces — Scolaris" },
      {
        property: "og:description",
        content:
          "Gestion complète des communications scolaires : brouillons, publications, audiences et pièces jointes.",
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
      <AnnouncementsPage />
      <Toaster />
    </DashboardShell>
  );
}
