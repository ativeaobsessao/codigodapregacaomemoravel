<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Auth/roles live in the user's own Supabase (`profiles.role`/`plano`, RLS in supabase/setup-auth-planos.sql); browser client in src/lib/supabase.ts — why: no Lovable Cloud, single external DB.
- Payment webhooks go through src/routes/api/public/webhook-kiwify.ts → `liberarAcesso(email, plano)` — why: gateway-agnostic, swap provider by mapping to {email, plano}.
- Public listing reads view `esbocos_catalogo` (no content columns); full esboço reads table under RLS — why: show locks without leaking premium content.
- Member draft reads and writes use the existing authenticated browser client and owner-scoped RLS; the template editor is shared with the draft-ID route — why: preserve the external database and existing editor without duplicating the UI.
