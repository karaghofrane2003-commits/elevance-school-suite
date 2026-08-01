import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { TeachersPage } from "@/components/dashboard/teachers";

export const Route = createFileRoute("/professeurs")({
  head: () => ({
    meta: [
      { title: "Professeurs — Scolaris" },
      {
        name: "description",
        content:
          "Gérez le corps enseignant : comptes, matières, classes affectées, charge horaire, absences et sécurité des accès.",
      },
      { property: "og:title", content: "Professeurs — Scolaris" },
      {
        property: "og:description",
        content:
          "Création, modification, blocage de compte, réinitialisation de mot de passe et affectations des professeurs.",
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
      <TeachersPage />
      <Toaster />
    </DashboardShell>
  );
}
