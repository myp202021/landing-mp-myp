'use client'

/**
 * UPLOAD PAGE - Subir archivos de Meta Ads
 * Drag & drop para .csv, .xls, .xlsx
 */

import { useState, useEffect, useCallback } from 'react'

interface Cliente {
  id: string
  nombre: string
  rubro: string | null
}

interface UploadResult {
  success: boolean
  carga_id?: number
  filename?: string
  summary?: {
    total_rows: number
    rows_ok: number
    rows_error: number
    rows_duplicados: number
  }
  columnas_detectadas?: string[]
  mapeo_campos?: Record<string, string>
  errores?: Array<{ row: number; error: string; data: any }>
  duplicados_sample?: Array<{ row: number; reason: string; data: any }>
  error?: string
  message?: string
}

export default function UploadPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/crm/clientes')
      const data = await res.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Error fetching clientes:', error)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['csv', 'xls', 'xlsx']
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (!ext || !validExtensions.includes(ext)) {
      alert('Formato inválido. Use .csv, .xls o .xlsx')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Archivo muy grande. Máximo 5MB')
      return
    }

    setFile(file)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file || !selectedCliente) {
      alert('Seleccione un cliente y un archivo')
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('clientId', selectedCliente)
      formData.append('rubro', 'Meta Ads')

      const res = await fetch('/api/crm/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.status === 409) {
        // Archivo duplicado
        setResult({
          success: false,
          error: data.error,
          message: data.message
        })
      } else if (!res.ok) {
        throw new Error(data.error || 'Error subiendo archivo')
      } else {
        setResult(data)
        setFile(null)
      }
    } catch (error: any) {
      console.error('Error uploading:', error)
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Subir Leads de Meta</h1>
            <p className="text-gray-600 mt-1">
              Carga archivos .csv, .xls o .xlsx exportados desde Meta Ads
            </p>
          </div>

          {/* Cliente selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Cliente *
            </label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value="">Seleccionar...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.rubro ? `(${c.rubro})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                dragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-gray-600">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-medium mb-2">
                  Arrastra tu archivo aquí
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  o haz clic para seleccionar
                </p>
                <label className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                  Seleccionar archivo
                  <input
                    type="file"
                    onChange={handleFileInput}
                    accept=".csv,.xls,.xlsx"
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  .csv, .xls, .xlsx • Máximo 5MB • 5,000 filas
                </p>
              </div>
            </div>
          )}

          {/* File selected */}
          {file && !result && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Archivo seleccionado</h3>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Nombre:</strong> {file.name}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Tamaño:</strong> {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={uploading || !selectedCliente}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        uploading || !selectedCliente
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {uploading ? 'Procesando...' : 'Subir y Procesar'}
                    </button>
                    <button
                      onClick={resetUpload}
                      disabled={uploading}
                      className="px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-lg p-6 ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-bold text-lg mb-4 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? '✅ Archivo procesado' : '❌ Error'}
              </h3>

              {result.error && (
                <p className="text-red-700 mb-4">{result.error}</p>
              )}

              {result.message && (
                <p className="text-red-700 mb-4">{result.message}</p>
              )}

              {result.summary && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Total filas</p>
                      <p className="text-2xl font-bold text-gray-900">{result.summary.total_rows}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Insertadas ✅</p>
                      <p className="text-2xl font-bold text-green-600">{result.summary.rows_ok}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Errores ❌</p>
                      <p className="text-2xl font-bold text-red-600">{result.summary.rows_error}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-600">Duplicados 🔁</p>
                      <p className="text-2xl font-bold text-orange-600">{result.summary.rows_duplicados}</p>
                    </div>
                  </div>

                  {result.columnas_detectadas && (
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-semibold mb-2">Columnas detectadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.columnas_detectadas.map((col, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.errores && result.errores.length > 0 && (
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-semibold text-red-700 mb-2">
                        Primeros errores detectados:
                      </p>
                      <div className="space-y-2 text-xs">
                        {result.errores.slice(0, 5).map((err, i) => (
                          <div key={i} className="border-l-2 border-red-300 pl-3">
                            <p className="text-red-700">Fila {err.row}: {err.error}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.duplicados_sample && result.duplicados_sample.length > 0 && (
                    <div className="bg-white rounded p-4">
                      <p className="text-sm font-semibold text-orange-700 mb-2">
                        Ejemplos de duplicados:
                      </p>
                      <div className="space-y-2 text-xs">
                        {result.duplicados_sample.map((dup, i) => (
                          <div key={i} className="border-l-2 border-orange-300 pl-3">
                            <p className="text-orange-700">Fila {dup.row}: {dup.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={resetUpload}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Subir otro archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
