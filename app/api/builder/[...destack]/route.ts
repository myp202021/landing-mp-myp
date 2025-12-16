// API Route para Destack Builder
// Maneja todas las operaciones del editor visual

// @ts-ignore - Destack no tiene tipos TypeScript
import { handleEditor } from 'destack/build/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Convertir Next.js Request a formato compatible con Destack
  const url = new URL(request.url)
  const req = {
    method: 'GET',
    query: Object.fromEntries(url.searchParams),
  }

  const res = {
    status: (code: number) => ({
      json: (data: any) => NextResponse.json(data, { status: code })
    }),
    json: (data: any) => NextResponse.json(data),
    writeHead: () => {},
    end: () => NextResponse.json({})
  }

  return await handleEditor(req as any, res as any)
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const req = {
    method: 'POST',
    query: Object.fromEntries(url.searchParams),
  }

  const res = {
    status: (code: number) => ({
      json: (data: any) => NextResponse.json(data, { status: code })
    }),
    json: (data: any) => NextResponse.json(data),
    writeHead: () => {},
    end: () => NextResponse.json({})
  }

  return await handleEditor(req as any, res as any)
}
