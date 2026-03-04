'use client'

import { Copy } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all cursor-pointer"
    >
      <Copy className="w-4 h-4" /> Copiar texto
    </button>
  )
}
