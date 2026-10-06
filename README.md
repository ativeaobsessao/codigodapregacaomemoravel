# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Acesso, planos e Kiwify

1. Rode `supabase/setup-auth-planos.sql` no Supabase (SQL Editor).
2. **Para criar primeiro admin:** Supabase Dashboard > Authentication > Add User > crie email/senha > depois Table Editor > profiles > edite role para admin e plano para premium.
3. Webhook Kiwify (Produtos > Webhook > Venda Aprovada):
   `https://codigodapregacaomemoravel.lovable.app/api/public/webhook-kiwify`
   Use o mesmo token da Kiwify no segredo `KIWIFY_TOKEN`. Valores: 19,90 = básico; 24,90 e 29,90 = premium.
   Outros gateways: POST `{ "email": "...", "plano": "basico|premium" }` em `.../webhook-kiwify?token=SEU_TOKEN`.
4. Subir esboço diário pelo /admin não precisa de deploy.
