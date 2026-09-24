import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify it's from Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch(
      'https://api.github.com/repos/myp202021/myp-daily-agent/actions/workflows/reporte-diario.yml/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GH_PAT}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    )

    if (res.status === 204) {
      return NextResponse.json({ ok: true, message: 'Daily agent triggered' })
    } else {
      const text = await res.text()
      return NextResponse.json({ ok: false, status: res.status, error: text }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
