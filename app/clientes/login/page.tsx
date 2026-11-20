// Login de las áreas de clientes. El middleware lo muestra en la misma URL del cliente (/<slug>) con ?area=<slug>.
import { AREAS, esSlug } from '@/lib/reportes/areas'
import FormLogin from './FormLogin'

export const dynamic = 'force-dynamic'

export default function LoginReportes({ searchParams }: { searchParams: { area?: string } }) {
  const area = searchParams.area && esSlug(searchParams.area) ? searchParams.area : null
  const a = area ? AREAS[area] : null
  return <FormLogin area={area} nombre={a?.nombre || null} logo={a && area !== 'mulleryperez' ? a.logo || null : null} />
}
