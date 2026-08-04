import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { ProfilePage } from "@/components/dashboard/profile";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Scolaris" },
      {
        name: "description",
        content:
          "Consultez et modifiez vos informations personnelles, votre fonction et la sécurité de votre compte Scolaris.",
      },
      { property: "og:title", content: "Mon profil — Scolaris" },
      {
        property: "og:description",
        content: "Gérez vos informations de compte administrateur sur la plateforme Scolaris.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DashboardShell>
      <ProfilePage />
      <Toaster />
    </DashboardShell>
  );
}
