'use client'

/**
 * LOGO UPLOADER COMPONENT
 * Componente para subir logos de plantillas con validaciones:
 * - Formatos: PNG, JPG, JPEG, WebP
 * - Tamaño máximo: 500 KB
 * - Dimensiones: 200x75px a 800x300px
 * - Preview en tiempo real
 * - Redimensión automática
 */

import { useState, useRef, ChangeEvent } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

interface LogoUploaderProps {
  currentLogoUrl?: string | null
  clienteId?: string
  plantillaId?: number
  onUploadSuccess: (logoUrl: string, filename: string) => void
  onUploadError?: (error: string) => void
}

// Configurar cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LogoUploader({
  currentLogoUrl,
  clienteId,
  plantillaId,
  onUploadSuccess,
  onUploadError
}: LogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validar archivo
  const validateFile = (file: File): string | null => {
    // Validar tipo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'Formato no válido. Solo PNG, JPG, JPEG o WebP'
    }

    // Validar tamaño (500 KB)
    const maxSize = 500 * 1024 // 500 KB
    if (file.size > maxSize) {
      return `Archivo muy grande. Máximo 500 KB (tu archivo: ${Math.round(file.size / 1024)} KB)`
    }

    return null
  }

  // Validar dimensiones de imagen
  const validateDimensions = (img: HTMLImageElement): string | null => {
    const minWidth = 200
    const minHeight = 75
    const maxWidth = 800
    const maxHeight = 300

    if (img.width < minWidth || img.height < minHeight) {
      return `Imagen muy pequeña. Mínimo ${minWidth}x${minHeight}px (tu imagen: ${img.width}x${img.height}px)`
    }

    if (img.width > maxWidth || img.height > maxHeight) {
      return `Imagen muy grande. Máximo ${maxWidth}x${maxHeight}px (tu imagen: ${img.width}x${img.height}px)`
    }

    // Validar aspect ratio aproximado (más ancho que alto)
    const aspectRatio = img.width / img.height
    if (aspectRatio < 1.5 || aspectRatio > 6) {
      return 'Proporción incorrecta. El logo debe ser horizontal/rectangular (ej: 400x150px)'
    }

    return null
  }

  // Redimensionar imagen si excede límites
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Error al redimensionar imagen'))
            }
          },
          file.type,
          0.95 // Calidad 95%
        )
      }

      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Manejar selección de archivo
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    await processFile(file)
  }

  // Procesar archivo
  const processFile = async (file: File) => {
    setError(null)
    setUploading(true)

    try {
      // Validar archivo
      const fileError = validateFile(file)
      if (fileError) {
        setError(fileError)
        setUploading(false)
        if (onUploadError) onUploadError(fileError)
        return
      }

      // Crear preview y validar dimensiones
      const reader = new FileReader()
      reader.onload = async (e) => {
        const img = document.createElement('img')
        img.onload = async () => {
          const dimError = validateDimensions(img)
          if (dimError) {
            setError(dimError)
            setUploading(false)
            if (onUploadError) onUploadError(dimError)
            return
          }

          // Mostrar preview
          setPreview(e.target?.result as string)

          // Subir a Supabase
          await uploadToSupabase(file)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      const errorMsg = err.message || 'Error al procesar imagen'
      setError(errorMsg)
      setUploading(false)
      if (onUploadError) onUploadError(errorMsg)
    }
  }

  // Subir a Supabase Storage
  const uploadToSupabase = async (file: File) => {
    try {
      // Generar nombre único
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = clienteId
        ? `cliente-${clienteId}-${timestamp}.${fileExt}`
        : `plantilla-${plantillaId || 'temp'}-${timestamp}.${fileExt}`

      // Subir archivo
      const { data, error: uploadError } = await supabase.storage
        .from('plantillas-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('plantillas-logos')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl

      // Callback de éxito
      onUploadSuccess(publicUrl, fileName)
      setUploading(false)
    } catch (err: any) {
      const errorMsg = err.message || 'Error al subir imagen a Supabase'
      setError(errorMsg)
      setUploading(false)
      if (onUploadError) onUploadError(errorMsg)
    }
  }

  // Manejar drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  // Eliminar logo
  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de drag & drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : preview
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          // Preview del logo
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative bg-white p-4 rounded-lg border border-gray-200">
                <Image
                  src={preview}
                  alt="Preview del logo"
                  width={400}
                  height={150}
                  className="max-w-full h-auto"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Cambiar Logo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          // Área de upload
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-blue-600 hover:text-blue-800 font-semibold disabled:opacity-50"
              >
                Seleccionar archivo
              </button>
              <p className="text-sm text-gray-500 mt-1">o arrastra y suelta aquí</p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              PNG, JPG, JPEG o WebP (máx. 500 KB)
              <br />
              Dimensiones: 200x75px a 800x300px
              <br />
              Recomendado: 400x150px (horizontal)
            </p>
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {/* Loader */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-3">Subiendo logo...</p>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 text-sm mb-2">
          Especificaciones del Logo
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Formato horizontal/rectangular (más ancho que alto)</li>
          <li>• Fondo transparente (PNG) recomendado</li>
          <li>• Alta resolución para impresión en PDF</li>
          <li>• El logo se mostrará en cotizaciones e interfaz</li>
        </ul>
      </div>
    </div>
  )
}
