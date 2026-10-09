import { createFileRoute } from "@tanstack/react-router";
import { TemplateEditor } from "./template";

export const Route = createFileRoute("/editor-membro/$id")({
  head: () => ({ meta: [
    { title: "Minhas Palavras — Código da Pregação Memorável" },
    { name: "description", content: "Personalize sua pregação e retome seu rascunho salvo na sua conta." },
    { property: "og:title", content: "Minhas Palavras — Código da Pregação Memorável" },
    { property: "og:description", content: "Seu rascunho de pregação com salvamento automático e progresso de preenchimento." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: MemberEditorPage,
});

function MemberEditorPage() {
  const { id } = Route.useParams();
  return <TemplateEditor key={id} memberDraftId={id} />;
}