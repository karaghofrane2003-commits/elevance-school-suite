import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { StudentsPage } from "@/components/dashboard/students";

export const Route = createFileRoute("/eleves")({
  head: () => ({
    meta: [
      { title: "Élèves — Scolaris" },
      {
        name: "description",
        content:
          "Gérez les dossiers élèves : identité, classe, responsables légaux, assiduité, résultats, scolarité et statut.",
      },
      { property: "og:title", content: "Élèves — Scolaris" },
      {
        property: "og:description",
        content:
          "Dossiers élèves complets avec filtres par classe, cycle et statut, fiche détaillée et export CSV.",
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
      <StudentsPage />
      <Toaster />
    </DashboardShell>
  );
}
