import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { sheetUrl } = body

    if (!sheetUrl || typeof sheetUrl !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Se requiere un enlace válido de Google Sheets.' },
        { status: 400 }
      )
    }

    // Extract Spreadsheet ID from Google Sheet URL
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
    if (!match || !match[1]) {
      return NextResponse.json(
        { success: false, message: 'No se pudo identificar el ID del Google Sheet en el enlace ingresado.' },
        { status: 400 }
      )
    }

    const spreadsheetId = match[1]
    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`

    const res = await fetch(exportUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Google Drive respondió con código ${res.status}. Asegurate de que la hoja tenga el acceso público ("Cualquier persona con el enlace puede ver").`,
        },
        { status: 400 }
      )
    }

    const csvText = await res.text()

    if (!csvText || csvText.includes('<!DOCTYPE html>') || csvText.includes('accounts.google.com')) {
      return NextResponse.json(
        {
          success: false,
          message: 'La hoja de cálculo requiere permisos de acceso. Cambia el acceso de la hoja en Google Drive a "Cualquier persona con el enlace".',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      spreadsheetId,
      csvText,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Error al conectar con Google Drive.' },
      { status: 500 }
    )
  }
}
