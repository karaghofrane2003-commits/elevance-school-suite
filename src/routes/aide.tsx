import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { HelpPage } from "@/components/dashboard/help";

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Aide & support — Scolaris" },
      {
        name: "description",
        content:
          "Questions fréquentes, documentation et contact direct avec l'équipe support de la plateforme scolaire Scolaris.",
      },
      { property: "og:title", content: "Aide & support — Scolaris" },
      {
        property: "og:description",
        content: "Trouvez une réponse rapide ou contactez le support Scolaris en quelques secondes.",
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
      <HelpPage />
      <Toaster />
    </DashboardShell>
  );
}
