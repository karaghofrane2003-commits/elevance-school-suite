import { useState } from "react";
import { BookOpen, LifeBuoy, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Comment inscrire un nouvel élève ?",
    a: "Rendez-vous dans Élèves puis cliquez sur « Inscrire un élève ». Renseignez l'identité, la scolarité et le responsable légal, puis validez.",
  },
  {
    q: "Comment publier une annonce ciblée ?",
    a: "Dans Annonces, créez une annonce, choisissez l'audience (parents, professeurs, élèves ou tous), ajoutez une pièce jointe PDF si besoin, puis publiez.",
  },
  {
    q: "Comment affecter un professeur principal à une classe ?",
    a: "Ouvrez Classes, modifiez la classe concernée et sélectionnez le professeur principal dans la liste déroulante.",
  },
  {
    q: "Comment réinitialiser le mot de passe d'un professeur ?",
    a: "Dans Professeurs, ouvrez le menu d'actions du professeur et choisissez « Réinitialiser le mot de passe ». Un lien lui sera envoyé par e-mail.",
  },
  {
    q: "Puis-je exporter mes données ?",
    a: "Oui. Les pages Élèves, Professeurs et Classes disposent d'un bouton « Exporter » générant un fichier CSV.",
  },
];

export function HelpPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Merci de renseigner un sujet et un message.");
      return;
    }
    toast.success("Votre demande a été envoyée au support. Réponse sous 24 h.");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Assistance
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Aide &amp; support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Documentation, questions fréquentes et contact direct avec notre équipe.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, title: "Documentation", desc: "Guides pas à pas de chaque module." },
          { icon: Phone, title: "01 84 80 12 30", desc: "Lun–Ven, 8 h 30 – 18 h 00." },
          { icon: Mail, title: "support@scolaris.fr", desc: "Réponse sous 24 heures ouvrées." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground">
              <c.icon className="h-[18px] w-[18px]" />
            </div>
            <div className="mt-3 text-sm font-semibold">{c.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Questions fréquentes</h2>
          </div>
          <Accordion type="single" collapsible className="mt-2">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Contacter le support</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="Ex. Problème d'affectation de classe"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                placeholder="Décrivez votre demande…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button className="w-full gap-1.5" onClick={submit}>
              <Send className="h-4 w-4" />
              Envoyer la demande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
