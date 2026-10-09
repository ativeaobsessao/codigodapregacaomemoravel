-- Execute no SQL Editor do banco existente. Não recria nenhuma tabela.
-- Garante que cada usuária só consulte e altere os próprios rascunhos.
begin;
grant select, insert, update on public.rascunhos_usuario to authenticated;
grant all on public.rascunhos_usuario to service_role;
revoke all on public.rascunhos_usuario from anon;
alter table public.rascunhos_usuario enable row level security;

-- Políticas restritivas impedem que políticas antigas permissivas exponham outras usuárias.
drop policy if exists "member_drafts_owner_guard" on public.rascunhos_usuario;
create policy "member_drafts_owner_guard" on public.rascunhos_usuario
  as restrictive for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "member_drafts_owner_read" on public.rascunhos_usuario;
create policy "member_drafts_owner_read" on public.rascunhos_usuario
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "member_drafts_owner_insert" on public.rascunhos_usuario;
create policy "member_drafts_owner_insert" on public.rascunhos_usuario
  for insert to authenticated with check (
    user_id = auth.uid() and exists (
      select 1 from public.esbocos where id = esboco_original_id
    )
  );
drop policy if exists "member_drafts_owner_update" on public.rascunhos_usuario;
create policy "member_drafts_owner_update" on public.rascunhos_usuario
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.member_drafts_touch() returns trigger
language plpgsql set search_path = public as $$
begin
  if TG_OP = 'UPDATE' then
    new.user_id := old.user_id;
    new.esboco_original_id := old.esboco_original_id;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists member_drafts_touch on public.rascunhos_usuario;
create trigger member_drafts_touch before insert or update on public.rascunhos_usuario
  for each row execute function public.member_drafts_touch();
create index if not exists member_drafts_resume_idx
  on public.rascunhos_usuario (user_id, esboco_original_id, updated_at desc)
  where status <> 'arquivado';
commit;