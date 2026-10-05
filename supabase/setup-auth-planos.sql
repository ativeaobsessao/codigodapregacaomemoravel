-- Rode UMA vez no Supabase: SQL Editor > New query > colar > Run.
-- Não recria a tabela esbocos. A trava usa a coluna "plano" (basico|premium) que já existe.

-- 1) PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  plano text not null default 'basico' check (plano in ('basico','premium')),
  role text not null default 'cliente' check (role in ('admin','cliente')),
  avatar_url text,
  lgpd_consent_at timestamptz,
  status text not null default 'ativo',
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- Funções auxiliares (security definer evita recursão no RLS)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;
create or replace function public.meu_plano() returns text
language sql stable security definer set search_path = public as $$
  select plano from public.profiles where id = auth.uid() and status = 'ativo'
$$;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- A aluna só pode mudar foto, consentimento e status (não plano/role)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create or replace function public.protege_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    new.plano := old.plano; new.role := old.role; new.email := old.email;
    if new.status not in ('ativo','solicitou_exclusao') then new.status := old.status; end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_protege_profile on public.profiles;
create trigger trg_protege_profile before update on public.profiles
  for each row execute function public.protege_profile();

-- Cria profile automaticamente quando um usuário é criado
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, lower(new.email))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) ESBOCOS: troca as políticas abertas por políticas com plano/role
drop policy if exists "anon select" on public.esbocos;
drop policy if exists "anon insert" on public.esbocos;
drop policy if exists "anon update" on public.esbocos;
drop policy if exists "anon delete" on public.esbocos;
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='esbocos' loop
    execute format('drop policy %I on public.esbocos', p.policyname);
  end loop;
end $$;
revoke all on public.esbocos from anon;
grant select, insert, update, delete on public.esbocos to authenticated;
grant all on public.esbocos to service_role;
alter table public.esbocos enable row level security;

create policy "esbocos_select_plano" on public.esbocos for select to authenticated
  using (public.is_admin() or public.meu_plano() = 'premium'
         or (public.meu_plano() = 'basico' and coalesce(plano,'basico') = 'basico'));
create policy "esbocos_admin_insert" on public.esbocos for insert to authenticated with check (public.is_admin());
create policy "esbocos_admin_update" on public.esbocos for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "esbocos_admin_delete" on public.esbocos for delete to authenticated using (public.is_admin());

-- Vitrine: só títulos/tags dos publicados (para mostrar o cadeado). Sem conteúdo.
create or replace view public.esbocos_catalogo as
  select id, created_at, tema, tags_dor, tags_tema, livro_biblico, tempo_estimado, plano, status
  from public.esbocos where status = 'publicado';
grant select on public.esbocos_catalogo to anon, authenticated;

-- 3) STORAGE avatars (público, cada uma só mexe na própria pasta <user_id>/...)
insert into storage.buckets (id, name, public) values ('avatars','avatars', true)
  on conflict (id) do update set public = true;
drop policy if exists "avatars_read" on storage.objects;
create policy "avatars_read" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
