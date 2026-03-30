'use client'

import { useState } from 'react'
import type { GrillaPost } from './grillas-types'

interface Props {
  post: GrillaPost
  onSave: (updated: GrillaPost) => void
  onClose: () => void
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function GrillaPostEditModal({ post, onSave, onClose }: Props) {
  const [form, setForm] = useState<GrillaPost>({ ...post })

  const update = (field: keyof GrillaPost, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Editar Publicación</h2>
            <p className="text-blue-200 text-sm">{post.dia_semana} {post.dia} — {post.plataforma}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-light">✕</button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
              <select
                value={form.plataforma}
                onChange={e => update('plataforma', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook/Instagram">Facebook/Instagram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Post</label>
              <select
                value={form.tipo_post}
                onChange={e => update('tipo_post', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Post">Post</option>
                <option value="Carrusel">Carrusel</option>
                <option value="Video">Video</option>
                <option value="Reel">Reel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día del mes</label>
              <input
                type="number"
                min={1}
                max={31}
                value={form.dia}
                onChange={e => update('dia', parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Día de la semana</label>
              <select
                value={form.dia_semana}
                onChange={e => update('dia_semana', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copy</label>
            <textarea
              value={form.copy}
              onChange={e => update('copy', e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
            />
            <p className="text-xs text-gray-400 mt-1">{form.copy.split(/\s+/).filter(Boolean).length} palabras</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
            <input
              type="text"
              value={form.hashtags}
              onChange={e => update('hashtags', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nota interna (equipo)</label>
            <textarea
              value={form.nota_interna}
              onChange={e => update('nota_interna', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-amber-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
