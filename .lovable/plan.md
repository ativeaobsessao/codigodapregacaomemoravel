Validar acesso: link por e-mail, cadeado Premium e /admin

Só testes. Nenhum arquivo do site muda, a não ser que algum teste falhe.

## 1) Login com link por e-mail
- Pedir um link de acesso para um e-mail de admin (carlassoares099@gmail.com) e conferir que o pedido é aceito e o aviso verde "Enviamos um link" aparece.
- Pedir para um e-mail que nunca comprou e conferir que aparece "Não encontramos uma compra com esse e-mail".
- Conferir no banco que o endereço de volta do link está liberado (o site publicado e a prévia). Se não estiver, te explico onde liberar no Supabase.
- Ainda vou precisar que você abra o e-mail e clique no link, porque eu não tenho acesso à sua caixa de entrada.

## 2) Cadeado nos esboços Premium
- Confirmar no banco que existe pelo menos 1 esboço Básico e 1 Premium. Se não houver Premium, te aviso. Não vou criar um esboço de mentira.
- Sem entrar na conta: a página inicial mostra os cards, com 🔒 nos Premium, e abrir um esboço pede para entrar.
- Como aluna Básica (conta de teste temporária, que eu apago no final): ela vê o 🔒, e ao abrir um Premium aparece "Este esboço é do plano Premium" sem mostrar o conteúdo. Ela consegue abrir um esboço Básico normalmente.
- Também testar direto no banco que uma aluna Básica não consegue ler o conteúdo Premium.

## 3) Admin no /admin
- Entrar como admin na prévia e conferir que o botão do topo mostra "Acesso Admin" e que o /admin abre o painel com os totais e a Biblioteca Atual.
- Conferir que a aluna Básica de teste vê "Sua conta não tem permissão de admin".
- Confirmar no banco que as duas contas estão como admin + premium.

## Resultado
Te mando um relatório simples com cada item passou ou falhou. Se algo falhar, te digo o que corrigir antes de mexer.

## Detalhes técnicos
- Scripts de teste em /tmp, chamando o banco com a chave pública e uma sessão de teste. Navegação automática com Playwright em localhost:8080.
- Para a aluna de teste e para entrar como admin vou precisar da chave secreta que já está salva. A conta de teste é criada e excluída por ela.
