'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: string
  plataforma: string
  inversion: number
  clicks: number
  impresiones: number
  conversiones: number
  ctr: number
  cpc: number
  cpm: number
}

interface CampaignsTableProps {
  campanas: Campaign[]
}

export default function CampaignsTable({ campanas }: CampaignsTableProps) {
  const [sortField, setSortField] = useState<keyof Campaign>('inversion')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(Math.round(num))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(num)
  }

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedCampanas = [...campanas].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    return 0
  })

  const SortIcon = ({ field }: { field: keyof Campaign }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activa' },
      PAUSED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pausada' },
      ARCHIVED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivada' }
    }

    const config = statusConfig[status] || statusConfig.PAUSED

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPlatformBadge = (plataforma: string) => {
    const platformConfig: Record<string, { bg: string; text: string; label: string }> = {
      meta_ads: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Meta Ads' },
      google_ads: { bg: 'bg-red-100', text: 'text-red-800', label: 'Google Ads' }
    }

    const config = platformConfig[plataforma] || platformConfig.meta_ads

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  if (campanas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No hay campañas disponibles en este periodo</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('campaign_name')}
              >
                Campaña <SortIcon field="campaign_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('campaign_status')}
              >
                Estado <SortIcon field="campaign_status" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('plataforma')}
              >
                Plataforma <SortIcon field="plataforma" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('inversion')}
              >
                Inversión <SortIcon field="inversion" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('clicks')}
              >
                Clicks <SortIcon field="clicks" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('impresiones')}
              >
                Impresiones <SortIcon field="impresiones" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('ctr')}
              >
                CTR <SortIcon field="ctr" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider cursor-pointer hover:bg-blue-100"
                onClick={() => handleSort('cpc')}
              >
                CPC <SortIcon field="cpc" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampanas.map((campana, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {campana.campaign_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(campana.campaign_status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPlatformBadge(campana.plataforma)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(campana.inversion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatNumber(campana.clicks)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatNumber(campana.impresiones)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {campana.ctr.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatCurrency(campana.cpc)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
