'use client'

import Link from 'next/link'
import { Award, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react'
import type { AgenciaScore } from '@/lib/data/ranking-criteria'

interface RankingCardProps {
  agencia: AgenciaScore
  diferenciadores?: string[]
  servicios?: string[]
  contacto?: { email?: string; phone?: string; web?: string }
  isMyP?: boolean
}

const rankColors: Record<number, { bg: string; border: string; badge: string; text: string }> = {
  1: { bg: 'bg-gradient-to-br from-yellow-50 to-amber-50', border: 'border-yellow-300 ring-2 ring-yellow-200', badge: 'bg-yellow-400 text-yellow-900', text: 'text-yellow-700' },
  2: { bg: 'bg-gradient-to-br from-gray-50 to-slate-50', border: 'border-gray-300', badge: 'bg-gray-400 text-white', text: 'text-gray-600' },
  3: { bg: 'bg-gradient-to-br from-orange-50 to-amber-50', border: 'border-orange-300', badge: 'bg-orange-400 text-white', text: 'text-orange-700' },
}

export default function RankingCard({ agencia, diferenciadores, servicios, contacto, isMyP }: RankingCardProps) {
  const colors = rankColors[agencia.rank] || { bg: 'bg-white', border: 'border-gray-200', badge: 'bg-gray-200 text-gray-700', text: 'text-gray-500' }

  return (
    <article
      className={`rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 ${colors.bg} ${colors.border} ${isMyP ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'}`}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${colors.badge}`}>
            #{agencia.rank}
          </span>
          <div>
            <h3 className="text-xl font-bold text-gray-900" itemProp="name">
              {agencia.nombre}
            </h3>
            <p className={`text-sm font-medium ${colors.text}`}>
              {agencia.destacado}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-gray-900">{agencia.score}</div>
          <div className="text-xs text-gray-500 font-medium">/100</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${agencia.rank === 1 ? 'bg-yellow-400' : agencia.rank <= 3 ? 'bg-blue-500' : 'bg-gray-400'}`}
          style={{ width: `${agencia.score}%` }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Diferenciadores */}
        {diferenciadores && diferenciadores.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Diferenciadores
            </h4>
            <ul className="space-y-1">
              {diferenciadores.map((d, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Servicios */}
        {servicios && servicios.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicios</h4>
            <div className="flex flex-wrap gap-1.5">
              {servicios.map((s, i) => (
                <span key={i} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-600">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ideal para + ROAS */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-500">
          <strong>Ideal para:</strong> {agencia.idealPara}
        </span>
        {agencia.roas && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-semibold px-2.5 py-0.5 rounded-full text-xs">
            <TrendingUp className="w-3 h-3" /> ROAS {agencia.roas}
          </span>
        )}
      </div>

      {/* CTA for M&P */}
      {isMyP && contacto && (
        <div className="mt-5 pt-4 border-t border-yellow-200 flex flex-wrap gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Solicitar Cotización
          </Link>
          <Link
            href="https://wa.me/56992258137"
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Directo
          </Link>
          {contacto.web && (
            <Link
              href={`https://${contacto.web}`}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm"
              itemProp="url"
            >
              <ExternalLink className="w-3.5 h-3.5" /> {contacto.web}
            </Link>
          )}
        </div>
      )}
    </article>
  )
}
