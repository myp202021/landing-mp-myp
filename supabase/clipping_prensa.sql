-- Tabla para Clipping Prensa Transporte (Hualpén)
-- Piloto: medios chilenos en Instagram filtrados por keywords de transporte.

create table if not exists clipping_prensa (
  id bigserial primary key,
  fecha_reporte date not null,
  red_social text not null default 'Instagram',
  medio text not null,
  handle text,
  url text,
  texto text,
  matched_keywords text[],
  fecha_post timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists clipping_prensa_fecha_idx on clipping_prensa(fecha_reporte);
create index if not exists clipping_prensa_medio_idx on clipping_prensa(medio);
