// API Route para Destack Builder
// Maneja todas las operaciones del editor visual

import { handleEditorApi } from 'destack/build/server'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { destack: string[] } }
) {
  const result = await handleEditorApi(request, params.destack)
  return result
}

export async function POST(
  request: NextRequest,
  { params }: { params: { destack: string[] } }
) {
  const result = await handleEditorApi(request, params.destack)
  return result
}
