-- Reporte SEO y GEO — tablas (PENDIENTE de aplicar: hoy los datos van en Storage, bucket privado "reportes-seo").
-- Se dejó en Storage porque desde el Mac no hay acceso SQL al proyecto (sin contraseña de BD ni token de Supabase).
-- Para pasar a tablas: correr este SQL en el panel de Supabase (SQL editor) y cambiar lib/reportes/servidor.ts y el recolector.
create table if not exists reporte_clientes (id text primary key, nombre text not null, sitio text not null, desde text not null);
create table if not exists reporte_meses (
  cliente_id text references reporte_clientes(id) on delete cascade, mes text not null,
  periodo jsonb not null, gsc jsonb, ga4 jsonb, visibilidad jsonb, indexacion jsonb, articulos jsonb,
  errores jsonb default '[]', generado timestamptz default now(), primary key (cliente_id, mes));
create table if not exists reporte_acciones (id bigserial primary key, cliente_id text references reporte_clientes(id) on delete cascade, mes text not null, fecha date not null, texto text not null);
create table if not exists reporte_busquedas (id bigserial primary key, cliente_id text references reporte_clientes(id) on delete cascade, mes text not null,
  fuente text not null check (fuente in ('gsc','visibilidad')), busqueda text not null, clics int, impresiones int, posicion numeric,
  google int, chatgpt int, chatgpt_veces text, chatgpt_mencion boolean, competidores jsonb);
-- Acceso: app_metadata.reportes = {rol:'cliente', cliente:'<id>'} o {rol:'admin'} (solo lo cambia la service key)
create or replace function reporte_puede_ver(c text) returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' -> 'reportes' ->> 'rol') = 'admin', false)
      or (auth.jwt() -> 'app_metadata' -> 'reportes' ->> 'cliente') = c $$;
alter table reporte_clientes enable row level security;
alter table reporte_meses enable row level security;
alter table reporte_acciones enable row level security;
alter table reporte_busquedas enable row level security;
create policy "ver cliente" on reporte_clientes for select using (reporte_puede_ver(id));
create policy "ver meses" on reporte_meses for select using (reporte_puede_ver(cliente_id));
create policy "ver acciones" on reporte_acciones for select using (reporte_puede_ver(cliente_id));
create policy "ver busquedas" on reporte_busquedas for select using (reporte_puede_ver(cliente_id));
