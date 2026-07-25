import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHome } from "@/components/dashboard/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Scolaris" },
      {
        name: "description",
        content:
          "Pilotage global de votre établissement : élèves, absences, annonces, activité des parents et professeurs.",
      },
      { property: "og:title", content: "Tableau de bord — Scolaris" },
      {
        property: "og:description",
        content:
          "Une vue d'ensemble élégante et complète de votre école, en temps réel.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardShell>
      <DashboardHome />
    </DashboardShell>
  );
}
