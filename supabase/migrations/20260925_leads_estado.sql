-- Pipeline de estados para leads (vista equipo /crm/leads)
-- Estados: nuevo, contactado, cotizacion, vendido, no_contesta, desechado
-- El motivo se guarda en la columna existente razon_no_venta.

alter table leads add column if not exists estado text not null default 'nuevo';

alter table leads drop constraint if exists leads_estado_check;
alter table leads add constraint leads_estado_check
  check (estado in ('nuevo', 'contactado', 'cotizacion', 'vendido', 'no_contesta', 'desechado'));

-- Backfill desde los booleanos actuales
update leads set estado = case
  when vendido then 'vendido'
  when contactado then 'contactado'
  else 'nuevo'
end;

create index if not exists leads_cliente_fecha_idx on leads (cliente_id, fecha_ingreso desc);

notify pgrst, 'reload schema';
