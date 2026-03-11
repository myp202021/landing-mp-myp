'use client'

import { TrendingUp, Award } from 'lucide-react'
import type { AgenciaScore } from '@/lib/data/ranking-criteria'

interface RankingTableProps {
  agencias: AgenciaScore[]
  title: string
  showRoas?: boolean
}

export default function RankingTable({ agencias, title, showRoas = true }: RankingTableProps) {
  return (
    <div className="overflow-x-auto">
      {/* Desktop table */}
      <table className="hidden md:table w-full border-collapse" aria-label={title}>
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">#</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Agencia</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Destacado</th>
            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500">Score</th>
            {showRoas && (
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500">ROAS</th>
            )}
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ideal para</th>
          </tr>
        </thead>
        <tbody>
          {agencias.map((a) => (
            <tr
              key={a.nombre}
              className={`border-b border-gray-100 transition-colors ${
                a.rank === 1
                  ? 'bg-yellow-50 hover:bg-yellow-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <td className="py-3 px-4">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  a.rank === 1
                    ? 'bg-yellow-400 text-yellow-900'
                    : a.rank === 2
                    ? 'bg-gray-300 text-gray-800'
                    : a.rank === 3
                    ? 'bg-orange-300 text-orange-900'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {a.rank}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`font-bold ${a.rank === 1 ? 'text-yellow-800' : 'text-gray-900'}`}>
                  {a.nombre}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 max-w-xs">{a.destacado}</td>
              <td className="py-3 px-4 text-center">
                <span className={`font-black text-lg ${a.rank === 1 ? 'text-yellow-700' : 'text-gray-800'}`}>
                  {a.score}
                </span>
                <span className="text-xs text-gray-400">/100</span>
              </td>
              {showRoas && (
                <td className="py-3 px-4 text-center">
                  {a.roas ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full text-xs">
                      <TrendingUp className="w-3 h-3" /> {a.roas}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              )}
              <td className="py-3 px-4 text-sm text-gray-500">{a.idealPara}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {agencias.map((a) => (
          <div
            key={a.nombre}
            className={`rounded-xl border p-4 ${
              a.rank === 1
                ? 'border-yellow-300 bg-yellow-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                  a.rank === 1
                    ? 'bg-yellow-400 text-yellow-900'
                    : a.rank === 2
                    ? 'bg-gray-300 text-gray-800'
                    : a.rank === 3
                    ? 'bg-orange-300 text-orange-900'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {a.rank}
                </span>
                <span className="font-bold text-gray-900">{a.nombre}</span>
              </div>
              <span className="font-black text-lg text-gray-800">{a.score}<span className="text-xs text-gray-400">/100</span></span>
            </div>
            <p className="text-xs text-gray-600 mb-1">{a.destacado}</p>
            <div className="flex items-center gap-2 mt-2">
              {a.roas && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full text-xs">
                  <TrendingUp className="w-3 h-3" /> {a.roas}
                </span>
              )}
              <span className="text-xs text-gray-400">{a.idealPara}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
