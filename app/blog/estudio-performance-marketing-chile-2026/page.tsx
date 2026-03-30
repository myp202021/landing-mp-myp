// Redirect handled by next.config.js (301 permanent)
// This file exists to preserve the route structure
// Destination: /investigacion/estudio-performance-marketing-chile-2026
import { permanentRedirect } from 'next/navigation'

export default function RedirectEstudio() {
  permanentRedirect('/investigacion/estudio-performance-marketing-chile-2026')
}
