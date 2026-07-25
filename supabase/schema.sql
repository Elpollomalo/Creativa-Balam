-- Creativa Balam — Diagnóstico de Marketing
-- Pegar una sola vez en Supabase Dashboard → SQL Editor → Run.
-- Un registro por usuario (auth.uid()) — reenviar el formulario actualiza
-- el mismo registro en vez de crear uno nuevo.

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  correo text not null,
  idioma text not null default 'es',
  respuestas jsonb not null default '{}'::jsonb,
  telefono_contacto text,
  quiere_revision boolean not null default false,
  n8n_enviado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.diagnosticos enable row level security;

create policy "usuarios ven su propio diagnostico"
  on public.diagnosticos for select
  using (auth.uid() = user_id);

create policy "usuarios crean su propio diagnostico"
  on public.diagnosticos for insert
  with check (auth.uid() = user_id);

create policy "usuarios editan su propio diagnostico"
  on public.diagnosticos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists diagnosticos_set_updated_at on public.diagnosticos;
create trigger diagnosticos_set_updated_at
  before update on public.diagnosticos
  for each row execute function public.set_updated_at();

-- Storage: documento adicional opcional (whitepaper/brochure/catálogo).
-- Cada usuario solo puede subir/leer dentro de su propia carpeta ({user_id}/...).
insert into storage.buckets (id, name, public)
values ('diagnostico-documentos', 'diagnostico-documentos', false)
on conflict (id) do nothing;

create policy "usuarios suben a su propia carpeta"
  on storage.objects for insert
  with check (
    bucket_id = 'diagnostico-documentos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "usuarios leen su propia carpeta"
  on storage.objects for select
  using (
    bucket_id = 'diagnostico-documentos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
